import "./Footer.css";
import Newsletter from "./Newsletter";

export default function Footer() {
  return (
    <div className="footer">
      <div className="newsletter">
        <h3>Subscribe to the newsletter</h3>
        <Newsletter />
      </div>
      <div className="footer-links">
        <p>© 2024 Kiril Stojanovski</p>
        <a href="/">Home</a>
        <a href="/archive">Archive</a>
        <a href="/about">About</a>
      </div>
    </div>
  );
}
