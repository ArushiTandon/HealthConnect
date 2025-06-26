import { Hospital } from "lucide-react";

const ResultsHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hospital className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">HealthConnect</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
            <a href="#" className="text-blue-600 font-medium">Results</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default ResultsHeader;
