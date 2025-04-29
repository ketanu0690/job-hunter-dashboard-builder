import {Link } from "react-router-dom";

import Header from "../components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center py-16">
        <div className="max-w-2xl w-full text-center">
          <h2 className="text-4xl font-extrabold mb-4 text-blue-700 dark:text-blue-200">
            Supercharge Your Job Search
          </h2>
          <p className="mb-8 text-gray-600 dark:text-gray-300 text-lg">
            TechJobTracker helps you organize, automate, and track your job
            search across multiple platforms. Effortlessly manage applications,
            automate LinkedIn Easy Apply, and more.
          </p>
          <Link
            to="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow transition-all text-lg mb-4 inline-block"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>
      <footer className="w-full py-4 bg-white dark:bg-gray-900 text-center text-gray-400 text-xs border-t mt-8">
        © {new Date().getFullYear()} TechJobTracker. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
