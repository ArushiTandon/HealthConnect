import { Search, Hospital, Ambulance, Heart, Shield, Clock, MapPin, Phone, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { useState } from "react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const facilities = [
    { icon: Heart, name: "ICU", description: "Intensive Care Unit" },
    { icon: Ambulance, name: "Emergency", description: "24/7 Emergency Care" },
    { icon: Hospital, name: "Surgery", description: "Surgical Services" },
    { icon: Shield, name: "Trauma", description: "Trauma Center" },
    { icon: Clock, name: "Urgent Care", description: "Walk-in Clinic" },
    { icon: Star, name: "Specialized", description: "Specialty Services" }
  ];

  const features = [
    {
      title: "Real-time Availability",
      description: "Check bed availability and wait times instantly",
      icon: Clock
    },
    {
      title: "Verified Reviews",
      description: "Read authentic patient reviews and ratings",
      icon: Star
    },
    {
      title: "Direct Contact",
      description: "Get instant contact information and directions",
      icon: Phone
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Hospital className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">HealthConnect</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Find Hospitals</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find the Right
              <span className="text-blue-600 block">Hospital Near You</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Connect with quality healthcare facilities in your area. Search hospitals, 
              check availability, and get the care you need when you need it.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Enter city name or hospital name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 py-6 text-lg border-2 border-blue-200 focus:border-blue-500 rounded-xl shadow-lg"
                />
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Find Hospitals
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Location */}
            <div className="flex items-center justify-center text-gray-600 mb-12">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">Or use your current location</span>
              <Button variant="link" className="text-blue-600 ml-2 p-0 h-auto">
                Detect Location
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Hospitals by Facility
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Search for hospitals based on the specific medical services you need
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {facilities.map((facility, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200">
                <CardContent className="p-6 text-center">
                  <facility.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{facility.name}</h3>
                  <p className="text-sm text-gray-600">{facility.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose HealthConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make finding the right healthcare facility simple and reliable
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Hospital?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your search now and connect with quality healthcare in your area
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-4 text-lg font-semibold rounded-xl transition-colors"
          >
            Start Searching
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Hospital className="h-6 w-6" />
                <span className="text-xl font-bold">HealthConnect</span>
              </div>
              <p className="text-gray-400">
                Connecting patients with quality healthcare facilities nationwide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Hospital Search</li>
                <li>Facility Finder</li>
                <li>Emergency Care</li>
                <li>Specialist Directory</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Partners</li>
                <li>News</li>
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
