// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public listPrice = 0.01 ether;

    struct ListedToken {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool currentlyListed;
    }

    mapping(uint256 => ListedToken) private idToListedToken;

    constructor() ERC721("NFTMarketplace", "NFT") {}

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function createToken(string memory tokenURI, uint256 price)
        public
        payable
        returns (uint256)
    {
        require(msg.value == listPrice, "Send listing fee");
        require(price > 0, "Price must be > 0");

        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(msg.sender),
            payable(msg.sender),
            price,
            true
        );

        return tokenId;
    }

    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint256 total = _tokenIds.current();
        uint256 count = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (idToListedToken[i].currentlyListed) {
                count++;
            }
        }

        ListedToken[] memory items = new ListedToken[](count);
        uint256 index = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (idToListedToken[i].currentlyListed) {
                items[index] = idToListedToken[i];
                index++;
            }
        }

        return items;
    }

    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint256 total = _tokenIds.current();
        uint256 count = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (
                idToListedToken[i].owner == msg.sender ||
                idToListedToken[i].seller == msg.sender
            ) {
                count++;
            }
        }

        ListedToken[] memory items = new ListedToken[](count);
        uint256 index = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (
                idToListedToken[i].owner == msg.sender ||
                idToListedToken[i].seller == msg.sender
            ) {
                items[index] = idToListedToken[i];
                index++;
            }
        }

        return items;
    }

    function executeSale(uint256 tokenId) public payable {
        ListedToken storage token = idToListedToken[tokenId];

        require(token.currentlyListed, "Not listed");
        require(msg.value == token.price, "Wrong price");

        address payable seller = token.seller;

        token.owner = payable(msg.sender);
        token.currentlyListed = false;

        _transfer(seller, msg.sender, tokenId);
        seller.transfer(msg.value);
    }

    // ✅ REQUIRED FOR REMOVE BUTTON
    function unlistNFT(uint256 tokenId) public {
        ListedToken storage token = idToListedToken[tokenId];

        require(token.currentlyListed, "NFT not listed");
        require(token.seller == msg.sender, "Only seller can unlist");

        token.currentlyListed = false;
    }
}
