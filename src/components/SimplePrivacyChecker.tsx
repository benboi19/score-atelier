import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { usePrivacyPrediction } from "@/hooks/use-privacy-api-simple";

interface PredictionResult {
  app_name: string;
  privacy_level: string;
  privacy_score: number;
  confidence: number;
  level_probabilities: Record<string, number>;
  risk_assessment: string;
  key_risk_factors: string[];
  recommendations: string[];
}

const SimplePrivacyChecker = () => {
  const [appInput, setAppInput] = useState("");
  const { data: prediction, loading, error, predict } = usePrivacyPrediction();

  const handleSearch = async () => {
    if (!appInput.trim()) {
      return;
    }

    try {
      // Send basic data with default values to trigger app database lookup
      const basicAppData = {
        app_name: appInput.trim(),
        category: "Social", // Default category - backend will use real data if found
        // Use default values from backend to trigger database lookup
        free: true,
        has_ads: false,
        has_iap: false,
        is_game: false,
        is_social: false,
        perm_location: 0,
        perm_camera: 0,
        perm_microphone: 0,
        perm_contacts: 0,
        perm_phone: 0,
        perm_sms: 0,
        perm_storage: 0,
        perm_calendar: 0,
        perm_network: 1, // Default network permission
        perm_device_info: 0,
        perm_accounts: 0,
        perm_system: 0,
        perm_other: 0
      };

      await predict(basicAppData);
      
    } catch (err) {
      console.error("Prediction failed:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW": return "text-green-600 bg-green-100";
      case "MEDIUM": return "text-yellow-600 bg-yellow-100";
      case "HIGH": return "text-orange-600 bg-orange-100";
      case "CRITICAL": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "LOW": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "MEDIUM": return <Shield className="h-5 w-5 text-yellow-600" />;
      case "HIGH": return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "CRITICAL": return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Main Search Interface */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <div className="space-y-6">
              
              {/* Search Input */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    type="text"
                    placeholder="Enter app name or package ID..."
                    value={appInput}
                    onChange={(e) => setAppInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 h-14 text-lg bg-white/90 border-white/30 placeholder:text-gray-500"
                    disabled={loading}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={loading || !appInput.trim()}
                    className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      "Check Privacy Score"
                    )}
                  </Button>
                </div>
                
                <p className="text-white/70 text-center">
                  Example: com.example.app or "Facebook"
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <Alert className="bg-red-500/20 border-red-500/50 text-white">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error?.message || 'An error occurred'}</AlertDescription>
                </Alert>
              )}

              {/* Results Display */}
              {prediction && (
                <div className="space-y-6 animate-in fade-in-50 duration-500">
                  
                  {/* Main Result Card */}
                  <Card className="bg-white/95 shadow-xl">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        
                        {/* App Name and Risk Level */}
                        <div className="text-center space-y-2">
                          <h2 className="text-2xl font-bold text-gray-900">
                            "{prediction.app_name}"
                          </h2>
                          <div className="flex items-center justify-center gap-3">
                            {getRiskIcon(prediction.privacy_level)}
                            <Badge className={`${getRiskColor(prediction.privacy_level)} text-lg px-4 py-2`}>
                              {prediction.privacy_level} RISK
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {(prediction.confidence * 100).toFixed(1)}% confidence
                            </span>
                          </div>
                        </div>

                        {/* Privacy Score */}
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {prediction.privacy_score}/56
                          </div>
                          <div className="text-sm text-gray-600">Privacy Score</div>
                          <div className="text-sm text-gray-500 mt-2">
                            {prediction.risk_assessment}
                          </div>
                        </div>

                        {/* Privacy Concerns - Enhanced */}
                        {prediction.key_risk_factors.length > 0 && (
                          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 rounded-lg p-4">
                            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5" />
                              Privacy Concerns Found
                            </h3>
                            <div className="space-y-3">
                              {prediction.key_risk_factors.slice(0, 6).map((factor, index) => {
                                // Dynamic icon based on concern type
                                const getIcon = (factor: string) => {
                                  if (factor.toLowerCase().includes('location')) return "📍";
                                  if (factor.toLowerCase().includes('contact')) return "👥";
                                  if (factor.toLowerCase().includes('camera')) return "📸";
                                  if (factor.toLowerCase().includes('microphone')) return "🎤";
                                  if (factor.toLowerCase().includes('sms') || factor.toLowerCase().includes('message')) return "💬";
                                  if (factor.toLowerCase().includes('ads') || factor.toLowerCase().includes('advertisement')) return "🎯";
                                  if (factor.toLowerCase().includes('permission')) return "⚙️";
                                  if (factor.toLowerCase().includes('social')) return "👥";
                                  if (factor.toLowerCase().includes('financial') || factor.toLowerCase().includes('payment')) return "💳";
                                  if (factor.toLowerCase().includes('health')) return "🏥";
                                  return "⚠️";
                                };
                                
                                return (
                                  <div key={index} className="flex items-start gap-3 p-2 bg-white/60 rounded-md">
                                    <span className="text-lg flex-shrink-0 mt-0.5">{getIcon(factor)}</span>
                                    <div className="flex-1">
                                      <p className="text-sm text-red-700 leading-relaxed">{factor}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Recommendations - Enhanced */}
                        {prediction.recommendations.length > 0 && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                              <Shield className="h-5 w-5" />
                              Privacy Protection Tips
                            </h3>
                            <div className="space-y-3">
                              {prediction.recommendations.slice(0, 5).map((rec, index) => (
                                <div key={index} className="flex items-start gap-3 p-2 bg-white/60 rounded-md">
                                  <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-1" />
                                  <p className="text-sm text-blue-700 leading-relaxed">{rec}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={() => setAppInput('')}
                      className="bg-white/90 hover:bg-white border border-gray-300"
                    >
                      Check Another App
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '/privacy'}
                      className="bg-white/90 hover:bg-white border border-gray-300"
                    >
                      Advanced Analysis
                    </Button>
                  </div>

                </div>
              )}

              {/* Instructions */}
              {!prediction && !loading && !error && (
                <div className="text-center text-white/80 space-y-2">
                  <p className="text-lg">Enter an app name to get instant privacy analysis</p>
                  <p className="text-sm">Powered by AI machine learning models</p>
                </div>
              )}

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default SimplePrivacyChecker;