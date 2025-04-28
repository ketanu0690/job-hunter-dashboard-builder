import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBlogs } from "../services/blogService";
import { Blog } from "../types";

const BlogListPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBlogs();
        if (isMounted) setBlogs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        if (isMounted) setError("Failed to fetch blogs.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlogs();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <button
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
          title="Create Blog"
          onClick={() => navigate("/blogs/create")}
        >
          +
        </button>
      </div>

      {loading && <div>Loading blogs...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && !error && (
        <ul className="space-y-4">
          {blogs.map((blog) => (
            <li
              key={blog.id}
              className="flex items-center justify-between p-4 border rounded shadow-sm hover:bg-gray-50"
            >
              <div>
                <div className="font-semibold">{blog.content.blog_name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(blog.content.created_at).toLocaleDateString()}
                </div>
              </div>
              <button
                className="p-2 text-blue-600 hover:text-blue-800"
                title="Edit Blog"
                onClick={() => navigate(`/blogs/edit/${blog.id}`)}
              >
                ✏️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogListPage;
