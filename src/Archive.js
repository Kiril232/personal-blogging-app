import Header from "./Header.js";
import Posts from "./Posts.js";
import Footer from "./Footer.js";
import { useState, useEffect } from "react";
import "./Archive.css";
import { Search } from "lucide-react";
import { db } from "./firebase.js";
import { getDocs, collection } from "firebase/firestore";

export default function Archive({ user, isAdmin }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortType, setSortType] = useState("dm");

  useEffect(() => {
    async function fetchCategories() {
      const categoriesSnapshot = await getDocs(collection(db, "categories"));
      setCategories(categoriesSnapshot.docs);
    }

    fetchCategories().then(() => {
      console.log("Successfully fetched categories.");
    });
  }, []);

  return (
    <div>
      <Header user={user} currPage={"archive"} />
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
                <option value={doc.data().category}>
                  {doc.data().category}
                </option>
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
        </div>
        <Posts
          search={search.toLowerCase()}
          sorted={sortType}
          category={selectedCategory}
        />
      </div>
      <Footer />
    </div>
  );
}
