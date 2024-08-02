export default function Comments({ comments }) {
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
