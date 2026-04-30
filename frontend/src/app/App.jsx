import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadImage from "./pages/upload/Upload";
import NavBar from "./components/NavBar";
import Profile from "./pages/profile/Profile";
import Home from "./pages/home/Home";

function App() {
  return (
    <Router>
      <div
        className="min-h-screen text-white relative bg-fixed bg-center bg-cover"
        style={{
          backgroundImage: "url('https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEkChtXvMzOVnTLffIUeJ0xlu25n0e7JNHglYUjEKfv5I7ySo0w.webp')",
        }}
      >
        {/* Dark Overlay สำหรับทำให้พื้นหลังมืดลง เพื่อให้ UI โดดเด่น */}
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-0"></div>
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <NavBar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/upload" element={<UploadImage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;