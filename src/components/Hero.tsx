import { Shield, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroAbstract from "@/assets/hero-abstract.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-95" />
      
      {/* Abstract background image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroAbstract} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 opacity-10">
        <Shield className="h-32 w-32 text-white animate-float" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10" style={{ animationDelay: "1s" }}>
        <Lock className="h-24 w-24 text-white animate-float" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/90 text-sm">
            <Eye className="h-4 w-4" />
            <span>Protecting Your Digital Privacy</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
            Know What Apps <br />
            <span className="text-rose-gold">Really Know</span> About You
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-light">
            Discover how applications handle your data with our sophisticated privacy scoring system. 
            Make informed decisions about your digital security.
          </p>
          
          {/* App Check Input */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-glow">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input 
                  placeholder="Enter app name or package ID..." 
                  className="flex-1 bg-white/95 border-white/30 text-foreground placeholder:text-muted-foreground h-12 text-base"
                />
                <Button variant="hero" size="lg" className="h-12 px-8 whitespace-nowrap">
                  Check Privacy Score
                </Button>
              </div>
              <p className="text-white/60 text-sm mt-3">
                Example: com.example.app or "Facebook"
              </p>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Trusted by 50K+ users</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>100% Private Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Real-time Results</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
