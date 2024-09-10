import "./About.css";
import Footer from "./Footer.js";
import Header from "./Header.js";

export default function About({ user, isAdmin }) {
  return (
    <div className="about-container">
      <Header user={user} currPage={"about"} />
      <div className="about-content-container">
        <h2>About this blog</h2>
        <p>
          This personal blogging application provides a platform for an author
          to create and manage his blog posts. Other users can sign in, read the
          posts and leave feedback through likes and comments. The text editor
          used also allows for including images and video embeds in the blog
          posts.
        </p>
        <h3>Technologies used:</h3>
        <ul>
          <li>
            <strong>React</strong> - for building the user interface
          </li>
          <li>
            <strong>Firebase</strong> - for database management, authentication,
            storage
          </li>
          <li>
            <strong>Quill</strong> - rich text editor for the writing of blog
            posts
          </li>
          <li>
            <strong>Additional Libraries</strong> - Various other modules were
            also used to enhance the overall functionality and user experience
          </li>
        </ul>
        <p>
          This application was developed as part of the "Fundamentals of Web
          Design" course at the FCSE. It serves as a practical demonstration of
          my web development skills at the time.
        </p>
      </div>
      <Footer />
    </div>
  );
}
