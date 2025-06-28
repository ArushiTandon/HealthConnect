import { useState, useEffect } from "react";
import API from "../lib/axios";
import ResultsHeader from "../components/ResultsHeader";
import FilterBar from "../components/FilterBar";
import HospitalCard from "../components/HospitalCard";


const Results = () => {
  const [hospitals, setHospitals] = useState<HospitalCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedFacility, setSelectedFacility] = useState("All Facilities");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

type HospitalCard = {
  _id: string; // MongoDB gives this automatically
  name: string;
  city: string;
  address: string;
  contactNumber: string;
  email?: string;
  website?: string;
  totalBeds: number;
  availableBeds: number;
  icuBeds?: number;
  emergencyBeds?: number;
  lastUpdated?: string; // or Date, depending on how you parse it
  facilities: string[];
  facilityStatus?: Record<string, string>; // a map of string -> string
  medicalSpecialties: string[];
  rating?: number;
  notes?: string;
}

  const fetchHospitals = async () => {

    try {
      const token = localStorage.getItem("authToken");
      const query = new URLSearchParams();

      if(selectedCity !== "All Cities") query.append("city", selectedCity);
      if(searchQuery) query.append("search", searchQuery);
      if(showOnlyAvailable) query.append("beds", "true");
      if(selectedFacilities.length > 0)
        query.append("facility", selectedFacilities.join(","));

      const response = await API.get(`/hospitals/filter`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: query
      })

      setHospitals(response.data);

      
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHospitals();
  }, [searchQuery, selectedCity, showOnlyAvailable, selectedFacilities]);

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
          <p>Loading...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {hospitals.map((hospital) => (
              <HospitalCard key={hospital._id} hospital={hospital} />
            ))}
          </div>
        )}

        {/* No results message */}
        {hospitals.length === 0 && (
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
