
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPartners from "./admin/AdminPartners";
import AdminDonationDetails from "./pages/admin/AdminDonationDetails";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLogin from "./pages/admin/AdminLogin";

/* =====================================================
   PUBLIC COMPONENTS
===================================================== */

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

/* =====================================================
   PUBLIC PAGES
===================================================== */

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

/* =====================================================
   ADMIN LAYOUT
===================================================== */

import AdminLayout from "./admin/AdminLayout";

/* =====================================================
   ADMIN PAGES
===================================================== */

import AdminDashboard from "./admin/AdminDashboard";
import AdminPosts from "./admin/AdminPosts";
import AdminPrograms from "./admin/AdminPrograms";
import AdminEvents from "./admin/AdminEvents";
import AdminGallery from "./admin/AdminGallery";
import AdminVolunteers from "./admin/AdminVolunteers";

/* =====================================================
   ADMIN FORMS
===================================================== */

import PostForm from "./admin/PostForm";
import ProgramForm from "./admin/ProgramForm";
import EventForm from "./admin/EventForm";
import GalleryForm from "./admin/GalleryForm";
import AdminDonations from "./pages/admin/AdminDonations";


export default function App() {
  return (
    <Routes>

      {/* =================================================
          PUBLIC WEBSITE
      ================================================= */}

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


      {/* =================================================
          ADMIN DASHBOARD
      ================================================= */}

      <Route path="/admin" element={<AdminLayout />}>

        {/* Dashboard */}
        <Route
          index
          element={<AdminDashboard />}
        />

        {/* =================================================
            NEWS & STORIES
        ================================================= */}

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


        {/* =================================================
            PROGRAMS
        ================================================= */}

        <Route
          path="programs"
          element={<AdminPrograms />}
        />

        <Route
          path="programs/new"
          element={<ProgramForm />}
        />

        <Route
          path="programs/:id/edit"
          element={<ProgramForm />}
        />


        {/* =================================================
            EVENTS
        ================================================= */}

        <Route
          path="events"
          element={<AdminEvents />}
        />

        <Route
          path="events/new"
          element={<EventForm />}
        />

        <Route
          path="events/:id/edit"
          element={<EventForm />}
        />


        {/* =================================================
            GALLERY
        ================================================= */}

        <Route
          path="gallery"
          element={<AdminGallery />}
        />

        <Route
          path="gallery/new"
          element={<GalleryForm />}
        />

        <Route
          path="gallery/:id/edit"
          element={<GalleryForm />}
        />


        {/* =================================================
            VOLUNTEERS
        ================================================= */}

        <Route
          path="volunteers"
          element={<AdminVolunteers />}
        />

        {/* PARTNERS */}

        <Route
          path="partners"
          element={<AdminPartners />}
        />

        <Route
          path="/admin/donations"
          element={<AdminDonations />}
        />

        <Route
          path="/admin/donations/:id"
          element={<AdminDonationDetails />}
        />

        <Route
         path="messages" 
         element={<AdminMessages />} 
        />

        <Route
         path="newsletter" 
        element={<AdminNewsletter />} 
        />

        <Route
          path="settings"
          element={<AdminSettings />}
        />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

      </Route>


      {/* =================================================
          404 PAGE
      ================================================= */}

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

    </Routes>

  );

}