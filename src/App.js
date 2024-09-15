import Home from "./Home";
import CreatePost from "./CreatePost";
import BlogPost from "./BlogPost";
import Login from "./Login";
import EditPost from "./EditPost";
import Archive from "./Archive";
import About from "./About";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebase";
import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";

function App() {
  const [user, setUser] = useState(auth.currentUser);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      setUser(currUser);
      if (auth.currentUser) {
        const q2 = query(
          collection(db, "admins"),
          where("uid", "==", auth?.currentUser?.uid)
        );
        const adminSnapshot = await getCountFromServer(q2);
        console.log("admin-count: " + adminSnapshot.data().count);
        if (adminSnapshot.data().count === 1) {
          setIsAdmin(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} isAdmin={isAdmin} />} />
        <Route
          path="/create"
          element={<CreatePost user={user} isAdmin={isAdmin} />}
        />
        <Route
          path="/archive"
          element={<Archive user={user} isAdmin={isAdmin} />}
        />
        <Route
          path="/about"
          element={<About user={user} isAdmin={isAdmin} />}
        />
        <Route
          path="/post/:slug"
          element={<BlogPost user={user} isAdmin={isAdmin} />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/post/:slug/edit"
          element={<EditPost user={user} isAdmin={isAdmin} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
