import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "pages/home";
import Profile from "pages/profile";
import NewPost from "pages/new";
import Post from "pages/post";
import Latest from "pages/latest";
import ErrorPage from "pages/error-page";

function App() {
  return (
    <div className="App">
      {/* Routing */}
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div className="app__container-header">{/*<Header></Header>*/}</div>
        <div className="app__container-page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/new" element={<NewPost />} />
            <Route path="/latest" element={<Latest />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
