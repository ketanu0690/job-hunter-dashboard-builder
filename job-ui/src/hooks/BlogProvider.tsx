import React, {
  createContext,
  useReducer,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { Blog } from "../shared/types";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../services/blogService";

// --- State & Actions ---
interface State {
  blogs: Blog[];
  loading: boolean;
  newBlog: Partial<Blog>;
  editingBlog: Blog | null;
  isCreatingNew: boolean;
  activeTab: string;
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_BLOGS"; payload: Blog[] }
  | { type: "SET_NEW_BLOG"; payload: Partial<Blog> }
  | { type: "SET_EDITING_BLOG"; payload: Blog | null }
  | { type: "SET_CREATING_NEW"; payload: boolean }
  | { type: "SET_ACTIVE_TAB"; payload: string };

const initialState: State = {
  blogs: [],
  loading: true,
  newBlog: {},
  editingBlog: null,
  isCreatingNew: false,
  activeTab: "published",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_BLOGS":
      return { ...state, blogs: action.payload };
    case "SET_NEW_BLOG":
      return { ...state, newBlog: action.payload };
    case "SET_EDITING_BLOG":
      return { ...state, editingBlog: action.payload };
    case "SET_CREATING_NEW":
      return { ...state, isCreatingNew: action.payload };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    default:
      return state;
  }
}

// --- Context ---
interface BlogContextType extends State {
  handleCreateBlog: (blog: Partial<Blog>) => Promise<void>;
  handleUpdateBlog: (blog: Blog) => Promise<void>;
  handleDeleteBlog: (id: string) => Promise<void>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Blog
  ) => void;
  handleEditBlog: (blog: Blog) => void;
  handleCreateNew: () => void;
  handleBack: () => void;
  setActiveTab: (tab: string) => void;
}

export const BlogContext = createContext<BlogContextType | undefined>(
  undefined
);

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch blogs
  useEffect(() => {
    (async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const data = await getBlogs();
        dispatch({ type: "SET_BLOGS", payload: data });
      } catch (err) {
        console.error(err);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    })();
  }, []);

  // Handlers
  const handleCreateBlog = useCallback(
    async (blog: Partial<Blog>) => {
      const { blogs } = state;
      try {
        const created = await createBlog(blog);
        if (created) {
          dispatch({ type: "SET_BLOGS", payload: [...blogs, created] });
          dispatch({ type: "SET_NEW_BLOG", payload: {} });
          dispatch({ type: "SET_CREATING_NEW", payload: false });
        }
      } catch (err) {
        console.error(err);
      }
    },
    [state]
  );

  const handleUpdateBlog = useCallback(
    async (blog: Blog) => {
      const { blogs } = state;
      if (!blog) return;
      try {
        console.log("Updating blog:", blog);
        const updated = await updateBlog(blog);
        if (updated) {
          dispatch({
            type: "SET_BLOGS",
            payload: blogs.map((b) => (b.id === updated.id ? updated : b)),
          });
          dispatch({ type: "SET_EDITING_BLOG", payload: null });
        }
      } catch (err) {
        console.error(err);
      }
    },
    [state]
  );

  const handleDeleteBlog = useCallback(
    async (id: string) => {
      try {
        const ok = await deleteBlog(id);
        if (ok) {
          dispatch({
            type: "SET_BLOGS",
            payload: state.blogs.filter((b) => b.id !== id),
          });
        }
      } catch (err) {
        console.error(err);
      }
    },
    [state.blogs]
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Blog
  ) => {
    const value = e.target.value;
    if (state.editingBlog) {
      dispatch({
        type: "SET_EDITING_BLOG",
        payload: { ...state.editingBlog, [field]: value },
      });
    } else {
      dispatch({
        type: "SET_NEW_BLOG",
        payload: { ...state.newBlog, [field]: value },
      });
    }
  };

  const handleEditBlog = (blog: Blog) => {
    dispatch({ type: "SET_EDITING_BLOG", payload: blog });
    dispatch({ type: "SET_CREATING_NEW", payload: false });
  };

  const handleCreateNew = () => {
    dispatch({ type: "SET_EDITING_BLOG", payload: null });
    dispatch({ type: "SET_CREATING_NEW", payload: true });
  };

  const handleBack = () => {
    dispatch({ type: "SET_EDITING_BLOG", payload: null });
    dispatch({ type: "SET_CREATING_NEW", payload: false });
  };

  // Memoize context value
  const value = useMemo(
    () => ({
      ...state,
      handleCreateBlog,
      handleUpdateBlog,
      handleDeleteBlog,
      handleInputChange,
      handleEditBlog,
      handleCreateNew,
      handleBack,
      setActiveTab: (tab: string) =>
        dispatch({ type: "SET_ACTIVE_TAB", payload: tab }),
    }),
    [state, handleCreateBlog, handleUpdateBlog, handleDeleteBlog]
  );

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};
