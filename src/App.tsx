import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import CourseDetail from "./pages/CourseDetail";
import Courses from "./pages/Courses";
import CategoryCourses from "./pages/CategoryCourses";
import Professionals from "./pages/Professionals";
import Nosotros from "./pages/Nosotros";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NewCourse from "./pages/NewCourse";
import ResetPassword from "./pages/ResetPassword";
import AdminProfessionals from "./pages/AdminProfessionals";
import AdminTestimonials from "./pages/AdminTestimonials";
import { AuthProvider } from "./contexts/AuthContext";
import Biblioteca from "./pages/Biblioteca";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/cursos" element={<Courses />} />
                  <Route path="/cursos/:category" element={<CategoryCourses />} />
                  <Route path="/curso/:courseId" element={<CourseDetail />} />
                  <Route path="/profesionales" element={<Professionals />} />
                  <Route path="/nosotros" element={<Nosotros />} />
                  <Route path="/contacto" element={<Contact />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/curso/nuevo" element={<NewCourse />} />
                  <Route path="/admin/curso/:courseId" element={<NewCourse />} />
                  <Route path="/admin/profesionales" element={<AdminProfessionals />} />
                  <Route path="/admin/testimoniales" element={<AdminTestimonials />} />
                  <Route path="/biblioteca" element={<Biblioteca />} />
                </Routes>
              </div>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
