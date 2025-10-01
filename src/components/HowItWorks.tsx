import { Search, Shield, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Input App Details",
    description: "Simply enter the app name or package ID. Our system works with applications across all major platforms.",
  },
  {
    icon: Shield,
    number: "02",
    title: "Deep Privacy Analysis",
    description: "We examine permissions, data collection practices, and third-party integrations to understand the complete privacy picture.",
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Receive Your Score",
    description: "Get a comprehensive privacy score with detailed insights and actionable recommendations to protect your data.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three simple steps to understand your app's privacy profile
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <Card 
              key={step.number}
              className="relative p-8 bg-card border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connecting line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 -right-4 w-8 h-[2px] bg-gradient-to-r from-accent/50 to-transparent" />
              )}
              
              <div className="space-y-4">
                {/* Number badge */}
                <div className="inline-block">
                  <div className="text-5xl font-serif font-bold text-accent/20 group-hover:text-accent/30 transition-colors">
                    {step.number}
                  </div>
                </div>
                
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                  <step.icon className="h-7 w-7" />
                </div>
                
                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
