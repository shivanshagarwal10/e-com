// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer
      className="footer mt-auto py-3 border-top"
      style={{
        background: "var(--card-bg)",
        color: "var(--muted)",
      }}
    >
      <div className="container text-center small">
        <span>
          © {new Date().getFullYear()} <b>eCom</b>. All rights reserved.
        </span>
        <br />
        <span>Built with ❤️ using React & Spring Boot</span>
      </div>
    </footer>
  );
};

export default Footer;
