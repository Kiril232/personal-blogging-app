import { auth, db } from "./firebase";
import { ReactComponent as LogoIpsum } from "./logoipsum.svg";

import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Register from "./Register";
import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import "./Login.css";
import GoogleLogin from "./GoogleLogin";

export default function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerInProgress, setRegisterInProgress] = useState(false);
  const [hasAccount, setHasAccount] = useState(true);
  const navigate = useNavigate();

  const register = async (event) => {
    try {
      event.preventDefault();
      await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      ).then((newUser) => {
        setDoc(doc(db, "users", newUser.user.uid), {
          email: newUser.user.email,
          liked: [],
        });

        setRegisterInProgress(true);
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const login = async (event) => {
    try {
      event.preventDefault();
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  if (registerInProgress) {
    return (
      <div className="auth-container">
        <Header />
        <Register />
        <Footer />
      </div>
    );
  }

  return (
    <div className="auth-container">
      <Header />
      <div className="auth-content-container">
        {hasAccount ? (
          <div className="register-container">
            <LogoIpsum className="logo" />
            <h2>Welcome to Pragma!</h2>
            <p>If you have an account, enter your details to sign in:</p>
            <form onSubmit={login}>
              <input
                className="login-input"
                placeholder="E-mail"
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                }}
              />
              <input
                type="password"
                className="login-input"
                placeholder="Password"
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                }}
              />
              <button type="submit" className="register-button">
                Sign in
              </button>
            </form>
            <p>or</p>
            <GoogleLogin />
            <p
              onClick={() => {
                setHasAccount(false);
              }}
            >
              Don't have an account?{" "}
              <strong className="switch">Sign up here</strong>
            </p>
          </div>
        ) : (
          <div className="register-container">
            <LogoIpsum className="logo" />

            <h2>Welcome to Pragma!</h2>
            <p>
              Register to create your first account and start exploring the
              blog:
            </p>
            <GoogleLogin />
            <p>or</p>
            <h2>Create an account:</h2>
            <form onSubmit={register}>
              <input
                className="login-input"
                placeholder="E-mail"
                onChange={(e) => {
                  setRegisterEmail(e.target.value);
                }}
              />
              <input
                type="password"
                className="login-input"
                placeholder="Password"
                onChange={(e) => {
                  setRegisterPassword(e.target.value);
                }}
              />

              <button type="submit" className="register-button">
                Register
              </button>
            </form>
            <p
              onClick={() => {
                setHasAccount(true);
              }}
            >
              Already have an account?{" "}
              <strong className="switch">Sign in here</strong>
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
