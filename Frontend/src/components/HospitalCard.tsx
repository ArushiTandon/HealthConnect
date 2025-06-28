import { Hospital, Heart, Ambulance, Shield, Clock, Star, MapPin, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useNavigate } from "react-router-dom";

export interface Hospital {
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
  distance?: string; 
}


interface HospitalCardProps {
  hospital: Hospital;
}

const HospitalCard = ({ hospital }: HospitalCardProps) => {
  const navigate = useNavigate();

  const getFacilityIcon = (facility: string) => {
    switch (facility) {
      case "ICU": return Heart;
      case "Emergency": return Ambulance;
      case "Surgery": return Hospital;
      case "Trauma": return Shield;
      case "Urgent Care": return Clock;
      case "Specialized": return Star;
      default: return Hospital;
    }
  };

  const getBedStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 20) return "text-green-600";
    if (percentage > 10) return "text-yellow-600";
    return "text-red-600";
  };

  const handleViewDetails = () => {
    navigate(`/hospital/gethospital/${hospital._id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-2 hover:border-blue-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-gray-900 mb-2">
              {hospital.name}
            </CardTitle>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{hospital.city} • {hospital.distance}</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{hospital.rating}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-semibold ${getBedStatus(hospital.availableBeds, hospital.totalBeds)}`}>
              {hospital.availableBeds}/{hospital.totalBeds}
            </div>
            <div className="text-xs text-gray-500">Available Beds</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Facilities */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Available Facilities</h4>
          <div className="flex flex-wrap gap-2">
            {hospital.facilities.map((facility) => {
              const IconComponent = getFacilityIcon(facility);
              return (
                <div
                  key={facility}
                  className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  <IconComponent className="h-3 w-3 mr-1" />
                  {facility}
                </div>
              );
            })}
          </div>
        </div>

        {/* Last Updated and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            Updated {hospital.lastUpdated}
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalCard;