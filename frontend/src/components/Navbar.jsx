import { useNavigate } from "react-router-dom";
import { FiMoon, FiSun } from "react-icons/fi";

export default function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 border-b">

      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 p-4">

        <h1 className="font-bold text-xl text-blue-600 dark:text-blue-300">
          🚀 Task Manager
        </h1>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg active:scale-95 transition"
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  );
}