import Carousel from "./Carousel.js";
import "./Posts.css";
import "./Carousel.css";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "./firebase.js";
// import { faThumbsUp, faComment } from "@fortawesome/free-regular-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThumbsUp, MessageCircle, Search } from "lucide-react";

export default function Posts({ sorted, search, category }) {
  function kebab(str) {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s/g, "-");
  }

  const [posts, setPosts] = useState([]);
  // const [sortedPosts, setSortedPosts] = useState([]);
  let currYear = new Date().getFullYear();

  useEffect(() => {
    async function fetchPosts() {
      const postsSnapshot = await getDocs(collection(db, "posts"));
      setPosts(postsSnapshot.docs);
    }

    fetchPosts().then(() => {
      console.log("Successfully fetched posts.");
    });
  }, []);

  function stripHTML(str) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = str;
    return tmp.innerText;
  }

  if (sorted === "home") {
    return (
      <>
        <Carousel
          posts={posts
            .toSorted((a, b) => {
              return b.data().likes - a.data().likes;
            })
            .slice(0, 3)}
        />
        <hr />
        <div className="container">
          <Search className="search-icon" />
          {/* <h2 style={{ textAlign: "left" }}>All posts</h2> */}
          {posts.length > 0 ? (
            posts.slice(0, 5).map((doc) => {
              if (
                doc.data().title.toLowerCase().startsWith(search) &&
                (category === "" || doc.data().category === category)
              ) {
                return (
                  <div key={doc.id} className="pic">
                    <a className="link" href={"/post/" + doc.data().slug}></a>

                    <div className="post-text">
                      <h2>
                        <Link to={"/post/" + doc.data().slug}>
                          {doc.data().title}
                        </Link>
                      </h2>
                      {/*<p>{stripHTML(doc.data().content.replace("<br>", ' ').replace("</p>", ' ')).substring(0,50)}...</p>*/}
                      <p>
                        {doc
                          .data()
                          .content.replace(/<\/p>/g, " ") // Replace closing paragraph tags with space
                          .replace(/<br\s*\/?>/g, " ") // Replace <br> tags with space
                          .replace(/<\/?[^>]+(>|$)/g, "")
                          .substring(0, 90)}
                        ...
                      </p>
                      {/* <h6>sep 9, 2024</h6> */}
                      {
                        <h6>
                          {new Date(doc.data().date).toLocaleString("default", {
                            month: "short",
                          }) +
                            " " +
                            new Date(doc.data().date).getDate() +
                            ", " +
                            new Date(doc.data().date).getFullYear()}
                        </h6>
                      }
                      <div className="post-icons">
                        <div className="likes">
                          <ThumbsUp className="like-icon" />
                          <h6 className="count">{doc.data().likes}</h6>
                        </div>
                        <div className="comments">
                          <MessageCircle className="comment-icon" />
                          <h6 className="count">{doc.data().comments}</h6>
                        </div>
                      </div>
                    </div>
                    <img src={doc.data().coverImage} alt={doc.data().title} />
                  </div>
                );
              }
            })
          ) : (
            <p>Posts loading...</p>
          )}
          {/* <hr /> */}
          {/* <h2>Most recent posts</h2> */}
          {/* {posts */}
          {/* .toSorted((a, b) => { */}
          {/* return ( */}
          {/* new Date(b.data().date).getTime() - */}
          {/* new Date(a.data().date).getTime() */}
          {/* ); */}
          {/* }) */}
          {/* .slice(0, 3) */}
          {/* .map((doc) => { */}
          {/* return ( */}
          {/* <div key={doc.id} className="pic"> */}
          {/* <div className="post-text"> */}
          {/* <h2> */}
          {/* <Link to={"/post/" + doc.data().slug}> */}
          {/* {doc.data().title} */}
          {/* </Link> */}
          {/* </h2> */}
          {/*<p>{stripHTML(doc.data().content.replace("<br>", ' ').replace("</p>", ' ')).substring(0,50)}...</p>*/}
          {/* <p> */}
          {/* {doc */}
          {/* .data() */}
          {/* .content.replace(/<\/p>/g, " ") // Replace closing paragraph tags with space */}
          {/* .replace(/<br\s*\/?>/g, " ") // Replace <br> tags with space */}
          {/* .replace(/<\/?[^>]+(>|$)/g, "") */}
          {/* .substring(0, 100)} */}
          {/* ... */}
          {/* </p> */}
          {/* </div> */}
          {/* <img src={doc.data().coverImage} alt={doc.data().title} /> */}
          {/* </div> */}
          {/* ); */}
          {/* })} */}

          {/*<div className="pic"></div>*/}
          {/*<div className="pic"></div>*/}
          {/*<div className="pic"></div>*/}
        </div>
      </>
    );
  } else if (sorted === "dl") {
    return (
      <>
        <hr />
        <div className="container">
          <Search className="search-icon" />
          {/* <h2 style={{ textAlign: "left" }}>All posts</h2> */}
          {posts.length > 0 ? (
            posts
              .toSorted((a, b) => {
                return (
                  new Date(a.data().date).getTime() -
                  new Date(b.data().date).getTime()
                );
              })
              .map((doc) => {
                if (
                  doc.data().title.toLowerCase().startsWith(search) &&
                  (category === "" || doc.data().category === category)
                ) {
                  return (
                    <div key={doc.id} className="pic">
                      <a className="link" href={"/post/" + doc.data().slug}></a>

                      <div className="post-text">
                        <h2>
                          <Link to={"/post/" + doc.data().slug}>
                            {doc.data().title}
                          </Link>
                        </h2>
                        {/*<p>{stripHTML(doc.data().content.replace("<br>", ' ').replace("</p>", ' ')).substring(0,50)}...</p>*/}
                        <p>
                          {doc
                            .data()
                            .content.replace(/<\/p>/g, " ") // Replace closing paragraph tags with space
                            .replace(/<br\s*\/?>/g, " ") // Replace <br> tags with space
                            .replace(/<\/?[^>]+(>|$)/g, "")
                            .substring(0, 90)}
                          ...
                        </p>
                        {/* <h6>sep 9, 2024</h6> */}
                        {
                          <h6>
                            {new Date(doc.data().date).toLocaleString(
                              "default",
                              {
                                month: "short",
                              }
                            ) +
                              " " +
                              new Date(doc.data().date).getDate() +
                              ", " +
                              new Date(doc.data().date).getFullYear()}
                          </h6>
                        }
                        <div className="post-icons">
                          <div className="likes">
                            <ThumbsUp className="like-icon" />
                            <h6 className="count">{doc.data().likes}</h6>
                          </div>
                          <div className="comments">
                            <MessageCircle className="comment-icon" />
                            <h6 className="count">{doc.data().comments}</h6>
                          </div>
                        </div>
                      </div>
                      <img src={doc.data().coverImage} alt={doc.data().title} />
                    </div>
                  );
                }
              })
          ) : (
            <p>Posts loading...</p>
          )}
          {/* <hr /> */}
          {/* <h2>Most recent posts</h2> */}
          {/* {posts */}
          {/* .toSorted((a, b) => { */}
          {/* return ( */}
          {/* new Date(b.data().date).getTime() - */}
          {/* new Date(a.data().date).getTime() */}
          {/* ); */}
          {/* }) */}
          {/* .slice(0, 3) */}
          {/* .map((doc) => { */}
          {/* return ( */}
          {/* <div key={doc.id} className="pic"> */}
          {/* <div className="post-text"> */}
          {/* <h2> */}
          {/* <Link to={"/post/" + doc.data().slug}> */}
          {/* {doc.data().title} */}
          {/* </Link> */}
          {/* </h2> */}
          {/*<p>{stripHTML(doc.data().content.replace("<br>", ' ').replace("</p>", ' ')).substring(0,50)}...</p>*/}
          {/* <p> */}
          {/* {doc */}
          {/* .data() */}
          {/* .content.replace(/<\/p>/g, " ") // Replace closing paragraph tags with space */}
          {/* .replace(/<br\s*\/?>/g, " ") // Replace <br> tags with space */}
          {/* .replace(/<\/?[^>]+(>|$)/g, "") */}
          {/* .substring(0, 100)} */}
          {/* ... */}
          {/* </p> */}
          {/* </div> */}
          {/* <img src={doc.data().coverImage} alt={doc.data().title} /> */}
          {/* </div> */}
          {/* ); */}
          {/* })} */}

          {/*<div className="pic"></div>*/}
          {/*<div className="pic"></div>*/}
          {/*<div className="pic"></div>*/}
        </div>
      </>
    );
  } else if (sorted === "dm") {
    return (
      <>
        <hr />
        <div className="container">
          {/* <h2 style={{ textAlign: "left" }}>All posts</h2> */}

          {posts.length > 0 ? (
            posts
              .toSorted((a, b) => {
                return (
                  new Date(b.data().date).getTime() -
                  new Date(a.data().date).getTime()
                );
              })
              .map((doc) => {
                if (
                  doc.data().title.toLowerCase().startsWith(search) &&
                  (category === "" || doc.data().category === category)
                ) {
                  return (
                    <div key={doc.id} className="pic">
                      <a className="link" href={"/post/" + doc.data().slug}></a>
                      <div className="post-text">
                        <h2>
                          <Link to={"/post/" + doc.data().slug}>
                            {doc.data().title}
                          </Link>
                        </h2>
                        {/*<p>{stripHTML(doc.data().content.replace("<br>", ' ').replace("</p>", ' ')).substring(0,50)}...</p>*/}
                        <p>
                          {doc
                            .data()
                            .content.replace(/<\/p>/g, " ") // Replace closing paragraph tags with space
                            .replace(/<br\s*\/?>/g, " ") // Replace <br> tags with space
                            .replace(/<\/?[^>]+(>|$)/g, "")
                            .substring(0, 90)}
                          ...
                        </p>
                        <h6>
                          {new Date(doc.data().date).toLocaleString("default", {
                            month: "short",
                          }) +
                            " " +
                            new Date(doc.data().date).getDate() +
                            ", " +
                            new Date(doc.data().date).getFullYear()}
                        </h6>
                        <div className="post-icons">
                          <div className="likes">
                            <ThumbsUp className="like-icon" />
                            <h6 className="count">{doc.data().likes}</h6>
                          </div>
                          <div className="comments">
                            <MessageCircle className="comment-icon" />
                            <h6 className="count">{doc.data().comments}</h6>
                          </div>
                        </div>
                      </div>
                      <img src={doc.data().coverImage} alt={doc.data().title} />
                    </div>
                  );
                }
              })
          ) : (
            <p>Posts loading...</p>
          )}
          <hr />
          {/* <h2>Most recent posts</h2> */}
          {/* {posts */}
          {/* .toSorted((a, b) => { */}
          {/* return ( */}
          {/* new Date(b.data().date).getTime() - */}
          {/* new Date(a.data().date).getTime() */}
          {/* ); */}
          {/* }) */}
          {/* .slice(0, 3) */}
          {/* .map((doc) => { */}
          {/* return ( */}
          {/* <div key={doc.id} className="pic"> */}
          {/* <div className="post-text"> */}
          {/* <h2> */}
          {/* <Link to={"/post/" + doc.data().slug}> */}
          {/* {doc.data().title} */}
          {/* </Link> */}
          {/* </h2> */}
          {/* <p>{stripHTML(doc.data().content.replace("<br>", ' ').replace("</p>", ' ')).substring(0,50)}...</p> */}
          {/* <p> */}
          {/* {doc */}
          {/* .data() */}
          {/* .content.replace(/<\/p>/g, " ") // Replace closing paragraph tags with space */}
          {/* .replace(/<br\s*\/?>/g, " ") // Replace <br> tags with space */}
          {/* .replace(/<\/?[^>]+(>|$)/g, "") */}
          {/* .substring(0, 100)} */}
          {/* ... */}
          {/* </p> */}
          {/* </div> */}
          {/* <img src={doc.data().coverImage} alt={doc.data().title} /> */}
          {/* </div> */}
          {/* ); */}
          {/* })} */}

          {/* <div className="pic"></div> */}
          {/*<div className="pic"></div>*/}
          {/*<div className="pic"></div>*/}
        </div>
      </>
    );
  } else if (sorted === "ld") {
    return (
      <>
        <div className="container">
          {/* <h2 style={{ textAlign: "left" }}>All posts</h2> */}

          {posts.length > 0 ? (
            posts
              .toSorted((a, b) => {
                return b.data().likes - a.data().likes;
              })
              .map((doc) => {
                if (
                  doc.data().title.toLowerCase().startsWith(search) &&
                  (category === "" || doc.data().category === category)
                ) {
                  return (
                    <div key={doc.id} className="pic">
                      <a className="link" href={"/post/" + doc.data().slug}></a>
                      <div className="post-text">
                        <h2>
                          <Link to={"/post/" + doc.data().slug}>
                            {doc.data().title}
                          </Link>
                        </h2>
                        {/*<p>{stripHTML(doc.data().content.replace("<br>", ' ').replace("</p>", ' ')).substring(0,50)}...</p>*/}
                        <p>
                          {doc
                            .data()
                            .content.replace(/<\/p>/g, " ") // Replace closing paragraph tags with space
                            .replace(/<br\s*\/?>/g, " ") // Replace <br> tags with space
                            .replace(/<\/?[^>]+(>|$)/g, "")
                            .substring(0, 90)}
                          ...
                        </p>
                        <h6>
                          {new Date(doc.data().date).toLocaleString("default", {
                            month: "short",
                          }) +
                            " " +
                            new Date(doc.data().date).getDate() +
                            ", " +
                            new Date(doc.data().date).getFullYear()}
                        </h6>
                        <div className="post-icons">
                          <div className="likes">
                            <ThumbsUp className="like-icon" />
                            <h6 className="count">{doc.data().likes}</h6>
                          </div>
                          <div className="comments">
                            <MessageCircle className="comment-icon" />
                            <h6 className="count">{doc.data().comments}</h6>
                          </div>
                        </div>
                      </div>
                      <img src={doc.data().coverImage} alt={doc.data().title} />
                    </div>
                  );
                }
              })
          ) : (
            <p>Posts loading...</p>
          )}
          <hr />
          {/* <h2>Most recent posts</h2> */}
          {/* {posts */}
          {/* .toSorted((a, b) => { */}
          {/* return ( */}
          {/* new Date(b.data().date).getTime() - */}
          {/* new Date(a.data().date).getTime() */}
          {/* ); */}
          {/* }) */}
          {/* .slice(0, 3) */}
          {/* .map((doc) => { */}
          {/* return ( */}
          {/* <div key={doc.id} className="pic"> */}
          {/* <div className="post-text"> */}
          {/* <h2> */}
          {/* <Link to={"/post/" + doc.data().slug}> */}
          {/* {doc.data().title} */}
          {/* </Link> */}
          {/* </h2> */}
          {/* <p>{stripHTML(doc.data().content.replace("<br>", ' ').replace("</p>", ' ')).substring(0,50)}...</p> */}
          {/* <p> */}
          {/* {doc */}
          {/* .data() */}
          {/* .content.replace(/<\/p>/g, " ") // Replace closing paragraph tags with space */}
          {/* .replace(/<br\s*\/?>/g, " ") // Replace <br> tags with space */}
          {/* .replace(/<\/?[^>]+(>|$)/g, "") */}
          {/* .substring(0, 100)} */}
          {/* ... */}
          {/* </p> */}
          {/* </div> */}
          {/* <img src={doc.data().coverImage} alt={doc.data().title} /> */}
          {/* </div> */}
          {/* ); */}
          {/* })} */}

          {/* <div className="pic"></div> */}
          {/*<div className="pic"></div>*/}
          {/*<div className="pic"></div>*/}
        </div>
      </>
    );
  } else if (sorted === "la") {
    return (
      <>
        <hr />
        <div className="container">
          {/* <h2 style={{ textAlign: "left" }}>All posts</h2> */}

          {posts.length > 0 ? (
            posts
              .toSorted((a, b) => {
                return a.data().likes - b.data().likes;
              })
              .map((doc) => {
                if (
                  doc.data().title.toLowerCase().startsWith(search) &&
                  (category === "" || doc.data().category === category)
                ) {
                  return (
                    <div key={doc.id} className="pic">
                      <a className="link" href={"/post/" + doc.data().slug}></a>
                      <div className="post-text">
                        <h2>
                          <Link to={"/post/" + doc.data().slug}>
                            {doc.data().title}
                          </Link>
                        </h2>
                        {/*<p>{stripHTML(doc.data().content.replace("<br>", ' ').replace("</p>", ' ')).substring(0,50)}...</p>*/}
                        <p>
                          {doc
                            .data()
                            .content.replace(/<\/p>/g, " ") // Replace closing paragraph tags with space
                            .replace(/<br\s*\/?>/g, " ") // Replace <br> tags with space
                            .replace(/<\/?[^>]+(>|$)/g, "")
                            .substring(0, 90)}
                          ...
                        </p>
                        <h6>
                          {new Date(doc.data().date).toLocaleString("default", {
                            month: "short",
                          }) +
                            " " +
                            new Date(doc.data().date).getDate() +
                            ", " +
                            new Date(doc.data().date).getFullYear()}
                        </h6>
                        <div className="post-icons">
                          <div className="likes">
                            <ThumbsUp className="like-icon" />
                            <h6 className="count">{doc.data().likes}</h6>
                          </div>
                          <div className="comments">
                            <MessageCircle className="comment-icon" />
                            <h6 className="count">{doc.data().comments}</h6>
                          </div>
                        </div>
                      </div>
                      <img src={doc.data().coverImage} alt={doc.data().title} />
                    </div>
                  );
                }
              })
          ) : (
            <p>Posts loading...</p>
          )}
          <hr />
          {/* <h2>Most recent posts</h2> */}
          {/* {posts */}
          {/* .toSorted((a, b) => { */}
          {/* return ( */}
          {/* new Date(b.data().date).getTime() - */}
          {/* new Date(a.data().date).getTime() */}
          {/* ); */}
          {/* }) */}
          {/* .slice(0, 3) */}
          {/* .map((doc) => { */}
          {/* return ( */}
          {/* <div key={doc.id} className="pic"> */}
          {/* <div className="post-text"> */}
          {/* <h2> */}
          {/* <Link to={"/post/" + doc.data().slug}> */}
          {/* {doc.data().title} */}
          {/* </Link> */}
          {/* </h2> */}
          {/* <p>{stripHTML(doc.data().content.replace("<br>", ' ').replace("</p>", ' ')).substring(0,50)}...</p> */}
          {/* <p> */}
          {/* {doc */}
          {/* .data() */}
          {/* .content.replace(/<\/p>/g, " ") // Replace closing paragraph tags with space */}
          {/* .replace(/<br\s*\/?>/g, " ") // Replace <br> tags with space */}
          {/* .replace(/<\/?[^>]+(>|$)/g, "") */}
          {/* .substring(0, 100)} */}
          {/* ... */}
          {/* </p> */}
          {/* </div> */}
          {/* <img src={doc.data().coverImage} alt={doc.data().title} /> */}
          {/* </div> */}
          {/* ); */}
          {/* })} */}

          {/* <div className="pic"></div> */}
          {/*<div className="pic"></div>*/}
          {/*<div className="pic"></div>*/}
        </div>
      </>
    );
  }
}
