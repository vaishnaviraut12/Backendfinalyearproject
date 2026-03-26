import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import axios from "axios";
import marketplace from "./Marketplace.json";
import "./App.css";
import Sidebar from "./components/Sidebar";

// ✅ PRODUCTION API CONFIG
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;

/* ================= TOAST COMPONENT ================= */
const Toast = ({ toasts, removeToast }) => (
  <div style={{ position:"fixed", bottom:"30px", right:"30px", zIndex:9999, display:"flex", flexDirection:"column", gap:"12px" }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        background: t.type==="Sold"?"rgba(239,68,68,0.95)":t.type==="Purchased"?"rgba(0,246,255,0.95)":t.type==="Minted"?"rgba(123,97,255,0.95)":"rgba(30,41,59,0.97)",
        color:"#fff", padding:"14px 20px", borderRadius:"14px",
        boxShadow:"0 8px 32px rgba(0,0,0,0.4)", minWidth:"300px", maxWidth:"380px",
        display:"flex", alignItems:"flex-start", gap:"12px",
        animation:"slideIn 0.3s ease", backdropFilter:"blur(10px)",
        border:"1px solid rgba(255,255,255,0.1)"
      }}>
        <span style={{ fontSize:"1.4rem", lineHeight:1 }}>
          {t.type==="Sold"?"💸":t.type==="Purchased"?"🛒":t.type==="Minted"?"🎨":"🔔"}
        </span>
        <div style={{ flex:1 }}>
          <p style={{ fontWeight:"bold", margin:"0 0 3px", fontSize:"0.9rem" }}>{t.type}</p>
          <p style={{ margin:0, fontSize:"0.82rem", opacity:0.9, lineHeight:1.4 }}>{t.message}</p>
        </div>
        <button onClick={() => removeToast(t.id)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:"1.1rem", padding:0 }}>✕</button>
      </div>
    ))}
  </div>
);

/* ================= MODAL COMPONENT ================= */
const Modal = ({ modal, onClose, onConfirm }) => {
  if (!modal) return null;
  const isConfirm = modal.type === "confirm";
  const color = modal.variant === "error" ? "#f04f47" : modal.variant === "success" ? "#00c896" : modal.variant === "warning" ? "#f0b429" : "#00e5ff";
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9998 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:"#111520", border:`1px solid ${color}30`, borderRadius:"20px", padding:"36px", maxWidth:"420px", width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:"3rem", marginBottom:"15px" }}>{modal.icon || "ℹ️"}</div>
        <h3 style={{ color:"#f0f3fa", marginBottom:"10px" }}>{modal.title}</h3>
        <p style={{ color:"#8892a4", marginBottom:"20px" }}>{modal.message}</p>
        <div style={{ display:"flex", gap:"10px" }}>
          {isConfirm && <button onClick={onClose} style={{ flex:1, padding:"10px", borderRadius:"10px", background:"transparent", border:"1px solid #333", color:"#fff" }}>Cancel</button>}
          <button onClick={() => { onConfirm && onConfirm(); onClose(); }} style={{ flex:1, padding:"10px", borderRadius:"10px", background:color, color:"#000", border:"none", fontWeight:"bold" }}>{isConfirm ? "Confirm" : "OK"}</button>
        </div>
      </div>
    </div>
  );
};

