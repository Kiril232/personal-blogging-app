import "./Footer.css";
import Newsletter from "./Newsletter";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="footer">
      <div className="newsletter">
        <h3>Subscribe to the newsletter</h3>
        <Newsletter />
      </div>
      <div className="footer-links">
        <p>© 2024 Kiril Stojanovski</p>
        <Link to="/">Home</Link>
        <Link to="/archive">Archive</Link>
        <Link to="/about">About</Link>
      </div>
    </div>
  );
}
