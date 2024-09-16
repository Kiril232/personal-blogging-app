import "./Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar({ currPage, isAdmin }) {
  return (
    <div>
      <div className="navbar">
        {currPage === "home" ? (
          <Link to="/" className="navbar-link">
            <span className="navbar-item curr-page">Home</span>
          </Link>
        ) : (
          <Link to="/" className="navbar-link">
            <span className="navbar-item">Home</span>
          </Link>
        )}

        {currPage === "archive" ? (
          <Link to="/archive" className="navbar-link">
            <span className="navbar-item curr-page">Archive</span>
          </Link>
        ) : (
          <Link to="/archive" className="navbar-link">
            <span className="navbar-item">Archive</span>
          </Link>
        )}

        {currPage === "about" ? (
          <Link to="/about" className="navbar-link">
            <span className="navbar-item curr-page">About</span>
          </Link>
        ) : (
          <Link to="/about" className="navbar-link">
            <span className="navbar-item">About</span>
          </Link>
        )}

        {isAdmin && currPage === "write" && (
          <Link to="/create" className="navbar-link">
            <span className="navbar-item curr-page">Write</span>
          </Link>
        )}

        {isAdmin && currPage !== "write" && (
          <Link to="/create" className="navbar-link">
            <span className="navbar-item">Write</span>
          </Link>
        )}
      </div>
      <hr />
    </div>
  );
}
