import "./Navbar.css";

export default function Navbar({ currPage }) {
  return (
    <div>
      <div className="navbar">
        {currPage === "home" ? (
          <a href="/" className="navbar-link">
            <span className="navbar-item curr-page">Home</span>
          </a>
        ) : (
          <a href="/" className="navbar-link">
            <span className="navbar-item">Home</span>
          </a>
        )}

        {currPage === "archive" ? (
          <a href="/archive" className="navbar-link">
            <span className="navbar-item curr-page">Archive</span>
          </a>
        ) : (
          <a href="/archive" className="navbar-link">
            <span className="navbar-item">Archive</span>
          </a>
        )}

        {currPage === "about" ? (
          <a href="/about" className="navbar-link">
            <span className="navbar-item curr-page">About</span>
          </a>
        ) : (
          <a href="/about" className="navbar-link">
            <span className="navbar-item">About</span>
          </a>
        )}
      </div>
      <hr />
    </div>
  );
}
