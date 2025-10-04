import { Shield, Lock, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import heroAbstract from "@/assets/hero-abstract.jpg";

const Hero = () => {
  const [appInput, setAppInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const checkPrivacyScore = async () => {
    if (!appInput.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('http://localhost:8003/predict/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ app_name: appInput.trim() }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const error = await response.json();
        setResult({ error: error.detail || 'Failed to check privacy score' });
      }
    } catch (error) {
      setResult({ error: 'Unable to connect to privacy service. Please ensure the backend is running.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkPrivacyScore();
    }
  };

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
                  value={appInput}
                  onChange={(e) => setAppInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter app name or package ID..." 
                  className="flex-1 bg-white/95 border-white/30 text-foreground placeholder:text-muted-foreground h-12 text-base"
                  disabled={isLoading}
                />
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="h-12 px-8 whitespace-nowrap"
                  onClick={checkPrivacyScore}
                  disabled={isLoading || !appInput.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Checking...
                    </>
                  ) : (
                    'Check Privacy Score'
                  )}
                </Button>
              </div>
              <p className="text-white/60 text-sm mt-3">
                Example: com.example.app or "Facebook"
              </p>
              
              {/* Results Display */}
              {result && (
                <div className="mt-6 animate-fade-in-up">
                  {result.error ? (
                    <div className="bg-red-500/20 backdrop-blur-lg border border-red-400/30 rounded-xl p-4 text-red-100">
                      <p className="font-medium">Error</p>
                      <p className="text-sm opacity-90">{result.error}</p>
                    </div>
                  ) : (
                    <div className="bg-white/15 backdrop-blur-lg border border-white/30 rounded-xl p-6 text-white">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-rose-gold mb-1">
                            {result.privacy_score?.toFixed(1) || 'N/A'}
                          </div>
                          <div className="text-sm opacity-80">Privacy Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-semibold mb-1">
                            {result.privacy_level || 'Unknown'}
                          </div>
                          <div className="text-sm opacity-80">Risk Level</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-medium mb-1">
                            {(result.confidence * 100)?.toFixed(1) || '0'}%
                          </div>
                          <div className="text-sm opacity-80">Confidence</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="text-sm opacity-90 mb-2">
                          <strong>App:</strong> {result.app_name}
                        </p>
                        {result.risk_assessment && (
                          <p className="text-sm opacity-80">
                            {result.risk_assessment}
                          </p>
                        )}
                        {result.key_risk_factors && result.key_risk_factors.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium mb-1">Key Risk Factors:</p>
                            <ul className="text-xs opacity-80 space-y-1">
                              {result.key_risk_factors.slice(0, 3).map((factor, index) => (
                                <li key={index}>• {factor}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
