import { ReactComponent as LogoIpsum } from "./logoipsum.svg";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import Navbar from "./Navbar.js";
import { LogOut } from "lucide-react";
import { auth } from "./firebase.js";
import { signOut } from "firebase/auth";

export default function Header({ user, isAdmin, currPage }) {
  const dropDownMenu = document.getElementsByClassName("user-menu");
  const logout = async () => {
    await signOut(auth);
  };
  const navigate = useNavigate();

  if (user) {
    return (
      <div className="header-container">
        <div className="header">
          <LogoIpsum className="logo" />
          <h1>Blog</h1>
          <div className="user-container">
            {user.displayName ? (
              <p className="hello-msg">{user.displayName}</p>
            ) : (
              <p className="hello-msg-email">{user.email}</p>
            )}
            <img
              onClick={() => {
                dropDownMenu[0].classList.toggle("user-menu-open");
              }}
              src={user.photoURL}
              className="profile-pic user-icon"
            />
            <div className="user-menu">
              <LogOut onClick={logout} className="logout-icon" />
              <p onClick={logout}>Sign out</p>
            </div>
          </div>
        </div>
        <hr />
        <Navbar currPage={currPage} isAdmin={isAdmin} />
      </div>
    );
  } else {
    return (
      <div className="header-container">
        <div className="header">
          <LogoIpsum className="logo" />
          <h1>Blog</h1>
          <div className="button-wrapper">
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="sign-in-button"
            >
              Sign in
            </button>
          </div>
        </div>
        <hr />
        <Navbar currPage={currPage} isAdmin={isAdmin} />
      </div>
    );
  }
}
