import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Benefits from "./pages/Benefits";
import Trainings from "./pages/Trainings";
import Courses from "./pages/Courses";
import Monitoring from "./pages/Monitoring";
import Medicine from "./pages/Medicine";
import Registration from "./pages/Registration";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/vantagens" element={<Benefits />} />
          <Route path="/treinamentos" element={<Trainings />} />
          <Route path="/cursos" element={<Courses />} />
          <Route path="/monitoramento" element={<Monitoring />} />
          <Route path="/medicina" element={<Medicine />} />
          <Route path="/inscricao" element={<Registration />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
