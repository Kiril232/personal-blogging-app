import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase.js";

export default function Comments({ slug }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchComments() {
      const q = query(collection(db, "comments"), where("post", "==", slug));
      const commentsSnapshot = await getDocs(q);
      setComments(commentsSnapshot.docs);
    }

    fetchComments();
  }, []);

  const commentPhotoStyle = {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    float: "left",
  };

  return (
    <div>
      {comments.length > 0 ? (
        comments.map((doc) => {
          return (
            <>
              <img src={doc.data().userPhoto} style={commentPhotoStyle} />
              <p>
                {doc.data().user}, {doc.data().date}
              </p>
              <div className="comment" key={doc.id}>
                <p>{doc.data().content}</p>
              </div>
            </>
          );
        })
      ) : (
        <p>Be the first to leave a comment!</p>
      )}
    </div>
  );
}
