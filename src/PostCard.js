import { Link } from "react-router-dom";
import { ThumbsUp, MessageCircle } from "lucide-react";

export default function PostCard({ post }) {
  function getPreview(str) {
    return (
      str
        .replace(/<\/p>/g, " ") // Replace closing paragraph tags with space
        .replace(/<br\s*\/?>/g, " ") // Replace <br> tags with space
        .replace(/<\/?[^>]+(>|$)/g, "") // Replace all tags
        .substring(0, 90) + "..."
    );
  }

  return (
    <div key={post.id} className="pic">
      <Link className="link" to={"/post/" + post.data().slug}></Link>

      <div className="post-text">
        <h2>
          <Link to={"/post/" + post.data().slug}>{post.data().title}</Link>
        </h2>
        <p>{getPreview(post.data().content)}</p>
        {
          <h6>
            {new Date(post.data().date).toLocaleString("default", {
              month: "short",
            }) +
              " " +
              new Date(post.data().date).getDate() +
              ", " +
              new Date(post.data().date).getFullYear()}
          </h6>
        }
        <div className="post-icons">
          <div className="likes">
            <ThumbsUp className="like-icon" />
            <h6 className="count">{post.data().likes}</h6>
          </div>
          <div className="comments">
            <MessageCircle className="comment-icon" />
            <h6 className="count">{post.data().comments}</h6>
          </div>
        </div>
      </div>
      <img src={post.data().coverImage} alt={post.data().title} />
    </div>
  );
}
