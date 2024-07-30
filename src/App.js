import Home from "./Home";
import CreatePost from "./CreatePost";
import BlogPost from "./BlogPost";
import Login from "./Login";
import Register from "./Register";
import EditPost from "./EditPost";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:slug" element={<BlogPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:slug/edit" element={<EditPost />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
