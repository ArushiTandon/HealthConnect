import {
  Hospital,
  Search,
  MapPin,
  Phone,
  Clock,
  Star,
  Heart,
  Stethoscope,
  Zap,
  Shield,
  Users,
  Bed,
  Car,
  Building,
  ChevronRight,
  MessageCircle,
  Award,
  Activity,
} from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleSearch = () => {
    if (isAuthenticated) {
      navigate("/fetch");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Hospital className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                HealthConnect
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                About
              </a>
              <a
                href="#footer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    Welcome, {user?.username}
                  </span>
                  {user?.role === "hospital" && (
                    <Button
                      onClick={() => navigate("/admin")}
                      variant="outline"
                    >
                      Dashboard
                    </Button>
                  )}
                  {user?.role !== "hospital" && (
                    <Button
                      onClick={() => navigate(`/get-appointments/${user?.id}`)}
                      variant="outline"
                    >
                      My Appointments
                    </Button>
                  )}
                  <Button onClick={handleLogout} variant="outline">
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button onClick={() => navigate("/login")} variant="outline">
                    Login
                  </Button>
                  <Button onClick={() => navigate("/signup")}>Sign Up</Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Available Hospital Beds
              <span className="text-blue-600"> Instantly</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with hospitals in real-time. Check bed availability,
              facilities, and get the care you need when you need it most.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Enter your location (e.g., Pune)"
                    className="pl-10 h-12 text-lg border-gray-300 focus:border-blue-500"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold"
                >
                  <Search className="h-5 w-5 mr-2" />
                  {isAuthenticated ? "Find Hospitals" : "Login to Search"}
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  Emergency Care
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  ICU Available
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800"
                >
                  Specialized Care
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800"
                >
                  24/7 Service
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="about" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose HealthConnect?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We make finding healthcare simple, fast, and reliable when every
                second counts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    Real-Time Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Get instant updates on bed availability, wait times, and
                    hospital capacity directly from healthcare providers.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-100 hover:border-green-300 transition-colors">
                <CardHeader>
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    Comprehensive Care
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Find hospitals with specialized facilities including ICU,
                    emergency care, surgery centers, and more.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
                <CardHeader>
                  <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    Location-Based
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Discover nearby hospitals with turn-by-turn directions and
                    estimated travel times for urgent situations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Trusted by Healthcare Providers
              </h2>
              <p className="text-xl text-gray-600">
                Join thousands of hospitals and millions of patients using
                HealthConnect
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  500+
                </div>
                <div className="text-gray-600">Partner Hospitals</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  2M+
                </div>
                <div className="text-gray-600">Patients Helped</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  24/7
                </div>
                <div className="text-gray-600">Real-time Updates</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  99.9%
                </div>
                <div className="text-gray-600">Uptime Guarantee</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Find Care?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Start your search now and connect with available healthcare
              providers in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleSearch}
                className="h-12 px-8 bg-white text-blue-600 hover:bg-gray-100 text-lg font-semibold"
              >
                {isAuthenticated ? "Find Hospitals Now" : "Login to Search"}
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
              {!isAuthenticated && (
                <Button
                  onClick={() => navigate("/signup")}
                  variant="outline"
                  className="h-12 px-8 border-white text-white hover:bg-white hover:text-blue-600 text-lg font-semibold"
                >
                  Create Account
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}

      <footer id="footer" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Hospital className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">HealthConnect</span>
              </div>
              <p className="text-gray-400">
                Connecting patients with healthcare providers for better, faster
                care.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Patients</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Find Hospitals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Emergency Care
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Specialized Services
                  </a>
                </li>
                <li>
                  <a
                    href={`/get-appointments/${user?.id}`}
                    className="hover:text-white transition-colors"
                  >
                    View Appointments
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Hospitals</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="/admin"
                    className="hover:text-white transition-colors"
                  >
                    Admin Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Update Availability
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Manage Facilities
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HealthConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
