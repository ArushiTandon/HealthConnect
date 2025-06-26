
import { useState } from "react";
import ResultsHeader from "../components/ResultsHeader";
import FilterBar from "../components/FilterBar";
import HospitalCard from "../components/HospitalCard";

const Results = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedFacility, setSelectedFacility] = useState("All Facilities");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const hospitals = [
    {
      id: 1,
      name: "City General Hospital",
      city: "New York",
      availableBeds: 12,
      totalBeds: 100,
      facilities: ["ICU", "Emergency", "Surgery", "Trauma"],
      lastUpdated: "2 minutes ago",
      rating: 4.8,
      distance: "0.5 miles"
    },
    {
      id: 2,
      name: "Metropolitan Medical Center",
      city: "New York",
      availableBeds: 8,
      totalBeds: 150,
      facilities: ["ICU", "Emergency", "Specialized", "Surgery"],
      lastUpdated: "5 minutes ago",
      rating: 4.6,
      distance: "1.2 miles"
    },
    {
      id: 3,
      name: "Downtown Healthcare Hub",
      city: "Brooklyn",
      availableBeds: 25,
      totalBeds: 80,
      facilities: ["Emergency", "Urgent Care", "Surgery"],
      lastUpdated: "3 minutes ago",
      rating: 4.5,
      distance: "2.1 miles"
    },
    {
      id: 4,
      name: "Regional Medical Institute",
      city: "Queens",
      availableBeds: 5,
      totalBeds: 120,
      facilities: ["ICU", "Emergency", "Trauma", "Specialized"],
      lastUpdated: "1 minute ago",
      rating: 4.9,
      distance: "3.4 miles"
    },
    {
      id: 5,
      name: "Community Health Center",
      city: "Bronx",
      availableBeds: 18,
      totalBeds: 60,
      facilities: ["Emergency", "Urgent Care"],
      lastUpdated: "7 minutes ago",
      rating: 4.3,
      distance: "4.2 miles"
    }
  ];

  // Filter hospitals based on selected criteria
  const filteredHospitals = hospitals.filter(hospital => {
    // Search query filter
    if (searchQuery && !hospital.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // City filter
    if (selectedCity !== "All Cities" && hospital.city !== selectedCity) {
      return false;
    }

    // Available beds filter
    if (showOnlyAvailable && hospital.availableBeds === 0) {
      return false;
    }

    // Required facilities filter
    if (selectedFacilities.length > 0) {
      const hasAllRequiredFacilities = selectedFacilities.every(facility => 
        hospital.facilities.includes(facility)
      );
      if (!hasAllRequiredFacilities) {
        return false;
      }
    }

    return true;
  });

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
              Found {filteredHospitals.length} hospitals in your area
            </p>
          </div>
        </div>

        {/* Hospital Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {filteredHospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>

        {/* No results message */}
        {filteredHospitals.length === 0 && (
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
