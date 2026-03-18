🎮 Full-Stack NFT Marketplace

Web2 Authentication × Web3 Ownership
A production-style NFT Marketplace that seamlessly combines traditional login systems (Web2) with blockchain-based NFT trading (Web3).
Unlike basic NFT demos, this project enforces real user authentication before allowing wallet-based NFT minting and trading — the same architectural pattern used by real-world platforms.

🌟 Why This Project Stands Out

Most NFT projects rely only on wallets.
This project proves you understand real application design by combining:

🔐 Email/Password Authentication (Web2)
🦊 MetaMask Wallet (Web3)
📦 IPFS-based NFT Storage
⛓️ Smart-contract-enforced ownership & payments
👉 This makes the project far more realistic, secure, and scalable than tutorial-level NFT apps.

🚀 Key Features :
🔐 Authentication (Web2)

User registration & login (email + password)
Password hashing with bcrypt
JWT-based authentication
MongoDB Atlas database
Login required before minting or purchasing NFTs

🧠 Blockchain (Web3)

ERC-721 NFT smart contract
Mint NFTs with IPFS metadata (Pinata)
List NFTs for sale with a listing fee
Buy NFTs using cryptocurrency
Unlist NFTs from marketplace
On-chain ownership enforcement

🖼️ Marketplace UI
Browse listed NFTs
View minted NFTs
View purchased NFTs
Wallet-based ownership filtering

🏗️ Tech Stack
Frontend:

React.js
Ethers.js (v6)
Axios
CSS

Backend:

Node.js
Express.js
MongoDB Atlas
Mongoose
JWT
bcrypt
CORS

Blockchain:
Solidity
OpenZeppelin
Hardhat
IPFS (Pinata)

📁 Project Structure
marketplace/
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── Marketplace.json
│   │   └── App.css
│   ├── .env
│   └── package.json
│
├── backend/
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── smart-contract/
    └── NFTMarketplace.sol

⚙️ Environment Setup

Backend (backend/.env)
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key

Frontend (frontend/.env)
HTTPS=false

▶️ Running the Project Locally

1️⃣ Start Backend
cd backend
npm install
node server.js

Expected output:
MongoDB Connected Successfully
Server running on port 5000

2️⃣ Start Frontend
cd frontend
npm install
npm start

Open in browser:
http://localhost:3000

3️⃣ Smart Contract Deployment

Deploy NFTMarketplace.sol using Hardhat
Update Marketplace.json with:
Deployed contract address
ABI from compilation
Ensure MetaMask is connected to the same network

🧪 Application Flow

User registers and logs in
User connects MetaMask wallet
User mints NFT (listing fee required)
NFT metadata stored on IPFS
NFT appears in marketplace
Other users can purchase NFTs
Ownership updates on-chain

🔐 Security Considerations

Passwords are securely hashed
JWT used for session management
Smart contract enforces:
Ownership
Payments
Listing rules
For production:
Pinata keys should be moved to backend
HTTPS should be enabled
Wallet–user linking via signatures is recommended

📌 Future Enhancements

Wallet ↔ user linking using signed messages
Backend-only minting for enhanced security
NFT search, filters & sorting
Creator royalties
Platform service fees
Admin dashboard
Public deployment

👤 Author
Rohit Pradip Malokar
Vaishnavi Purushottam Raut
Shravan Jagdish Sharma
Riya Anand Kedar

⭐ Support & Feedback
If you found this project useful:
⭐ Star the repository
🍴 Fork it
🐛 Open issues for suggestions

🎯 This project demonstrates:
✔ Full-stack development
✔ Blockchain integration
✔ Secure authentication
✔ Real-world architecture