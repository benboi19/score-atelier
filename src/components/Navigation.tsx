import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Navigation = () => {
  const handleQuickCheck = () => {
    // Navigate to permissions checker page
    window.location.href = '/permissions';
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-purple-900/90 backdrop-blur-lg border-b border-blue-800/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/glasslogo.png" alt="GlassBox Logo" className="h-16 w-16" />
            <span className="text-3xl font-serif font-semibold bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent">
              Glassbox
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#example" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">
              See Example
            </a>
            <a href="#about" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">
              About
            </a>
            <Button 
              onClick={handleQuickCheck}
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white border-none px-4"
            >
              <Search className="h-4 w-4 mr-2" />
              Check App Risk
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
