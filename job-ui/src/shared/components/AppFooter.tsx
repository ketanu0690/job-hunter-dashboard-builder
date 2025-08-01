import { useTheme } from "../utils/use-theme";

const AppFooter = () => {
  const {theme} = useTheme();
  return (
    <footer
      className={`mt-20 py-12 ${theme === "dark" ? "bg-gray-900" : "bg-slate-900"} text-white`}
    >
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-slate-400">
          © 2025 Ketan Upadhyay . The perfect blend of design and
          functionality.
        </p>
      </div>
    </footer>
  );
};

export default AppFooter;
