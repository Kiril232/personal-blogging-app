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
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Header from "./Header";
import Comments from "./Comments.js";
import "./BlogPost.css";
import { ReactComponent as LogoIpsum } from "./logoipsum.svg";
import Footer from "./Footer.js";
import { Trash2, PenLine, ThumbsUp, MessageCircle } from "lucide-react";

export default function BlogPost({ user, isAdmin }) {
  const post = useRef(null);
  const [postId, setPostId] = useState("");
  // const [text, setText] = useState("");
  const [postContent, setPostContent] = useState({});
  let { slug } = useParams();
  const navigate = useNavigate();

  const [comment, setComment] = useState("");
  // const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
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

    return () => {
      // unsubscribe();
    };
  }, []);

  useEffect(() => {
    let unsubscribePost, unsubscribeUser;
    if (user && postId) {
      const userRef = doc(db, "users", user.uid);
      unsubscribeUser = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          // const likedPosts = doc.data().liked;
          setIsLiked(doc.data().liked.includes(postId));
        }
      });

      const postRef = doc(db, "posts", postId);
      unsubscribePost = onSnapshot(postRef, (doc) => {
        if (doc.exists()) {
          setLikeCount(doc.data().likes);
        }
      });
    }

    return () => {
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribePost) unsubscribePost();
    };
  }, [postId, user]);

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
    if (comment.length !== 0) {
      if (user.displayName) {
        addDoc(collection(db, "comments"), {
          content: comment,
          post: slug,
          date: new Date().toUTCString(),
          user: user.displayName,
          userPhoto: user.photoURL,
        }).then(() => {
          updateDoc(doc(db, "posts", postId), { comments: increment(1) });
          window.location.reload();
        });
      } else {
        addDoc(collection(db, "comments"), {
          content: comment,
          post: slug,
          date: new Date().toUTCString(),
          user: user.email,
          userPhoto: user.photoURL,
        }).then(() => {
          updateDoc(doc(db, "posts", postId), { comments: increment(1) });
          window.location.reload();
        });
      }
    }
  };

  const handleLike = async () => {
    const userRef = doc(db, "users", user.uid);
    const postRef = doc(db, "posts", postId);

    if (isLiked) {
      await updateDoc(userRef, { liked: arrayRemove(postId) });
      await updateDoc(postRef, { likes: increment(-1) });
    } else {
      await updateDoc(userRef, { liked: arrayUnion(postId) });
      await updateDoc(postRef, { likes: increment(1) });
    }
  };

  return (
    <div>
      <Header user={user} />
      <div className="blogpost-container">
        <div className="title-container">
          <h1>{postContent.title}</h1>
          <div className="post-info-container">
            <LogoIpsum className="post-logo" />
            <h6>Pragma</h6>
            <h6>SEP 06, 2024</h6>
            {isAdmin && (
              <button onClick={handleDelete} className="delete-icon">
                <Trash2 />
              </button>
            )}
            {isAdmin && (
              <button onClick={handleClick} className="edit-icon">
                <PenLine />
              </button>
            )}
          </div>
        </div>
        <hr />
        {/* {isAdmin && <button onClick={handleClick}>Edit post</button>} */}
        {/* {isAdmin && <button onClick={handleDelete}>Delete post</button>} */}
        <div
          className="ql-editor ql-container editor-view"
          dangerouslySetInnerHTML={{ __html: postContent.content }}
        />
        <hr />
        {/* <div className="post-icons"> */}
        {isLiked ? (
          <div className="likes liked">
            <ThumbsUp
              strokeWidth={3}
              onClick={handleLike}
              className="like-icon"
            />
            <h6 className="count liked">{likeCount}</h6>
          </div>
        ) : (
          <div className="likes">
            <ThumbsUp onClick={handleLike} className="like-icon" />
            <h6 className="count">{likeCount}</h6>
          </div>
        )}
        <div className="comments">
          <MessageCircle className="comment-icon" />
          <h6 className="count">{postContent.comments}</h6>
        </div>
        {/* </div> */}
        <Comments
          comments={comments}
          handleComment={handleComment}
          setComment={setComment}
          currUserPhoto={user.photoURL}
        />
      </div>

      <Footer />
    </div>
  );
}
