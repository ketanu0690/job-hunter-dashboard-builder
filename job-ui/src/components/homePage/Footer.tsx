import { Github } from "lucide-react";
import { Link } from "@tanstack/react-router";


const Footer = () => {
  return (
    <footer className="bg-background py-16 border-t border-accent">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <h3 className="text-2xl font-bold text-accent border-b-2 border-accent inline-block pb-1">
                JobPlatform
              </h3>
            </Link>
            <p className="text-muted-foreground mb-6">
              Empowering tech professionals to find their dream careers through
              an open-source job platform.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-medium text-lg mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-link transition-colors"
                >
                  Browse Jobs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-link transition-colors"
                >
                  Companies
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-link transition-colors"
                >
                  Mentorship
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-link transition-colors"
                >
                  Resources
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-medium text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-link transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-link transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-link transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-link transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-medium text-lg mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-link transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-link transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-link transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-accent flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} JobPlatform. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center">
            Made with <span className="px-1 text-red-500">♥</span> by
            open-source contributors
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
