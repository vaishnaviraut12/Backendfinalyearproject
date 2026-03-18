import axios from "axios";

const API_KEY = "53127e4b2195d8e4caf6";
const SECRET = "497e0b24cd9469a6a7e81cc3cfec59c7ea5019ab3fd7650a4413a6782311dd72";

export async function uploadToPinata(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        pinata_api_key: API_KEY,
        pinata_secret_api_key: SECRET,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
}
