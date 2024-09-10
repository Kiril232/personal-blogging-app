import "./Footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-newsletter">
        <h3>Subscribe to the newsletter</h3>{" "}
        <input
          placeholder="E-mail"
          className="mainInput newsletter-input"
          type="text"
        />
        <button type="submit" className="newsletter-submit">
          Subscribe
        </button>
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
