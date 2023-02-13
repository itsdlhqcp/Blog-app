import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "components/header";
import Home from "pages/home";
import Profile from "pages/profile";
import NewPost from "pages/new";
import Post from "pages/post";
import Latest from "pages/latest";
import ErrorPage from "pages/error-page";
import "bootstrap/dist/css/bootstrap.min.css";
import "app.css";
import { UserAuthContextProvider } from "context/user-auth-context";
import ProtectedRoute from "components/protected-route";
import Footer from "components/footer";

function App() {
  return (
    <div className="app bg-light">
      <UserAuthContextProvider>
        {/* Routing */}
        <div className="app__container-header">
          <Header></Header>
        </div>
        <div className="app__container-page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new"
              element={
                <ProtectedRoute>
                  <NewPost />
                </ProtectedRoute>
              }
            />
            <Route path="/latest" element={<Latest />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
        <div className="app__container-footer bg-dark">
          <Footer></Footer>
        </div>
      </UserAuthContextProvider>
    </div>
  );
}

export default App;
