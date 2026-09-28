import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SiteDataProvider } from './context/SiteData';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Stories from './pages/Stories';
import Gallery from './pages/Gallery';
import Register from './pages/Register';
import Login from './pages/Login';
import PortalHome from './pages/PortalHome';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import ContentManager from './pages/ContentManager';
import SiteSettings from './pages/SiteSettings';
import ProtectedRoute from './components/ProtectedRoute';
import Verify from './pages/Verify';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import GetInvolved from './pages/GetInvolved';
import Impact from './pages/Impact';
import News from './pages/News';
import Reports from './pages/Reports';
import Contact from './pages/Contact';

function App() {
  return (
    <SiteDataProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:slug" element={<ProgramDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/news" element={<News />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify/:registrationNumber" element={<Verify />} />
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <PortalHome />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/content"
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
                  <ContentManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
                  <SiteSettings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        </div>
      </Router>
    </SiteDataProvider>
  );
}

export default App;