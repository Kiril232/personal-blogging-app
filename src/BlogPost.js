import { db, auth } from "./firebase";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getCountFromServer,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Header from "./Header";
import Comments from "./Comments.js";

export default function BlogPost() {
  const post = useRef(null);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");
  const [postContent, setPostContent] = useState({});
  let { slug } = useParams();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState({});
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

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

    async function fetchComments() {
      const q = query(collection(db, "comments"), where("post", "==", slug));
      const commentsSnapshot = await getDocs(q);
      setComments(commentsSnapshot.docs);
    }

    fetchData();
    fetchComments();

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

    comments.forEach((comment) => {
      deleteDoc(doc(db, "comments", comment.id));
    });
  };

  const handleComment = async () => {
    addDoc(collection(db, "comments"), {
      content: comment,
      post: slug,
      date: new Date().toUTCString(),
      user: user.displayName,
      userPhoto: user.photoURL,
    }).then(() => {
      window.location.reload();
    });
  };

  return (
    <div>
      <Header />
      <hr />
      <h1>{postContent.title}</h1>
      {isAdmin && <button onClick={handleClick}>Edit post</button>}
      {isAdmin && <button onClick={handleDelete}>Delete post</button>}
      <div
        className="ql-editor ql-container"
        dangerouslySetInnerHTML={{ __html: postContent.content }}
      />
      <hr />
      <textarea
        placeholder="Leave a comment..."
        onChange={(e) => {
          setComment(e.target.value);
        }}
      />
      <button onClick={handleComment}>Post comment</button>
      <Comments slug={slug} comments={comments} />
    </div>
  );
}
