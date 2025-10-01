import { Shield, Lock, Eye, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const values = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "We never store or share the data you check. Your privacy is our priority.",
  },
  {
    icon: Lock,
    title: "Transparent Analysis",
    description: "Our scoring methodology is open and based on industry-standard privacy practices.",
  },
  {
    icon: Eye,
    title: "User Empowerment",
    description: "We believe users deserve to know how their data is being used and shared.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Built with feedback from privacy advocates and security professionals.",
  },
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                About App Privacy Score
              </h2>
              
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  In an era where applications request extensive permissions and collect vast amounts of data, 
                  understanding privacy implications has never been more critical.
                </p>
                
                <p>
                  <span className="font-serif font-semibold text-foreground">AppPrivacyScore</span> was created 
                  to bridge the gap between complex privacy policies and user understanding. We analyze app 
                  permissions, data collection practices, and third-party integrations to provide clear, 
                  actionable insights.
                </p>
                
                <p>
                  Our mission is to empower users to make informed decisions about the applications they trust 
                  with their personal information, transforming opacity into transparency.
                </p>
              </div>
            </div>
            
            {/* Right content - Values grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card 
                  key={value.title}
                  className="p-6 bg-card border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent">
                      <value.icon className="h-6 w-6" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground">
                      {value.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
