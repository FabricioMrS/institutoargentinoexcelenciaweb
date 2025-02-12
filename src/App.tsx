
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import CourseDetail from "./pages/CourseDetail";
import Courses from "./pages/Courses";
import Professionals from "./pages/Professionals";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NewCourse from "./pages/NewCourse";
import AdminProfessionals from "./pages/AdminProfessionals";
import { AuthProvider } from "./contexts/AuthContext";

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
                  <Route path="/curso/:courseId" element={<CourseDetail />} />
                  <Route path="/profesionales" element={<Professionals />} />
                  <Route path="/contacto" element={<Contact />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/curso/nuevo" element={<NewCourse />} />
                  <Route path="/admin/curso/:courseId" element={<NewCourse />} />
                  <Route path="/admin/profesionales" element={<AdminProfessionals />} />
                </Routes>
              </div>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
