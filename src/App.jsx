import { Routes, Route, Outlet, Link } from "react-router-dom";
import FaceDetector from "./pages/FaceDetector";
import NoMatch from "./pages/NoMatch";
import Home from './pages/Home';
import OCR from './pages/OCR'

import "./App.css";

function App() {
  return (
    <>
      <h1>eKYC ProtoType </h1>

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="faceDetector" element={<FaceDetector />} />
          <Route path="ocr" element={<OCR />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  );
}
export default App;

function Layout() {
  return (
    <div>
      <nav style={{display:'flex', gap: "2rem"}}>
        <span>
          <Link to="/">Home</Link>
        </span>
        <span>
          <Link to="/ocr">OCR</Link>
        </span>
        <span>
          <Link to="/faceDetector">FaceDetector</Link>
        </span>
      </nav>

      <hr />
      <Outlet />
    </div>
  );
}
