import Home from './Home';
import CreatePost from "./CreatePost";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
      <div>
          <Router>
              <Routes>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/create" element={<CreatePost/>}/>
              </Routes>
          </Router>
      </div>
  );
}

export default App;
