import { Search, Filter, Hospital, MapPin, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Switch } from "./ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState, useEffect } from "react";
import { hospitalApi } from '../services/adminApi';

const FilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  selectedFacility,
  setSelectedFacility,
  selectedSpecialty,
  setSelectedSpecialty,
  selectedFacilities,
  setSelectedFacilities,
  showOnlyAvailable,
  setShowOnlyAvailable,
}) => {
  const [filterOptions, setFilterOptions] = useState({
    cities: ["All Cities"],
    facilities: ["All Facilities"],
    specialties: ["All Specialties"],
    facilityCheckboxOptions: []
  });

  // Fetch filter options from backend
  useEffect(() => {
    const fetchFilterOptions = async () => {
  try {
    const data = await hospitalApi.getFilterOptions();
    setFilterOptions(data);
  } catch (error) {
    console.error('Error fetching filter options:', error);
        // Fallback to hardcoded options if API fails
        setFilterOptions({
          cities: ["All Cities", "New Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur"],
          facilities: ["All Facilities", "ICU", "Emergency", "Surgery", "Dialysis", "Radiology", "Laboratory", "Pharmacy", "Blood Bank", "Ambulance"],
          specialties: ["All Specialties", "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology", "Gastroenterology", "Nephrology", "Pulmonology", "Dermatology"],
          facilityCheckboxOptions: ["ICU", "Emergency", "Surgery", "Dialysis", "Radiology", "Laboratory", "Pharmacy", "Blood Bank"]
        });
      }
    };

    fetchFilterOptions();
  }, []);

  // const handleFacilityCheckbox = (facility, checked) => {
  //   let updatedFacilities;
  //   if (checked) {
  //     updatedFacilities = [...selectedFacilities, facility];
  //   } else {
  //     updatedFacilities = selectedFacilities.filter(f => f !== facility);
  //   }
  //   setSelectedFacilities(updatedFacilities);
  // };

  // Handle search query change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // Handle dropdown changes
  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  const handleFacilityChange = (facility) => {
    setSelectedFacility(facility);
  };

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialty(specialty);
  };

  const handleAvailableBedsChange = (checked) => {
    setShowOnlyAvailable(checked);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search hospitals..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 border-gray-300 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[140px] justify-between">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {selectedCity}
                </div>
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {filterOptions.cities.map((city) => (
                <DropdownMenuItem key={city} onClick={() => handleCityChange(city)}>
                  {city}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[140px] justify-between">
                <div className="flex items-center">
                  <Hospital className="h-4 w-4 mr-2" />
                  {selectedFacility}
                </div>
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {filterOptions.facilities.map((facility) => (
                <DropdownMenuItem key={facility} onClick={() => handleFacilityChange(facility)}>
                  {facility}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[140px] justify-between">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  {selectedSpecialty}
                </div>
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {filterOptions.specialties.map((specialty) => (
                <DropdownMenuItem key={specialty} onClick={() => handleSpecialtyChange(specialty)}>
                  {specialty}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Facility Checkboxes */}
      {/* <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Required Facilities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filterOptions.facilityCheckboxOptions.map((facility) => (
            <div key={facility} className="flex items-center space-x-2">
              <Checkbox
                id={facility}
                checked={selectedFacilities.includes(facility)}
                onCheckedChange={(checked) => handleFacilityCheckbox(facility, checked)}
              />
              <label
                htmlFor={facility}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {facility}
              </label>
            </div>
          ))}
        </div>
      </div> */}

      {/* Toggle Switch */}
      <div className="flex items-center space-x-3">
        <Switch
          id="available-beds"
          checked={showOnlyAvailable}
          onCheckedChange={handleAvailableBedsChange}
        />
        <label
          htmlFor="available-beds"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show only hospitals with available beds
        </label>
      </div>
    </div>
  );
};

export default FilterBar;