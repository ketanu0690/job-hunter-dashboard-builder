import React, { useState, useEffect } from "react";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../services/blogService";
import { Blog } from "../types";

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newBlog, setNewBlog] = useState<Partial<Blog>>({});
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const data = await getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleCreateBlog = async () => {
    try {
      const createdBlog = await createBlog(newBlog);
      setBlogs([...blogs, createdBlog]);
      setNewBlog({});
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
  };

  const handleUpdateBlog = async () => {
    if (editingBlog) {
      try {
        const updatedBlog = await updateBlog(editingBlog);
        setBlogs(
          blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
        );
        setEditingBlog(null);
      } catch (error) {
        console.error("Error updating blog:", error);
      }
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      await deleteBlog(id);
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    if (editingBlog) {
      setEditingBlog({
        ...editingBlog,
        [field]: event.target.value,
      });
    } else {
      setNewBlog({
        ...newBlog,
        [field]: event.target.value,
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Blog Management</h2>

      {/* Create Blog Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Create New Blog</h3>
        <input
          type="text"
          placeholder="Title"
          value={newBlog.title || ""}
          onChange={(e) => handleInputChange(e, "title")}
          className="border border-gray-300 px-3 py-2 mb-2 w-full"
        />
        <textarea
          placeholder="Content"
          value={newBlog.content || ""}
          onChange={(e) => handleInputChange(e, "content")}
          className="border border-gray-300 px-3 py-2 mb-2 w-full h-32"
        />
        <button
          onClick={handleCreateBlog}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Blog
        </button>
      </div>

      {/* List Blogs Section */}
      <div>
        <h3 className="text-xl font-semibold mb-2">List of Blogs</h3>
        {loading ? (
          <p>Loading blogs...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Title</th>
                <th className="text-left">Content</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td>{blog.title}</td>
                  <td>{blog.content}</td>
                  <td>
                    <button
                      onClick={() => handleEditBlog(blog)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Blog Section */}
      {editingBlog && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Edit Blog</h3>
          <input
            type="text"
            placeholder="Title"
            value={editingBlog.title || ""}
            onChange={(e) => handleInputChange(e, "title")}
            className="border border-gray-300 px-3 py-2 mb-2 w-full"
          />
          <textarea
            placeholder="Content"
            value={editingBlog.content || ""}
            onChange={(e) => handleInputChange(e, "content")}
            className="border border-gray-300 px-3 py-2 mb-2 w-full h-32"
          />
          <button
            onClick={handleUpdateBlog}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Update Blog
          </button>
          <button
            onClick={() => setEditingBlog(null)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;