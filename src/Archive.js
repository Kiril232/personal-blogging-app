import Header from "./Header.js";
import Posts from "./Posts.js";
import Footer from "./Footer.js";
import { useState, useEffect } from "react";
import "./Archive.css";
import { Search } from "lucide-react";
import { db } from "./firebase.js";
import { getDocs, getDoc, collection, doc } from "firebase/firestore";

export default function Archive({ user, isAdmin }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortType, setSortType] = useState("dm");
  const [likedOnly, setLikedOnly] = useState(false);
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const categoriesSnapshot = await getDocs(collection(db, "categories"));
      setCategories(categoriesSnapshot.docs);
    }

    fetchCategories().then(() => {
      console.log("Successfully fetched categories.");
    });
  }, []);

  useEffect(() => {
    async function fetchLiked() {
      const userRef = doc(db, "users", user.uid);
      const likedSnapshot = await getDoc(userRef);
      if (likedSnapshot.data().liked) {
        setLiked(likedSnapshot.data().liked);
      }
    }

    if (user) {
      fetchLiked();
    }
  }, [user]);

  return (
    <div>
      <Header user={user} isAdmin={isAdmin} currPage={"archive"} />
      <div className="archive-posts-container">
        <div className="archive-input-container">
          <Search className="archive-search" />
          <input
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search posts..."
            className="archive-input"
            type="text"
          />
          <select
            onChange={(e) => {
              setSelectedCategory(e.target.value);
            }}
          >
            <option value={""}>All categories</option>
            {categories.map((doc) => {
              return (
                <>
                  <option value={doc.data().category}>
                    {doc.data().category}
                  </option>
                </>
              );
            })}
          </select>
          <select
            onChange={(e) => {
              setSortType(e.target.value);
            }}
          >
            <option value="dm">Date - most recent</option>
            <option value="dl">Date - least recent</option>
            <option value="ld">Likes - descending</option>
            <option value="la">Likes - ascending</option>
          </select>
          {user && (
            <label for="checkbox">
              Liked only{" "}
              <input
                onChange={() => {
                  setLikedOnly(!likedOnly);
                }}
                checked={likedOnly}
                id="checkbox"
                type="checkbox"
              />
            </label>
          )}
        </div>
        <Posts
          search={search.toLowerCase()}
          sorted={sortType}
          category={selectedCategory}
          liked={likedOnly ? liked : undefined}
        />
      </div>
      <Footer />
    </div>
  );
}
