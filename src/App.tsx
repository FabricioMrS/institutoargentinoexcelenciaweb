
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CategoryCourses from "./pages/CategoryCourses";
import Professionals from "./pages/Professionals";
import Nosotros from "./pages/Nosotros";
import Contact from "./pages/Contact";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import NewCourse from "./pages/NewCourse";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminProfessionals from "./pages/AdminProfessionals";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "@/hooks/useTheme";
import SecuritySettings from "./pages/SecuritySettings";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cursos" element={<Courses />} />
          <Route path="/cursos/:slug" element={<CourseDetail />} />
          <Route path="/categoria/:category" element={<CategoryCourses />} />
          <Route path="/profesionales" element={<Professionals />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/seguridad" element={<SecuritySettings />} />
          
          {/* Rutas de administración */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/new-course" element={<NewCourse />} />
          <Route path="/admin/testimonials" element={<AdminTestimonials />} />
          <Route path="/admin/professionals" element={<AdminProfessionals />} />
          <Route path="/admin/new-course/:id" element={<NewCourse />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
