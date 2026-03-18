import React from 'react';
import { HelpCircle, Activity, Users, BookOpen } from 'lucide-react'; // Optional: Install lucide-react for icons

const Resources = () => {
  const resourceLinks = [
    {
      title: "Help Center",
      desc: "Detailed guides on buying and selling NFTs.",
      icon: <HelpCircle size={32} />,
      link: "#"
    },
    {
      title: "Platform Status",
      desc: "Check the real-time status of our services.",
      icon: <Activity size={32} />,
      link: "#"
    },
    {
      title: "Partners",
      desc: "Explore the creators and brands we work with.",
      icon: <Users size={32} />,
      link: "#"
    },
    {
      title: "Blog",
      desc: "The latest news and drops in the NFT space.",
      icon: <BookOpen size={32} />,
      link: "#"
    }
  ];

  return (
    <div className="resources-container animate">
      <h1 className="section-title">Resources</h1>
      <p className="section-subtitle">Everything you need to navigate our marketplace.</p>
      
      <div className="resources-grid">
        {resourceLinks.map((item, index) => (
          <div key={index} className="resource-card">
            <div className="resource-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <a href={item.link} className="resource-link">Learn More</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;