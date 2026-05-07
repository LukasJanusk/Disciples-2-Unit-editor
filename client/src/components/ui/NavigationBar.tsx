import { AppRoute } from "@/routes";
import { Link } from "react-router";

export default function NavigationBar() {
  return (
    <nav className="flex text-white text-xl items-center justify-center  p-4 bg-gray-800">
      <Link to={AppRoute.Home} className="mx-4 hover:text-gray-300 duration-300 hover:scale-105 p-4 bg-gray-800 hover:bg-gray-700 rounded">
        Home
      </Link>
      <Link to={AppRoute.Units} className="mx-4 hover:text-gray-300 duration-300 hover:scale-105 p-4 bg-gray-800 hover:bg-gray-700 rounded">
        Units
      </Link>
      <Link to={AppRoute.UnitData} className="mx-4 hover:text-gray-300 duration-300 hover:scale-105 p-4 bg-gray-800 hover:bg-gray-700 rounded">
        Units Raw Data
      </Link>
    </nav>
  );
}
