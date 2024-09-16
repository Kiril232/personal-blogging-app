import "./Carousel.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
// import {
//   faChevronLeft,
//   faChevronRight,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";

export default function Carousel({ posts }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  function handleNext() {
    if (currentIndex === 2) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handlePrev() {
    if (currentIndex === 0) {
      setCurrentIndex(2);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  }

  if (posts.length === 3) {
    return (
      <div className="carousel">
        <button onClick={handlePrev} className="left-button">
          <ChevronLeft className="arrow-icon" />
        </button>
        <div
          className="carousel-content-wrapper"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          <div
            className="carousel-content"
            onClick={() => {
              navigate("/post/" + posts[0].data().slug);
            }}
          >
            <img src={posts[0].data().coverImage} alt={posts[0].data().title} />
            <div className="carousel-text">
              <h2>
                <Link to={"/post/" + posts[0].data().slug}>
                  {posts[0].data().title}
                </Link>
              </h2>
              <p>
                {posts[0]
                  .data()
                  .content.replace(/<\/p>/g, " ") // Replace closing paragraph tags with space
                  .replace(/<br\s*\/?>/g, " ") // Replace <br> tags with space
                  .replace(/<\/?[^>]+(>|$)/g, "")
                  .substring(0, 150)}
                ...
              </p>
              <h6>
                {new Date(posts[0].data().date).toLocaleString("default", {
                  month: "short",
                }) +
                  " " +
                  new Date(posts[0].data().date).getDate() +
                  ", " +
                  new Date(posts[0].data().date).getFullYear()}
              </h6>{" "}
              <div className="post-icons">
                <div className="likes">
                  <ThumbsUp className="like-icon" />
                  <h6 className="count">{posts[0].data().likes}</h6>
                </div>
                <div className="comments">
                  <MessageCircle className="comment-icon" />
                  <h6 className="count">{posts[0].data().comments}</h6>
                </div>
              </div>
            </div>
          </div>

          <div
            className="carousel-content"
            onClick={() => {
              navigate("/post/" + posts[1].data().slug);
            }}
          >
            <img src={posts[1].data().coverImage} alt={posts[1].data().title} />
            <div className="carousel-text">
              <h2>
                <Link to={"/post/" + posts[1].data().slug}>
                  {posts[1].data().title}
                </Link>
              </h2>
              <p>
                {posts[1]
                  .data()
                  .content.replace(/<\/p>/g, " ") // Replace closing paragraph tags with space
                  .replace(/<br\s*\/?>/g, " ") // Replace <br> tags with space
                  .replace(/<\/?[^>]+(>|$)/g, "")
                  .substring(0, 200)}
                ...
              </p>
              <h6>
                {new Date(posts[1].data().date).toLocaleString("default", {
                  month: "short",
                }) +
                  " " +
                  new Date(posts[1].data().date).getDate() +
                  ", " +
                  new Date(posts[1].data().date).getFullYear()}
              </h6>
              <div className="post-icons">
                <div className="likes">
                  <ThumbsUp className="like-icon" />
                  <h6 className="count">{posts[1].data().likes}</h6>
                </div>
                <div className="comments">
                  <MessageCircle className="comment-icon" />
                  <h6 className="count">{posts[1].data().comments}</h6>
                </div>
              </div>
            </div>
          </div>

          <div
            className="carousel-content"
            onClick={() => {
              navigate("/post/" + posts[2].data().slug);
            }}
          >
            <img src={posts[2].data().coverImage} alt={posts[2].data().title} />
            <div className="carousel-text">
              <h2>
                <Link to={"/post/" + posts[2].data().slug}>
                  {posts[2].data().title}
                </Link>
              </h2>
              <p>
                {posts[2]
                  .data()
                  .content.replace(/<\/p>/g, " ") // Replace closing paragraph tags with space
                  .replace(/<br\s*\/?>/g, " ") // Replace <br> tags with space
                  .replace(/<\/?[^>]+(>|$)/g, "")
                  .substring(0, 200)}
                ...
              </p>
              <h6>
                {new Date(posts[2].data().date).toLocaleString("default", {
                  month: "short",
                }) +
                  " " +
                  new Date(posts[2].data().date).getDate() +
                  ", " +
                  new Date(posts[2].data().date).getFullYear()}
              </h6>
              <div className="post-icons">
                <div className="likes">
                  <ThumbsUp className="like-icon" />
                  <h6 className="count">{posts[2].data().likes}</h6>
                </div>
                <div className="comments">
                  <MessageCircle className="comment-icon" />
                  <h6 className="count">{posts[2].data().comments}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button onClick={handleNext} className="right-button">
          <ChevronRight className="arrow-icon" />
        </button>
      </div>
    );
  }
}
