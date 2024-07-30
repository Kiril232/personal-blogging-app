import { auth } from "./firebase";
import { useState, useEffect } from "react";
import Header from "./Header";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Use effect called.");
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
    });

    return () => unsubscribe();
  }, []);

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      console.log(user);
    } catch (err) {
      console.log(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const login = async () => {
    try {
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

  return (
    <div>
      <Header />
      <h2>Register:</h2>
      <input
        placeholder="E-mail"
        onChange={(e) => {
          setRegisterEmail(e.target.value);
        }}
      />
      <input
        placeholder="Password"
        onChange={(e) => {
          setRegisterPassword(e.target.value);
        }}
      />
      <button onClick={register}>Create user</button>
      <h2>Login:</h2>
      <input
        placeholder="E-mail"
        onChange={(e) => {
          setLoginEmail(e.target.value);
        }}
      />
      <input
        placeholder="Password"
        onChange={(e) => {
          setLoginPassword(e.target.value);
        }}
      />
      <button onClick={login}>Log in</button>
      <h2>Hello, {user?.email}</h2>
      <button onClick={logout}>Sign out</button>
    </div>
  );
}
