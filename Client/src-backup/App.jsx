import React from "react";
import {
  Routes,
  Route
} from "react-router-dom";


import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";


import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import News from "./pages/News";
import Post from "./pages/Post";
import Gallery from "./pages/Gallery";
import GetInvolved from "./pages/GetInvolved";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";


export default function App() {

  return (

    <>

      <Navbar />

      <main>

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/programs"
            element={<Programs />}
          />

          <Route
            path="/news"
            element={<News />}
          />

          <Route
            path="/news/:slug"
            element={<Post />}
          />

          <Route
            path="/gallery"
            element={<Gallery />}
          />

          <Route
            path="/get-involved"
            element={<GetInvolved />}
          />

          <Route
            path="/donate"
            element={<Donate />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </main>

      <Footer />

      <WhatsAppButton />

    </>

  );
}