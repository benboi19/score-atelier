import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Camera,
  MapPin,
  Mic,
  Users,
  Phone,
  MessageSquare,
  HardDrive,
  Calendar,
  Wifi,
  Smartphone,
  Settings
} from "lucide-react";
import { usePrivacyPrediction } from "@/hooks/use-privacy-api-simple";

interface Permission {
  key: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

const PermissionsChecker = () => {
  const [appName, setAppName] = useState("");
  const [category, setCategory] = useState("Social");
  const [hasAds, setHasAds] = useState(false);
  const [hasIAP, setHasIAP] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [isGame, setIsGame] = useState(false);
  const [isSocial, setIsSocial] = useState(false);
  
  const [permissions, setPermissions] = useState<Permission[]>([
    { key: 'perm_location', name: 'Location Access', description: 'Access to GPS location and location history', icon: <MapPin className="h-5 w-5" />, enabled: false },
    { key: 'perm_camera', name: 'Camera Access', description: 'Take pictures and record videos', icon: <Camera className="h-5 w-5" />, enabled: false },
    { key: 'perm_microphone', name: 'Microphone Access', description: 'Record audio and voice commands', icon: <Mic className="h-5 w-5" />, enabled: false },
    { key: 'perm_contacts', name: 'Contacts Access', description: 'Read and modify your contacts', icon: <Users className="h-5 w-5" />, enabled: false },
    { key: 'perm_phone', name: 'Phone Access', description: 'Make and manage phone calls', icon: <Phone className="h-5 w-5" />, enabled: false },
    { key: 'perm_sms', name: 'SMS Access', description: 'Send and receive text messages', icon: <MessageSquare className="h-5 w-5" />, enabled: false },
    { key: 'perm_storage', name: 'Storage Access', description: 'Read and write to device storage', icon: <HardDrive className="h-5 w-5" />, enabled: false },
    { key: 'perm_calendar', name: 'Calendar Access', description: 'Read and modify calendar events', icon: <Calendar className="h-5 w-5" />, enabled: false },
    { key: 'perm_network', name: 'Network Access', description: 'Access internet and network state', icon: <Wifi className="h-5 w-5" />, enabled: true },
    { key: 'perm_device_info', name: 'Device Info', description: 'Read device ID and hardware info', icon: <Smartphone className="h-5 w-5" />, enabled: false },
    { key: 'perm_accounts', name: 'Account Access', description: 'Access account information', icon: <Users className="h-5 w-5" />, enabled: false },
    { key: 'perm_system', name: 'System Access', description: 'Modify system settings', icon: <Settings className="h-5 w-5" />, enabled: false }
  ]);

  const { data: prediction, loading, error, predict } = usePrivacyPrediction();

  const togglePermission = (index: number) => {
    const newPermissions = [...permissions];
    newPermissions[index].enabled = !newPermissions[index].enabled;
    setPermissions(newPermissions);
  };

  const handleCalculateRisk = async () => {
    if (!appName.trim()) {
      alert("Please enter an app name");
      return;
    }

    const appData = {
      app_name: appName,
      category: category,
      free: isFree,
      has_ads: hasAds,
      has_iap: hasIAP,
      is_game: isGame,
      is_social: isSocial,
      perm_location: permissions.find(p => p.key === 'perm_location')?.enabled ? 1 : 0,
      perm_camera: permissions.find(p => p.key === 'perm_camera')?.enabled ? 1 : 0,
      perm_microphone: permissions.find(p => p.key === 'perm_microphone')?.enabled ? 1 : 0,
      perm_contacts: permissions.find(p => p.key === 'perm_contacts')?.enabled ? 1 : 0,
      perm_phone: permissions.find(p => p.key === 'perm_phone')?.enabled ? 1 : 0,
      perm_sms: permissions.find(p => p.key === 'perm_sms')?.enabled ? 1 : 0,
      perm_storage: permissions.find(p => p.key === 'perm_storage')?.enabled ? 1 : 0,
      perm_calendar: permissions.find(p => p.key === 'perm_calendar')?.enabled ? 1 : 0,
      perm_network: permissions.find(p => p.key === 'perm_network')?.enabled ? 1 : 0,
      perm_device_info: permissions.find(p => p.key === 'perm_device_info')?.enabled ? 1 : 0,
      perm_accounts: permissions.find(p => p.key === 'perm_accounts')?.enabled ? 1 : 0,
      perm_system: permissions.find(p => p.key === 'perm_system')?.enabled ? 1 : 0,
      perm_other: 0
    };

    try {
      await predict(appData);
    } catch (err) {
      console.error("Prediction failed:", err);
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
      case "LOW": return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "MEDIUM": return <Shield className="h-6 w-6 text-yellow-600" />;
      case "HIGH": return <AlertTriangle className="h-6 w-6 text-orange-600" />;
      case "CRITICAL": return <XCircle className="h-6 w-6 text-red-600" />;
      default: return <Shield className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-purple-900/90 backdrop-blur-lg border-b border-blue-800/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="text-blue-100 hover:text-white hover:bg-blue-800/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <img src="/glasslogo.png" alt="GlassBox Logo" className="h-12 w-12" />
              <span className="text-2xl font-serif font-semibold bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent">
                Glassbox
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Calculate Privacy Risk Score
            </h1>
            <p className="text-blue-100 text-lg">
              Enter your app details and permissions to get an immediate privacy risk assessment
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-xl">App Information & Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic App Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="appName" className="text-blue-100">App Name *</Label>
                    <Input
                      id="appName"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      placeholder="Enter app name..."
                      className="bg-blue-800/30 border-blue-300/50 text-white placeholder:text-blue-200/70"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="text-blue-100">Category</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 rounded-md bg-blue-800/30 border border-blue-300/50 text-white"
                    >
                      <option value="Social">Social</option>
                      <option value="Communication">Communication</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Productivity">Productivity</option>
                      <option value="Games">Games</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Finance">Finance</option>
                      <option value="Health">Health</option>
                      <option value="Education">Education</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* App Properties */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold">App Properties</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="free" checked={isFree} onCheckedChange={setIsFree} />
                      <Label htmlFor="free" className="text-blue-100">Free App</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="ads" checked={hasAds} onCheckedChange={setHasAds} />
                      <Label htmlFor="ads" className="text-blue-100">Contains Ads</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="iap" checked={hasIAP} onCheckedChange={setHasIAP} />
                      <Label htmlFor="iap" className="text-blue-100">In-App Purchases</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="game" checked={isGame} onCheckedChange={setIsGame} />
                      <Label htmlFor="game" className="text-blue-100">Is Game</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="social" checked={isSocial} onCheckedChange={setIsSocial} />
                      <Label htmlFor="social" className="text-blue-100">Social Features</Label>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold">App Permissions</h3>
                  <div className="grid gap-3 max-h-80 overflow-y-auto">
                    {permissions.map((permission, index) => (
                      <div key={permission.key} className="flex items-center justify-between p-3 bg-blue-800/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-blue-200">{permission.icon}</div>
                          <div>
                            <div className="text-white font-medium">{permission.name}</div>
                            <div className="text-blue-200 text-sm">{permission.description}</div>
                          </div>
                        </div>
                        <Switch
                          checked={permission.enabled}
                          onCheckedChange={() => togglePermission(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleCalculateRisk}
                  disabled={loading || !appName.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calculating...
                    </>
                  ) : (
                    'Calculate Privacy Risk Score'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-xl">Privacy Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-4 border-red-500 bg-red-500/10">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-200">
                      {error?.message || 'An error occurred'}
                    </AlertDescription>
                  </Alert>
                )}

                {!prediction && !loading && !error && (
                  <div className="text-center py-12">
                    <Shield className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                    <p className="text-blue-200">
                      Enter app information and permissions to calculate the privacy risk score
                    </p>
                  </div>
                )}

                {prediction && (
                  <div className="space-y-6">
                    {/* Score Display */}
                    <div className="text-center p-6 bg-gray-900/30 rounded-lg">
                      <div className="flex items-center justify-center mb-4">
                        {getRiskIcon(prediction.privacy_level)}
                      </div>
                      <div className="text-4xl font-bold text-white mb-2">
                        {prediction.privacy_score} out of 100
                      </div>
                      <Badge className={`${getRiskColor(prediction.privacy_level)} text-lg px-4 py-2 mb-2`}>
                        {prediction.privacy_level} RISK
                      </Badge>
                      <div className="text-blue-200 text-sm">
                        {(prediction.confidence * 100).toFixed(1)}% confidence
                      </div>
                      <div className="text-blue-100 text-sm mt-2">
                        {prediction.risk_assessment}
                      </div>
                    </div>

                    {/* Risk Factors */}
                    {prediction.key_risk_factors && prediction.key_risk_factors.length > 0 && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <h3 className="font-semibold text-red-200 mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Key Risk Factors
                        </h3>
                        <ul className="space-y-2">
                          {prediction.key_risk_factors.slice(0, 5).map((factor, index) => (
                            <li key={index} className="text-red-100 text-sm flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {prediction.recommendations && prediction.recommendations.length > 0 && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-200 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Recommendations
                        </h3>
                        <ul className="space-y-2">
                          {prediction.recommendations.slice(0, 5).map((rec, index) => (
                            <li key={index} className="text-blue-100 text-sm flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsChecker;