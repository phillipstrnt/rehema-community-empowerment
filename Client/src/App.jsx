import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* =====================================================
   PUBLIC COMPONENTS
===================================================== */

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";

/* =====================================================
   PUBLIC PAGES
===================================================== */

import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import News from "./pages/News";
import Post from "./pages/Post";
import Gallery from "./pages/Gallery";
import Events from "./pages/Events";
import GetInvolved from "./pages/GetInvolved";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

/* =====================================================
   ADMIN LOGIN
===================================================== */

import AdminLogin from "./pages/admin/AdminLogin";

/* =====================================================
   ADMIN AUTHENTICATION
===================================================== */

import ProtectedRoute from "./components/ProtectedRoute";

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
import AdminPartners from "./admin/AdminPartners";
import AdminUsers from "./admin/AdminUsers";

/* =====================================================
   ADMIN FORMS
===================================================== */

import PostForm from "./admin/PostForm";
import ProgramForm from "./admin/ProgramForm";
import EventForm from "./admin/EventForm";
import GalleryForm from "./admin/GalleryForm";

/* =====================================================
   ADMIN MANAGEMENT PAGES
===================================================== */

import AdminDonations from "./pages/admin/AdminDonations";
import AdminDonationDetails from "./pages/admin/AdminDonationDetails";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminSettings from "./pages/admin/AdminSettings";


/* =====================================================
   PUBLIC WEBSITE WRAPPER
===================================================== */

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      <Footer />

      <WhatsAppButton />
    </>
  );
}


/* =====================================================
   APPLICATION
===================================================== */

export default function App() {
  return (
    <>
      {/* =================================================
          SCROLL TO TOP
      ================================================= */}

      <ScrollToTop />

      <Routes>

        {/* =================================================
            PUBLIC WEBSITE
        ================================================= */}

        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />


        {/* =================================================
            ABOUT
        ================================================= */}

        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />


        {/* =================================================
            PROGRAMS
        ================================================= */}

        <Route
          path="/programs"
          element={
            <PublicLayout>
              <Programs />
            </PublicLayout>
          }
        />


        {/* =================================================
            NEWS
        ================================================= */}

        <Route
          path="/news"
          element={
            <PublicLayout>
              <News />
            </PublicLayout>
          }
        />


        {/* =================================================
            SINGLE NEWS STORY
        ================================================= */}

        <Route
          path="/news/:slug"
          element={
            <PublicLayout>
              <Post />
            </PublicLayout>
          }
        />


        {/* =================================================
            GALLERY
        ================================================= */}

        <Route
          path="/gallery"
          element={
            <PublicLayout>
              <Gallery />
            </PublicLayout>
          }
        />

        <Route
          path="/events"
          element={
            <PublicLayout>
              <Events />
            </PublicLayout>
          }
        />


        {/* =================================================
            GET INVOLVED
        ================================================= */}

        <Route
          path="/get-involved"
          element={
            <PublicLayout>
              <GetInvolved />
            </PublicLayout>
          }
        />


        {/* =================================================
            DONATE
        ================================================= */}

        <Route
          path="/donate"
          element={
            <PublicLayout>
              <Donate />
            </PublicLayout>
          }
        />


        {/* =================================================
            CONTACT
        ================================================= */}

        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />


        {/* =================================================
            ADMIN LOGIN
        ================================================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* =================================================
            PROTECTED ADMIN AREA
        ================================================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            {/* =============================================
                ADMIN DASHBOARD
            ============================================= */}

            <Route
              index
              element={<AdminDashboard />}
            />


            {/* =============================================
                NEWS & STORIES
            ============================================= */}

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


            {/* =============================================
                NEWS / STORIES ALIASES

                These prevent "Route not found" if an
                existing button uses /admin/stories or
                /admin/news.
            ============================================= */}

            <Route
              path="stories"
              element={<AdminPosts />}
            />

            <Route
              path="stories/new"
              element={<PostForm />}
            />

            <Route
              path="stories/:id/edit"
              element={<PostForm />}
            />

            <Route
              path="news"
              element={<AdminPosts />}
            />

            <Route
              path="news/new"
              element={<PostForm />}
            />

            <Route
              path="news/:id/edit"
              element={<PostForm />}
            />


            {/* =============================================
                PROGRAMS
            ============================================= */}

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


            {/* =============================================
                EVENTS
            ============================================= */}

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


            {/* =============================================
                GALLERY
            ============================================= */}

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


            {/* =============================================
                VOLUNTEERS
            ============================================= */}

            <Route
              path="volunteers"
              element={<AdminVolunteers />}
            />


            {/* =============================================
                PARTNERS
            ============================================= */}

            <Route
              path="partners"
              element={<AdminPartners />}
            />


            {/* =============================================
                DONATIONS
            ============================================= */}

            <Route
              path="donations"
              element={<AdminDonations />}
            />

            <Route
              path="donations/:id"
              element={<AdminDonationDetails />}
            />


            {/* =============================================
                MESSAGES
            ============================================= */}

            <Route
              path="messages"
              element={<AdminMessages />}
            />


            {/* =============================================
                NEWSLETTER
            ============================================= */}

            <Route
              path="newsletter"
              element={<AdminNewsletter />}
            />


            {/* =============================================
                SETTINGS
            ============================================= */}

            <Route
              path="settings"
              element={<AdminSettings />}
            />


            {/* =============================================
                ADMIN USERS
            ============================================= */}

            <Route
              path="users"
              element={<AdminUsers />}
            />


            {/* =============================================
                ADMIN FALLBACK

                If an old button points to something like:

                /admin/story
                /admin/donation
                /admin/something

                it stays inside the admin area instead
                of displaying the public 404 page.
            ============================================= */}

            <Route
              path="*"
              element={
                <Navigate
                  to="/admin"
                  replace
                />
              }
            />

          </Route>

        </Route>


        {/* =================================================
            PUBLIC 404
        ================================================= */}

        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFound />
            </PublicLayout>
          }
        />

      </Routes>
    </>
  );
}
