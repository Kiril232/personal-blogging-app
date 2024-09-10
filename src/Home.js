import Header from "./Header";
import Input from "./Input";
import Posts from "./Posts";
import Footer from "./Footer.js";
import Sidebar from "./Sidebar.js";

export default function Home({ user, isAdmin }) {
  return (
    <div className="root-container">
      <Header user={user} currPage={"home"} />
      <div className="posts-container">
        {/* 
        
        {isAdmin && (
          <button
            onClick={() => {
              navigate("/create");
            }}
          >
            Create post
          </button>
        )} */}
        <br />
        <br />
        <Posts search={""} sorted={"home"} category={""} />
        <Sidebar />
      </div>
      <Footer />
    </div>
  );
}
