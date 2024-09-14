import "./Comments.css";

export default function Comments({
  comments,
  handleComment,
  setComment,
  user,
}) {
  let currYear = new Date().getFullYear();

  return (
    <div className="comments-wrapper">
      <h2>Comments</h2>
      {user && (
        <>
          <img src={user.photoURL} className="comment-photo" />
          <textarea
            id="comment-input"
            placeholder="Leave a comment..."
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
          <button onClick={handleComment} className="submit-button">
            Post
          </button>
        </>
      )}
      <div className="comments-container">
        {comments.length > 0 ? (
          comments.map((doc) => {
            return (
              <div className="comment">
                <img src={doc.data().userPhoto} className="comment-photo" />
                {new Date(doc.data().date).getFullYear() === currYear ? (
                  <p>
                    <strong>{doc.data().user}</strong>
                    <span className="comment-date">
                      {" " +
                        new Date(doc.data().date).toLocaleString("default", {
                          month: "short",
                        }) +
                        " " +
                        (new Date(doc.data().date).getDay() + 1)}
                    </span>
                  </p>
                ) : (
                  <p>
                    <strong>{doc.data().user}</strong>
                    <span className="comment-date">
                      {" " +
                        new Date(doc.data().date).toLocaleString("default", {
                          month: "short",
                        }) +
                        " " +
                        (new Date(doc.data().date).getDay() + 1) +
                        ", " +
                        new Date(doc.data().date).getFullYear()}
                    </span>
                  </p>
                )}
                <div className="comment-content" key={doc.id}>
                  <p>{doc.data().content}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p>Be the first to leave a comment!</p>
        )}
      </div>
    </div>
  );
}