/* ================= LOOTBOX HELPERS ================= */
const LOOT_ITEMS = [
  { id:"b1", name:"Bronze Warrior", image:"/loot/Nft3.png", rarity:"bronze", price:"0.03", category:"Gaming" },
  { id:"s1", name:"Silver Knight", image:"/loot/Nft12.png", rarity:"silver", price:"0.06", category:"Gaming" },
  { id:"g1", name:"Gold Helm", image:"/loot/Nft1.png", rarity:"gold", price:"0.15", category:"Gaming" },
  { id:"p1", name:"Purple Champion", image:"/loot/Nft7.png", rarity:"purple", price:"0.5", category:"Gaming" },
];

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [wallet, setWallet] = useState("");
  const [contract, setContract] = useState(null);
  const [view, setView] = useState("market");
  const [loading, setLoading] = useState(false);
  const [marketNFTs, setMarketNFTs] = useState([]);
  const [savedNFTs, setSavedNFTs] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);
  const [blockchainOnline, setBlockchainOnline] = useState(true);

  // Auth States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Toast & Modal Helpers
  const showToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };
  const showAlert = (message, variant="info", title="", icon="ℹ️") => setModal({ type:"alert", variant, title, message, icon });

  // ✅ BLOCKCHAIN LOADING LOGIC
  const loadAllNFTs = async () => {
    setLoading(true);
    let blockchainWorking = false;
    try {
      let readProvider;
      if (window.ethereum) {
        readProvider = new ethers.BrowserProvider(window.ethereum);
        const network = await readProvider.getNetwork();
        // If on local dev or specific network
        const readContract = new ethers.Contract(marketplace.address, marketplace.abi, readProvider);
        const listed = await readContract.getAllNFTs();
        const resolved = await Promise.all(listed.map(async (i) => {
           const tokenURI = await readContract.tokenURI(i.tokenId);
           const meta = await axios.get(tokenURI);
           return { tokenId: i.tokenId, seller: i.seller, owner: i.owner, price: i.price, image: meta.data.image, name: meta.data.name, category: meta.data.category };
        }));
        setMarketNFTs(resolved);
        setBlockchainOnline(true);
        blockchainWorking = true;
      }
    } catch (e) {
      console.log("Blockchain error, falling back to DB...");
    }

    if (!blockchainWorking) {
      setBlockchainOnline(false);
      try {
        const res = await axios.get(`${API}/api/nfts/all`);
        setMarketNFTs(res.data.map(n => ({ ...n, fromDB: true })));
      } catch (e) { setMarketNFTs([]); }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAllNFTs();
  }, [wallet]);

  // Wallet Connection
  const connectWallet = async () => {
    if (!window.ethereum) return showAlert("Please install MetaMask", "error");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setWallet(accounts[0]);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    setContract(new ethers.Contract(marketplace.address, marketplace.abi, signer));
  };

  const login = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      setAuthUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setView("market");
    } catch (e) { showAlert("Login Failed", "error"); }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setAuthUser(null);
    setWallet("");
    setView("market");
  };

  return (
    <div className="app-layout">
      <Sidebar setView={setView} />
      <div className="main">
        <div className="navbar">
          <div className="nav-left"><h1 onClick={() => setView("market")}>🎮 NFT Market</h1></div>
          <div className="nav-right">
            {!authUser ? (
              <button onClick={() => setView("login")}>Login</button>
            ) : (
              <>
                {!wallet ? <button onClick={connectWallet}>Connect Wallet</button> : <span className="wallet-box">{wallet.slice(0,6)}...</span>}
                <button onClick={logout}>Logout</button>
              </>
            )}
          </div>
        </div>

        {view === "market" && (
           <div className="animate">
             {!blockchainOnline && <div className="offline-banner">⚠️ Blockchain Offline - Showing DB fallback</div>}
             <div className="grid">
               {marketNFTs.map((nft, i) => (
                 <div key={i} className="nft-card">
                   <img src={nft.image} alt="" />
                   <h3>{nft.name}</h3>
                   <p>{nft.fromDB ? nft.price : ethers.formatEther(nft.price)} ETH</p>
                 </div>
               ))}
             </div>
           </div>
        )}

        {view === "login" && (
          <div className="auth-modal"><div className="auth-box">
            <h2>Login</h2>
            <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button onClick={login}>Login</button>
          </div></div>
        )}
      </div>
      <Toast toasts={toasts} removeToast={id => setToasts(toasts.filter(t => t.id !== id))} />
      <Modal modal={modal} onClose={() => setModal(null)} />
    </div>
  );
}

export default App;