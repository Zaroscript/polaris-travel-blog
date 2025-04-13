import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const { theme } = useThemeStore();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto border-t border-border/50 bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center mb-4 text-foreground"
            >
              <img 
                src={theme !== "light" ? "/logoDark.svg" : "/logo.svg"} 
                alt="Polaris" 
                className="w-10 h-10 mr-2" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = theme !== "light" 
                    ? "/assets/images/logoDark-fallback.svg" 
                    : "/assets/images/logo-fallback.svg";
                }}
              />
              <span className="font-bold text-2xl">Polaris</span>
            </Link>
            <p className="text-muted-foreground">
              Exploring the world one adventure at a time. Join us on our
              journey of discovery.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors w-9 h-9 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors w-9 h-9 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors w-9 h-9 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold">Quick Links</h5>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/destinations"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/social"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  Social Feed
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold">Contact Us</h5>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  123 Adventure Lane, Explorer's District, London, UK
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">
                  +44 123 456 7890
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">
                  hello@polaris-travel.com
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold">Newsletter</h5>
            <p className="text-muted-foreground">
              Subscribe to our newsletter for travel tips and inspiration.
            </p>
            <form className="space-y-2">
              <Input 
                className="border border-border bg-muted/50 text-foreground"
                placeholder="Your email address" 
                type="email"
                aria-label="Your email address" 
                required 
              />
              <Button className="w-full" type="submit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-border/50 text-sm text-muted-foreground">
          <p className="mb-4 sm:mb-0">
            &copy; {currentYear} Polaris Travel. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/sitemap" className="hover:text-primary transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
