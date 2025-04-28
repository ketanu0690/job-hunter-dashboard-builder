import React from "react";
import { useParams } from "react-router-dom";

const BlogEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
      {/* Blog editing form goes here */}
      <div className="text-gray-500">Editing blog with ID: {id}</div>
    </div>
  );
};

export default BlogEditPage;
