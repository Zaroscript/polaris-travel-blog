import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react"; // Using lucide icons
import { useThemeStore } from "@/store/useThemeStore";

const Footer = () => {
  const { theme } = useThemeStore();
  return (
    <footer className="footer-polaris mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-4">
            <Link
              to="/"
              className="flex items-center mb-4 text-polaris-dark no-underline"
            >
              <img src={theme !== "light" ? "/logoDark.svg" : "/logo.svg"} alt="Polaris" className="w-10 h-10 mr-2" />
              <span className="font-bold text-2xl">Polaris</span>
            </Link>
            <p className="text-gray-600 mb-4">
              Exploring the world one adventure at a time. Join us on our
              journey of discovery.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-gray-600 hover:text-polaris-primary hover-lift">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-600 hover:text-polaris-primary hover-lift">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-600 hover:text-polaris-primary hover-lift">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-polaris-dark mb-3">Quick Links</h5>
            <ul className="list-none">
              <li className="mb-2">
                <Link
                  to="/"
                  className="text-gray-600 no-underline hover:text-polaris-primary hover-lift"
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/about"
                  className="text-gray-600 no-underline hover:text-polaris-primary hover-lift"
                >
                  About
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/destinations"
                  className="text-gray-600 no-underline hover:text-polaris-primary hover-lift"
                >
                  Destinations
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/blogs"
                  className="text-gray-600 no-underline hover:text-polaris-primary hover-lift"
                >
                  Blog
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/social"
                  className="text-gray-600 no-underline hover:text-polaris-primary hover-lift"
                >
                  Social Feed
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-polaris-dark mb-3">Top Destinations</h5>
            <ul className="list-none">
              <li className="mb-2">
                <a
                  href="#"
                  className="text-gray-600 no-underline hover:text-polaris-primary hover-lift"
                >
                  Bali, Indonesia
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-gray-600 no-underline hover:text-polaris-primary hover-lift"
                >
                  Santorini, Greece
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-gray-600 no-underline hover:text-polaris-primary hover-lift"
                >
                  Kyoto, Japan
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-gray-600 no-underline hover:text-polaris-primary hover-lift"
                >
                  Machu Picchu, Peru
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-gray-600 no-underline hover:text-polaris-primary hover-lift"
                >
                  Marrakech, Morocco
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-polaris-dark mb-3">Newsletter</h5>
            <p className="text-gray-600 mb-3">
              Subscribe to our newsletter for travel tips and inspiration.
            </p>
            <form>
              <input className="mb-3 p-2 rounded text-primary dark:text-primary-foreground" placeholder="Your email address" aria-label="Your email address" required />
              <button className="bg-primary dark:bg-primary-foreground text-white p-2 rounded" type="submit">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="my-4 bg-white-50 opacity-25" />

        <div className="text-center text-white-50 py-3">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Polaris. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
