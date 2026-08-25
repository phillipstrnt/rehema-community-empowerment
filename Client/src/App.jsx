import React from "react";

import {
  Routes,
  Route
} from "react-router-dom";

/* Public components */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

/* Public pages */
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

/* Admin */
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminPosts from "./admin/AdminPosts";
import PostForm from "./admin/PostForm";
import AdminPrograms from "./admin/AdminPrograms";
import AdminEvents from "./admin/AdminEvents";
import AdminGallery from "./admin/AdminGallery";


export default function App() {

  return (

    <Routes>

      {/* =========================
          PUBLIC WEBSITE
      ========================= */}

      <Route
        path="/"
        element={
          <>
            <Navbar />

            <main>
              <Home />
            </main>

            <Footer />
            <WhatsAppButton />
          </>
        }
      />

      <Route
        path="/about"
        element={
          <>
            <Navbar />
            <main>
              <About />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        }
      />

      <Route
        path="/programs"
        element={
          <>
            <Navbar />
            <main>
              <Programs />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        }
      />

      <Route
        path="/news"
        element={
          <>
            <Navbar />
            <main>
              <News />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        }
      />

      <Route
        path="/news/:slug"
        element={
          <>
            <Navbar />
            <main>
              <Post />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        }
      />

      <Route
        path="/gallery"
        element={
          <>
            <Navbar />
            <main>
              <Gallery />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        }
      />

      <Route
        path="/get-involved"
        element={
          <>
            <Navbar />
            <main>
              <GetInvolved />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        }
      />

      <Route
        path="/donate"
        element={
          <>
            <Navbar />
            <main>
              <Donate />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        }
      />

      <Route
        path="/contact"
        element={
          <>
            <Navbar />
            <main>
              <Contact />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        }
      />

<Route
  path="/admin"
  element={<AdminLayout />}
>
  {/* Dashboard */}
  <Route
    index
    element={<AdminDashboard />}
  />

  {/* News */}
  <Route
    path="posts"
    element={<AdminPosts />}
  />

  <Route
    path="posts/new"
    element={<PostForm />}
  />

  <Route
    path="posts/:id/edit"
    element={<PostForm />}
  />

  {/* Programs */}
  <Route
    path="programs"
    element={<AdminPrograms />}
  />

  {/* Events */}
  <Route
    path="events"
    element={<AdminEvents />}
  />

  {/* Gallery */}
  <Route
    path="gallery"
    element={<AdminGallery />}
  />
</Route>
      {/* =========================
          404
      ========================= */}

      <Route
        path="*"
        element={
          <>
            <Navbar />

            <main>
              <NotFound />
            </main>

            <Footer />
            <WhatsAppButton />
          </>
        }
      />

        <Route
        path="/admin"
        element={<AdminLayout />}
        >
        {/* Dashboard */}
        <Route
            index
            element={<AdminDashboard />}
        />

        {/* NEWS */}
        <Route
            path="posts"
            element={<AdminPosts />}
        />

        <Route
            path="posts/new"
            element={<PostForm />}
        />

        <Route
            path="posts/:id/edit"
            element={<PostForm />}
        />


        {/* PROGRAMS */}
        <Route
            path="programs"
            element={<AdminPrograms />}
        />

        <Route
            path="programs/new"
            element={<AdminPrograms />}
        />


        {/* EVENTS */}
        <Route
            path="events"
            element={<AdminEvents />}
        />

        <Route
            path="events/new"
            element={<AdminEvents />}
        />


        {/* GALLERY */}
        <Route
            path="gallery"
            element={<AdminGallery />}
        />

        <Route
            path="gallery/new"
            element={<AdminGallery />}
        />

        </Route>

    </Routes>

  );

}