import { Shield, Github, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-rose-gold" />
              <span className="text-lg font-serif font-semibold">
                AppPrivacy<span className="text-rose-gold">Score</span>
              </span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Empowering users to make informed decisions about their digital privacy.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <a href="#how-it-works" className="hover:text-rose-gold transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#example" className="hover:text-rose-gold transition-colors">
                  Example
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-rose-gold transition-colors">
                  API Access
                </a>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <a href="#about" className="hover:text-rose-gold transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-rose-gold transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-rose-gold transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          
          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-rose-gold transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-rose-gold transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-rose-gold transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>© 2025 AppPrivacyScore. All rights reserved. Built with privacy in mind.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
