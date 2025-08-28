import { Search, X, FileText, Newspaper } from "lucide-react";
import { useState, useEffect, FC } from "react";
import { useTheme } from "../utils/use-theme";
import { useNavigate } from "@tanstack/react-router";

interface UniversalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data - in a real app, this would come from an API
const mockResults = {
  blogs: [
    { title: "How to Ace Your Next Interview", path: "/blogs" },
    { title: "Resume Building 101", path: "/blogs" },
    { title: "Navigating the Job Market in 2025", path: "/blogs" },
  ],
  documents: [
    { title: "Onboarding Documentation", path: "/docs/onboarding" },
    { title: "API Reference", path: "/docs/api" },
  ],
  pages: [
    { title: "Dashboard", path: "/dashboard" },
    { title: "Manage Blogs", path: "/manage-blogs" },
    { title: "K-Mentor", path: "/kmentor" },
  ],
};

const UniversalSearch: FC<UniversalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNavigation = (path: string) => {
    navigate({ to: path as any });
    onClose();
  };

  const filteredBlogs = mockResults.blogs.filter((b) =>
    b.title.toLowerCase().includes(query.toLowerCase())
  );
  const filteredDocs = mockResults.documents.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase())
  );
  const filteredPages = mockResults.pages.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  const hasResults =
    filteredBlogs.length > 0 ||
    filteredDocs.length > 0 ||
    filteredPages.length > 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl mx-4 sm:mx-0 rounded-xl shadow-2xl overflow-hidden ${
          theme === "dark"
            ? "bg-gray-900 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 p-1">
          <Search className="text-gray-400 dark:text-gray-500 mx-4" size={22} />
          <input
            type="text"
            placeholder="Search for blogs, documents, pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 py-2"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="text-gray-500 dark:text-gray-400" size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
          {hasResults ? (
            <>
              {/* Blogs */}
              {filteredBlogs.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Blogs
                  </div>
                  {filteredBlogs.map((b, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleNavigation(b.path)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition"
                    >
                      <Newspaper size={18} className="text-gray-500" />
                      <span className="text-gray-900 dark:text-gray-100">
                        {b.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Documents */}
              {filteredDocs.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Documents
                  </div>
                  {filteredDocs.map((d, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleNavigation(d.path)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition"
                    >
                      <FileText size={18} className="text-gray-500" />
                      <span className="text-gray-900 dark:text-gray-100">
                        {d.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Pages */}
              {filteredPages.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Pages
                  </div>
                  {filteredPages.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleNavigation(p.path)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition"
                    >
                      <FileText size={18} className="text-gray-500" />
                      <span className="text-gray-900 dark:text-gray-100">
                        {p.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              No results found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversalSearch;
