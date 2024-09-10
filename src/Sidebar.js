import "./Sidebar.css";
import Input from "./Input.js";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Pragma Newsletter</h2>
      <p>
        Stay updated with my latest posts and content by subscribing to my
        newsletter. Enter your email below to join the community and never miss
        an update.
      </p>
      <input
        placeholder="E-mail"
        className="mainInput newsletter-input"
        type="text"
      />
      <button type="submit" className="newsletter-submit">
        Subscribe
      </button>
    </div>
  );
}
