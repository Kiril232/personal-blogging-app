import Home from './Home';
import CreatePost from "./CreatePost";
import BlogPost from "./BlogPost";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
      <div>
          <Router>
              <Routes>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/create" element={<CreatePost/>}/>
                  <Route path="/post/:slug" element={<BlogPost />}/>
              </Routes>
          </Router>
      </div>
  );
}

export default App;
