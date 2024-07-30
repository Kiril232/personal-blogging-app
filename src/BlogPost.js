import { db, auth } from "./firebase";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getCountFromServer,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

export default function BlogPost() {
  const post = useRef(null);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");
  const [postContent, setPostContent] = useState({});
  let { slug } = useParams();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState({});

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

    const fetchData = async () => {
      const q = query(collection(db, "posts"), where("slug", "==", slug));
      post.current = await getDocs(q);
      console.log(post.current.docs[0].data());
      setPostContent(post.current.docs[0].data());
      setPostId(post.current.docs[0].id);
    };

    fetchData();

    return () => unsubscribe();
  }, []);

  function handleClick() {
    navigate("/post/" + slug + "/edit");
  }

  const handleDelete = () => {
    deleteDoc(doc(db, "posts", postId))
      .then(() => {
        console.log("Successfully deleted post.");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <h1>{postContent.title}</h1>
      {isAdmin && <button onClick={handleClick}>Edit post</button>}
      {isAdmin && <button onClick={handleDelete}>Delete post</button>}
      <div
        className="ql-editor ql-container"
        dangerouslySetInnerHTML={{ __html: postContent.content }}
      />
    </div>
  );
}
