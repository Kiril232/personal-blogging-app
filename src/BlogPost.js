import { db, storage } from "./firebase";
import { ref, deleteObject } from "firebase/storage";
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

  const handleDelete = async () => {
    //delete category if no other posts
    const q = query(
      collection(db, "categories"),
      where("category", "==", postContent.category)
    );
    const categorySnapshot = await getCountFromServer(q);
    if (categorySnapshot.data().count === 1) {
      console.log("Successfully deleted category");
      const deletedCategory = await getDocs(q);
      deleteDoc(doc(db, "categories", deletedCategory.docs[0].id));
    }
    //delete cover image
    const coverURL = postContent.coverImage
      .substring(77, postContent.coverImage.indexOf("?", 77))
      .replace(/%20/g, " ");
    const coverRef = ref(storage, coverURL);
    deleteObject(coverRef)
      .then(() => {
        console.log("Deleted the old cover image from storage successfully.");
      })
      .catch((err) => {
        console.error(err);
      });
    //delete post
    deleteDoc(doc(db, "posts", postId))
      .then(() => {
        console.log("Successfully deleted post.");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
      });
    //delete comments
    comments.forEach((comment) => {
      deleteDoc(doc(db, "comments", comment.id));
    });
    //delete images from post content
    const imgTags = postContent.content.match(/<img[^>]+>/g);
    const imgUrls = imgTags.map((tag) => {
      const url = tag.match(/src="([^"]+)"/);
      return url[1];
    });

    imgUrls.forEach((url) => {
      if (url) {
        const storageUrl = url
          .substring(77, url.indexOf("?", 77))
          .replace(/%20/g, " ");
        const imgRef = ref(storage, storageUrl);
        deleteObject(imgRef);
      }
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
      <Header user={user} isAdmin={isAdmin} />
      <div className="blogpost-container">
        <div className="title-container">
          <h1>{postContent.title}</h1>
          <div className="post-info-container">
            <LogoIpsum className="post-logo" />
            <h6>Pragma</h6>
            <h6>SEP 06, 2024</h6>
            {isAdmin && (
              <button
                onClick={() => {
                  document
                    .getElementsByClassName("delete-confirmation")[0]
                    .classList.toggle("delete-confirmation-open");
                }}
                className="delete-icon"
              >
                <Trash2 />
              </button>
            )}
            {isAdmin && (
              <button onClick={handleClick} className="edit-icon">
                <PenLine />
              </button>
            )}
            <div className="delete-confirmation">
              <p>Are you sure you want to delete this post?</p>
              <div className="confirm-buttons">
                <button className="submit-button delete" onClick={handleDelete}>
                  Delete
                </button>
                <button
                  className="submit-button"
                  onClick={() => {
                    document
                      .getElementsByClassName("delete-confirmation")[0]
                      .classList.toggle("delete-confirmation-open");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div
          className="ql-editor ql-container editor-view"
          dangerouslySetInnerHTML={{ __html: postContent.content }}
        />
        <hr />
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
            <ThumbsUp
              onClick={user ? handleLike : () => navigate("/login")}
              className="like-icon"
            />
            <h6 className="count">{likeCount}</h6>
          </div>
        )}
        <div className="comments">
          <MessageCircle
            onClick={
              user
                ? () => {
                    const commentInput =
                      document.getElementById("comment-input");
                    commentInput.focus();
                    commentInput.scrollIntoView();
                  }
                : () => navigate("/login")
            }
            className="comment-icon"
          />
          <h6 className="count">{postContent.comments}</h6>
        </div>
        {/* </div> */}
        <hr />
        <Comments
          comments={comments}
          handleComment={handleComment}
          setComment={setComment}
          user={user}
        />
      </div>

      <Footer />
    </div>
  );
}
