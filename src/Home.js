import Header from "./Header";
import Input from "./Input";
import Posts from "./Posts";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebase";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [showSorted, setShowSorted] = useState(false);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [user, setUser] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  function handleClick() {
    setShowSorted(!showSorted);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      setUser(currUser);
      if (user) {
        const q2 = query(
          collection(db, "admins"),
          where("uid", "==", auth.currentUser.uid)
        );
        const adminSnapshot = await getCountFromServer(q2);
        console.log("admin-count: " + adminSnapshot.data().count);
        if (adminSnapshot.data().count === 1) {
          setIsAdmin(true);
        }
      }
    });

    async function fetchCategories() {
      const categoriesSnapshot = await getDocs(collection(db, "categories"));
      setCategories(categoriesSnapshot.docs);
    }

    fetchCategories().then(() => {
      console.log("Successfully fetched categories.");
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return navigate("/login");
  }

  const previewStyle = {
    borderRadius: "50%",
    height: "70px",
    width: "70px",
  };

  return (
    <div>
      <Header />
      <h2>Hello, {user.displayName}</h2>
      <img
        src={user.photoURL}
        width="30px"
        height="30px"
        style={previewStyle}
      />
      <h1>Blog</h1>
      <Input handleChange={setSearch} />
      <button onClick={handleClick}>Sort</button>
      <select
        onChange={(e) => {
          setSelectedCategory(e.target.value);
        }}
      >
        <option value={""}>All posts</option>
        {categories.map((doc) => {
          return (
            <option value={doc.data().category}>{doc.data().category}</option>
          );
        })}
      </select>
      {isAdmin && (
        <button
          onClick={() => {
            navigate("/create");
          }}
        >
          Create post
        </button>
      )}
      <Posts
        search={search.toLowerCase()}
        sorted={showSorted}
        category={selectedCategory}
      />
    </div>
  );
}
