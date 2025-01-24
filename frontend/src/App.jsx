import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home/Home";
import Sign_up from "./pages/Sign_up";
import Sign_in from "./pages/Sign_in";
import Forgot_password from "./pages/Forgot_password";
import Reset_password from "./pages/Reset_password";
import WriteReview from "./pages/Reviews/WriteReview";
import Review from "./pages/Reviews/Review";
import { UserProvider } from "./hooks/UserContext";
import CityView from "./pages/Categories/CityCard/CityView";
import StatePage from "./pages/Categories/Statecard/StatePage";
import ThemePage from "./pages/Categories/ThemeCard/ThemePage";
import PackagePage from "./pages/Categories/PackageCard/PackagePage";
import Top_destinations from "./pages/Destinations/Top_destinations";
import PackageDetailsPage from "./pages/Destinations/PackageDetailsPage";
import PlacePage from "./pages/Destinations/PlacePage";
import ViewItinerariesPage from "./pages/Categories/PackageCard/ViewItinerariesPage";
import AdminModule from "./modules/admin/AdminModule"; // Admin module import
import { ComponentNameProvider } from "./hooks/ComponentnameContext";
import AdminRoute from "./guard/AdminRoute"; // Import AdminRoute
import AboutUs from "./pages/staticPages/AboutUs";
import ContactUs from "./pages/staticPages/ContactUs";
import FAQ from "./pages/staticPages/FAQ";
import BookingPolicy from "./pages/staticPages/BookingPolicy";
import Hiring from "./pages/staticPages/Hiring";
import PrivacyPolicy from "./pages/staticPages/PrivacyPolicy";
import TravelAgents from "./pages/staticPages/TravelAgents";
import TermsAndConditions from "./pages/staticPages/TermsAndConditions";
import BlogList from "./pages/blog/BlogList";
import BlogPage from "./pages/blog/BlogPage";
import UserModule from "./modules/user/UserModule";
import UserRoute from "./guard/UserRoute";
import NotFound from "./pages/NotFound";
import Not_Found from "./pages/Not_Found";


export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/write-review" element={<WriteReview />} />
            <Route path="/reset-password" element={<Reset_password />} />
            <Route path="/forgot_password" element={<Forgot_password />} />
            <Route path="/sign_up" element={<Sign_up />} />
            <Route path="/sign_in" element={<Sign_in />} />
            <Route path="/reviews" element={<Review />} />
            <Route path="/city-view" element={<CityView />} />
            <Route path="/tour-packages/:stateName" element={<StatePage />} />
            <Route path="/themes/:themename" element={<ThemePage />} />
            <Route path="/tour-plan/:tourCode" element={<PackagePage />} />
            <Route path="/destinations" element={<Top_destinations />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/booking-policy" element={<BookingPolicy />} />
            <Route path="/hiring" element={<Hiring />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/travel-agents-affiliate" element={<TravelAgents />} />
            <Route path="/terms-conditions" element={<TermsAndConditions />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blog/:title" element={<BlogPage />} />
            <Route path="/not-found" element={<Not_Found />} />
            <Route
              path="/details/:stateName/:cityName"
              element={<PackageDetailsPage />}
            />
            <Route path="/place/:placeName" element={<PlacePage />} />
            <Route
              path="/view-itineraries/:tourCode"
              element={<ViewItinerariesPage />}
            />
          </Route>

          {/* Admin Route with AdminRoute guard */}
          <Route
            path="/admin-panel/*"
            element={
              <ComponentNameProvider>
                <AdminRoute element={<AdminModule />} />
              </ComponentNameProvider>
            }
          />
          
          {/* User Route with UserRoute guard */}
          <Route
            path="/user-panel/*"
            element={
              <ComponentNameProvider>
                <UserRoute element={<UserModule />} />
              </ComponentNameProvider>
            }
          />

          {/* Catch-All Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}
