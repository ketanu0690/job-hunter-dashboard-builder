import AuthForm from "../components/forms/AuthForm";

const Login = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="max-w-lg w-full p-8 bg-white dark:bg-gray-800 rounded shadow text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to TechJobTracker</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Sign in or sign up to access your dashboard.
      </p>
      <AuthForm redirectToHome />
    </div>
  </div>
);

export default Login;
