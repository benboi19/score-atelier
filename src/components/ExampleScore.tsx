import { Shield, AlertTriangle, CheckCircle2, XCircle, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const ExampleScore = () => {
  const score = 68;
  const permissions = [
    { name: "Camera Access", status: "granted", risk: "medium" },
    { name: "Location Data", status: "granted", risk: "high" },
    { name: "Contacts", status: "denied", risk: "low" },
    { name: "Microphone", status: "granted", risk: "medium" },
    { name: "Storage", status: "granted", risk: "low" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-accent";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent Privacy";
    if (score >= 60) return "Good Privacy";
    return "Privacy Concerns";
  };

  const getRiskColor = (risk: string) => {
    if (risk === "high") return "destructive";
    if (risk === "medium") return "default";
    return "secondary";
  };

  return (
    <section id="example" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Example Privacy Score
          </h2>
          <p className="text-lg text-muted-foreground">
            See how we present app privacy information in a clear, actionable format
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Score Card */}
          <Card className="p-8 bg-gradient-subtle border-border shadow-elegant animate-scale-in">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Score Circle */}
              <div className="relative">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${score * 5.53} 553`}
                      className={getScoreColor(score)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
                      {score}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      out of 100
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Score Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
                    Sample Social App
                  </h3>
                  <Badge variant="secondary" className="text-sm">
                    {getScoreLabel(score)}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground">
                  This app collects some personal data but implements reasonable security measures. 
                  Consider reviewing location permissions for better privacy.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Encrypted Storage</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>No Ad Tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Location Always On</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Permissions Breakdown */}
          <Card className="p-8 bg-card border-border shadow-elegant animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-accent" />
              <h4 className="text-xl font-semibold text-foreground">
                Permissions Analysis
              </h4>
            </div>
            
            <div className="space-y-4">
              {permissions.map((permission, index) => (
                <div 
                  key={permission.name}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    {permission.status === "granted" ? (
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="font-medium text-foreground">
                      {permission.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={getRiskColor(permission.risk)}>
                      {permission.risk} risk
                    </Badge>
                    <span className="text-sm text-muted-foreground capitalize">
                      {permission.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 rounded-lg bg-accent-light border border-accent/20 flex gap-3">
              <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div className="text-sm text-foreground">
                <strong className="font-semibold">Privacy Tip:</strong> Review high-risk permissions regularly. 
                Consider denying location access when the app is not in use to enhance your privacy.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ExampleScore;
