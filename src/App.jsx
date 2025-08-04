import React from "react";
import Home from "./home/Home";
import { Route, Routes } from "react-router-dom";
import Courses from "./courses/Courses";
import { Toaster } from "react-hot-toast";
import Mediator from "./components/Mediator";
import Footer from "./components/Footer";
import Stream from "./components/Stream";
import AboutUs from "./components/About";
import Contact from "./components/Contact";

function App() {
  return (
    <>
      <div className="dark:bg-slate-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Courses />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/media/:slug" element={<Mediator />} />
          <Route path="/stream/:slug" element={<Stream />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
        <Toaster />
      </div>
    </>
  );
}

export default App;