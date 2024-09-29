import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserStories from "./components/userStories/UserStories";
import Bookmark from "./components/bookmarks/Bookmark";
import StatusShare from "./components/statusShare/StatusShare";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import Errors from "./components/error/Error"

function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/yourStories"
        element={<ProtectedRoute Component={UserStories} />}
      />
      <Route
        path="/bookmarks"
        element={<ProtectedRoute Component={Bookmark} />}
      />
      <Route path="/viewStory/:id" element={<StatusShare />} />
      <Route path="*" element={<Errors/>} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
