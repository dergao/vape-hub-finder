import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import CountryPage from "./pages/CountryPage";
import CityPage from "./pages/CityPage";
import StorePage from "./pages/StorePage";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStores from "./pages/admin/AdminStores";
import AdminCities from "./pages/admin/AdminCities";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminAds from "./pages/admin/AdminAds";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/us" element={<CountryPage />} />
            <Route path="/us/:citySlug" element={<CityPage />} />
            <Route path="/us/:citySlug/:storeSlug" element={<StorePage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="stores" element={<AdminStores />} />
              <Route path="cities" element={<AdminCities />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="ads" element={<AdminAds />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
