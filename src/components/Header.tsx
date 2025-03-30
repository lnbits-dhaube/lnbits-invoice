import { useAuth } from "@/context/AuthContext";
import { FaBell, FaUserCircle } from "react-icons/fa";

export default function Header() {
  const { username } = useAuth();

  return (
    <div className="flex justify-between items-center bg-white shadow p-4 rounded-lg ml-12 md:ml-0">
      <h2 className="text-md md:text-lg font-bold">Welcome! {username}</h2>
      <div className="flex space-x-4">
        <FaBell className="text-gray-600 text-xl cursor-pointer" />
        <FaUserCircle className="text-gray-600 text-xl cursor-pointer" />
      </div>
    </div>
  );
}
