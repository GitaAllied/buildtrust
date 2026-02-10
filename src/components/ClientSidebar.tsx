import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Logo from "../assets/Logo.png";
import {
  FaBriefcase,
  FaDoorOpen,
  FaFileContract,
  FaGear,
  FaMessage,
  FaMoneyBill,
  FaUser,
  FaUserGear,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openClientSidebar, openSignoutModal } from "@/redux/action";

const ClientSidebar = ({active}) => {
  const [activeTab, setActiveTab] = useState(active);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const dispatch = useDispatch()
  const isOpen = useSelector((state: any) => state.sidebar.clientSidebar)
  const signOutModal = useSelector((state:any) => state.signout)

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        navigate("/client-dashboard");
        break;
      case "projects":
        navigate("/projects");
        break;
      case "payments":
        navigate("/payments");
        break;
      case "messages":
        navigate("/messages");
        break;
      case "contracts":
        navigate("/contracts");
        break;
      case "saved":
        navigate("/saved-developers");
        break;
      case "settings":
        navigate("/settings");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        navigate("/browse");
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaUser />, active: true },
    { id: "projects", label: "Projects", icon: <FaBriefcase /> },
    { id: "payments", label: "Payments", icon: <FaMoneyBill /> },
    { id: "messages", label: "Messages", icon: <FaMessage /> },
    { id: "contracts", label: "Contracts", icon: <FaFileContract /> },
    { id: "saved", label: "Saved Developers", icon: <FaUserGear /> },
    { id: "settings", label: "Settings", icon: <FaGear /> },
  ];

  return (
    <div
      className={`${
        isOpen ? "block w-full" : "hidden"
      } md:block md:w-64 bg-white/95 backdrop-blur-sm shadow-lg md:shadow-sm border-r border-white/20 fixed top-14 md:top-0 left-0 h-[calc(100vh-56px)] md:h-screen z-40 md:z-auto overflow-y-auto`}
    >
      <div className=" h-full flex flex-col justify-start md:justify-between">
        <div>
          {/* logo */}
          <div className="p-4 sm:pb-2 sm:p-6 hidden md:block">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity w-full"
            >
              <Link to={"/"}>
                <img src={Logo} alt="" className="w-[55%]" />
              </Link>
            </button>
          </div>
          {/* nav links */}
          <nav className="p-3 sm:p-4 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleNavigation(item.id);
                  dispatch(openClientSidebar(false));
                }}
                className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-md sm:rounded-xl mb-1 transition-all text-sm sm:text-sm font-medium flex gap-2 items-center ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-[#226F75]/10 to-[#253E44]/10 text-[#226F75] border-[#226F75]"
                    : "text-gray-600 hover:bg-[#226F75]/5 hover:text-[#226F75]"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        {/* Signout Button */}
        <div className="p-3 sm:p-4">
          <button
            onClick={() => {
              dispatch(openSignoutModal(true));
            }}
            className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-md sm:rounded-xl mb-1 transition-all text-sm sm:text-sm font-medium flex gap-2 items-center text-red-500"
          >
            <FaDoorOpen />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientSidebar;
