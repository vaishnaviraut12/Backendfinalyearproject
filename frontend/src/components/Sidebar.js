import React from "react";
import "./Sidebar.css";

function Sidebar({ setView }) {
  return (
    <div className="sidebar">

      <div className="logo">
        🌊 NFTSea
      </div>

      <ul className="menu">

        <li onClick={() => setView("market")}>
          🔍 Discover
        </li>

        <li onClick={() => setView("collections")}>
          📦 Collections
        </li>

        <li onClick={() => setView("tokens")}>
          🪙 Tokens
        </li>

        <li onClick={() => setView("swap")}>
          🔄 Swap
        </li>

        <li onClick={() => setView("drops")}>
          🎁 Drops
        </li>

        <li onClick={() => setView("activity")}>
          📊 Activity
        </li>

        <li onClick={() => setView("rewards")}>
          🏆 Rewards

        </li>

        

        <li onClick={() => setView("profile")}>
          👤 Profile
        </li>

<li onClick={() => setView("settings")}>
          ⚙️ Profile Settings</li>
        <li onClick={() => setView("profile")}>
          📚 Resources
        </li>

       
        
        


        

        

      </ul>

      

      

    </div>
  );
}

export default Sidebar;