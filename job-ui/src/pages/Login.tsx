import AuthForm from "../components/forms/AuthForm";
import Image from "../../public/assests/Singup-signIn_bg_1.jpg";
import { motion } from "framer-motion";

const Login = () => (
  <div
    className="w-full bg-cover bg-center flex items-start justify-start "
    style={{
      backgroundImage: `url(${Image})`,
    }}
  >
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className=" backdrop-blur-lg p-3 md:p-8 rounded-xl shadow-xl   overflow-hidden"
    >
      <AuthForm redirectToHome />
    </motion.div>
  </div>
);

export default Login;
