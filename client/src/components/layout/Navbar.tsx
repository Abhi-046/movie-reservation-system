
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-gray-900 p-4 text-white">
      <h1 className="text-2xl font-bold">CineBook</h1>

      <div className="flex gap-6">
        <Link to="/">Home</Link>
        <Link to="/movies">Movies</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;

