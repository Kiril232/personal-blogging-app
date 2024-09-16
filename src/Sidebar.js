import "./Sidebar.css";
import Newsletter from "./Newsletter";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Blog Newsletter</h2>
      <p>
        Stay updated with my latest posts and content by subscribing to my
        newsletter. Enter your email below to join the community and never miss
        an update.
      </p>
      <Newsletter />
    </div>
  );
}
