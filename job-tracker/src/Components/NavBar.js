import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png';

const Navbar = () => {
  const [active, setActive] = useState("")
  const [toggle, setToggle] = useState(false);
  const navLinks = [
    {
      id: "home",
      title: "Home",
    },
    {
      id: "resume",
      title: "Resume",
    },
    {
      id: "new-application",
      title: "New Application",
    },
  ];

  return (
    <nav style={{ width: "100%", padding: "1.25rem 0", top: 0, zIndex: 20, backgroundColor: "#1a202c" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1120px", margin: "0 auto", width: "100%", padding: "0 2rem" }}>
            <Link 
              to="/"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              onClick={() => {
                  setActive("");
                  window.scrollTo(0, 0);
              }}
            >
              <img src={logo} alt="logo" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
              <p style={{ color: "white", fontSize: "18px", fontWeight: "bold", cursor: "pointer" }}>Job Application Organizer</p>
            </Link>

            <ul style={{ display: "flex", listStyleType: "none", flexDirection: "row", gap: "2.5rem" }}>
              {navLinks.map((link) => (
                <li 
                  key={link.id} 
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                  onClick={() => setActive(link.title)}
                >
                  <a 
                    href={link.id === 'home' ? `/` : `/${link.id}`} 
                    style={{ 
                      color: active === link.title ? "white" : "#718096", 
                      textDecoration: "none" 
                    }}
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>



        </div>
    </nav>

  )
}

export default Navbar
