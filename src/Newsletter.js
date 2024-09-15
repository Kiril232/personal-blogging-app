import { useState } from "react";
import { db } from "./firebase";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const handleSubscribe = async (e) => {
    e.preventDefault();

    const q = query(collection(db, "subscribers"), where("email", "==", email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      setEmail("");
      return;
    }
    const newEmail = addDoc(collection(db, "subscribers"), {
      email: email,
    });
    setEmail("");
  };

  return (
    <form className="newsletter-container" onSubmit={handleSubscribe}>
      <input
        placeholder="E-mail"
        className="mainInput newsletter-input"
        type="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        value={email}
      />
      <button type="submit" className="newsletter-submit">
        Subscribe
      </button>
    </form>
  );
}
