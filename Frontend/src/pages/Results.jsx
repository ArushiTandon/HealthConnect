import { useState, useEffect } from "react";
import API from "@/lib/axios.js";
import ResultsHeader from "../components/ResultsHeader.jsx";
import FilterBar from "../components/FilterBar.jsx";
import HospitalCard from "../components/HospitalCard.jsx";

const Results = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedFacility, setSelectedFacility] = useState("All Facilities");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const params = {};

      // Add parameters only if they have values
      if (selectedCity !== "All Cities") {
        params.city = selectedCity;
      }
      
      if (selectedFacility !== "All Facilities") {
        params.facility = selectedFacility;
      }
      
      if (selectedSpecialty !== "All Specialties") {
        params.specialty = selectedSpecialty;
      }
      
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      if (showOnlyAvailable) {
        params.beds = "true";
      }
      
      // Handle multiple facilities from checkboxes
      if (selectedFacilities.length > 0) {
        params.facility = selectedFacilities.join(",");
      }

      console.log('Sending params:', params);

      const response = await API.get("/hospitals/filter", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params
      });

      setHospitals(response.data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchHospitals();
    }, searchQuery ? 300 : 0); // Debounce search, but fetch immediately for other filters

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch immediately when other filters change
  useEffect(() => {
    fetchHospitals();
  }, [selectedCity, selectedFacility, selectedSpecialty, selectedFacilities, showOnlyAvailable]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <ResultsHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedFacility={selectedFacility}
          setSelectedFacility={setSelectedFacility}
          selectedSpecialty={selectedSpecialty}
          setSelectedSpecialty={setSelectedSpecialty}
          selectedFacilities={selectedFacilities}
          setSelectedFacilities={setSelectedFacilities}
          showOnlyAvailable={showOnlyAvailable}
          setShowOnlyAvailable={setShowOnlyAvailable}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Hospital Search Results
            </h1>
            <p className="text-gray-600">
              Found {hospitals.length} hospitals in your area
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading hospitals...</span>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {hospitals.map((hospital) => (
              <HospitalCard key={hospital._id} hospital={hospital} />
            ))}
          </div>
        )}

        {/* No results message */}
        {!loading && hospitals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No hospitals found</div>
            <div className="text-gray-400">Try adjusting your search criteria</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;