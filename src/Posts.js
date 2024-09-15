import Carousel from "./Carousel.js";
import "./Posts.css";
import "./Carousel.css";
import PostCard from "./PostCard.js";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase.js";
import { Search } from "lucide-react";

export default function Posts({ sorted, search, category, liked }) {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      const postsSnapshot = await getDocs(collection(db, "posts"));
      setPosts(postsSnapshot.docs);
    }

    fetchPosts().then(() => {
      console.log("Successfully fetched posts.");
      console.log("VALUE - " + liked);
    });
  }, []);

  if (sorted === "home") {
    return (
      <>
        <Carousel
          posts={[...posts]
            .sort((a, b) => {
              return b.data().likes - a.data().likes;
            })
            .slice(0, 3)}
        />
        <hr />
        <div className="container">
          <Search
            className="search-icon"
            onClick={() => {
              navigate("/archive");
            }}
          />
          {posts.length > 0 ? (
            posts.slice(0, 5).map((doc) => {
              if (
                doc.data().title.toLowerCase().startsWith(search) &&
                (category === "" || doc.data().category === category) &&
                (liked?.includes(doc.id) || !liked)
              ) {
                return <PostCard post={doc} />;
              }
            })
          ) : (
            <p>Posts loading...</p>
          )}
        </div>
      </>
    );
  } else if (sorted === "dl") {
    return (
      <>
        <hr />
        <div className="container">
          <Search className="search-icon" />
          {posts.length > 0 ? (
            [...posts]
              .sort((a, b) => {
                return (
                  new Date(a.data().date).getTime() -
                  new Date(b.data().date).getTime()
                );
              })
              .map((doc) => {
                if (
                  doc.data().title.toLowerCase().startsWith(search) &&
                  (category === "" || doc.data().category === category) &&
                  (liked?.includes(doc.id) || !liked)
                ) {
                  return <PostCard post={doc} />;
                }
              })
          ) : (
            <p>Posts loading...</p>
          )}
        </div>
      </>
    );
  } else if (sorted === "dm") {
    return (
      <>
        <hr />
        <div className="container">
          {posts.length > 0 ? (
            [...posts]
              .sort((a, b) => {
                return (
                  new Date(b.data().date).getTime() -
                  new Date(a.data().date).getTime()
                );
              })
              .map((doc) => {
                if (
                  doc.data().title.toLowerCase().startsWith(search) &&
                  (category === "" || doc.data().category === category) &&
                  (liked?.includes(doc.id) || !liked)
                ) {
                  return <PostCard post={doc} />;
                }
              })
          ) : (
            <p>Posts loading...</p>
          )}
        </div>
      </>
    );
  } else if (sorted === "ld") {
    return (
      <>
        <div className="container">
          {posts.length > 0 ? (
            [...posts]
              .sort((a, b) => {
                return b.data().likes - a.data().likes;
              })
              .map((doc) => {
                if (
                  doc.data().title.toLowerCase().startsWith(search) &&
                  (category === "" || doc.data().category === category) &&
                  (liked?.includes(doc.id) || !liked)
                ) {
                  return <PostCard post={doc} />;
                }
              })
          ) : (
            <p>Posts loading...</p>
          )}
        </div>
      </>
    );
  } else if (sorted === "la") {
    return (
      <>
        <hr />
        <div className="container">
          {posts.length > 0 ? (
            [...posts]
              .sort((a, b) => {
                return a.data().likes - b.data().likes;
              })
              .map((doc) => {
                if (
                  doc.data().title.toLowerCase().startsWith(search) &&
                  (category === "" || doc.data().category === category) &&
                  (liked?.includes(doc.id) || !liked)
                ) {
                  return <PostCard post={doc} />;
                }
              })
          ) : (
            <p>Posts loading...</p>
          )}
        </div>
      </>
    );
  }
}
