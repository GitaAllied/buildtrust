import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import Logo from "../assets/Logo.png";
import {
  FaBook,
  FaDoorOpen,
  FaGear,
  FaHandshake,
  FaMessage,
  FaUser,
  FaUsers,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";
import { useDispatch, useSelector } from "react-redux";
import { openAdminSidebar, openSignoutModal } from "@/redux/action";
import { Badge } from "@/components/ui/badge";

const AdminSidebar = ({active}) => {
    const [activeTab, setActiveTab] = useState(active);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const dispatch = useDispatch()
  const isOpen = useSelector((state:any) => state.sidebar.adminSidebar)
  
  // Notification counts state
  const [notificationCounts, setNotificationCounts] = useState({
    projects: 0,
    messages: 0,
    support: 5,
  });

  // Fetch and count open projects
  useEffect(() => {
    const fetchOpenProjectsCount = async () => {
      try {
        const response = await apiClient.getAllProjects();
        const projectsArray = Array.isArray(response) ? response : response?.projects || [];
        
        // Count projects with status "open"
        const openProjectsCount = projectsArray.filter(
          (p: any) => p.status === 'open'
        ).length;
        
        setNotificationCounts(prev => ({
          ...prev,
          projects: openProjectsCount
        }));
      } catch (error) {
        console.error('Error fetching projects count:', error);
      }
    };

    fetchOpenProjectsCount();
  }, []);

  // Fetch and count unread messages
  useEffect(() => {
    const fetchUnreadMessagesCount = async () => {
      try {
        const response = await apiClient.getUnreadMessageCount();
        const unreadCount = response?.unread_count || 0;
        
        setNotificationCounts(prev => ({
          ...prev,
          messages: unreadCount
        }));
      } catch (error) {
        console.error('Error fetching unread messages count:', error);
      }
    };

    fetchUnreadMessagesCount();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaUser />, active: true },
    { id: "users", label: "User Management", icon: <FaUsers /> },
    { id: "projects", label: "Projects", icon: <FaHandshake />, count: notificationCounts.projects },
    { id: "contracts", label: "Contracts", icon: <FaBook /> },
    { id: "developers", label: "Developers", icon: <FaUser /> },
    { id: "messages", label: "Messages", icon: <FaMessage />, count: notificationCounts.messages },
    { id: "reports", label: "Reports", icon: <FaBook /> },
    { id: "settings", label: "Settings", icon: <FaGear /> },
    { id: "support", label: "Support", icon: <FaHandshake />, count: notificationCounts.support },
  ];

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        navigate("/super-admin-dashboard")
        break;
      case "users":
        navigate("/admin/users");
        break;
      case "projects":
        setActiveTab(itemId);
        navigate("/admin/projects");
        // Clear projects count when admin views projects
        setNotificationCounts(prev => ({ ...prev, projects: 0 }));
        break;
      case "contracts":
        navigate("/admin/contracts");
        break;
      case "developers":
        navigate("/admin/developers");
        break;
      case "messages":
        setActiveTab(itemId);
        navigate("/admin/messages");
        // Clear messages count when admin views messages
        setNotificationCounts(prev => ({ ...prev, messages: 0 }));
        break;
      case "reports":
        navigate("/admin/reports");
        break;
      case "settings":
        navigate("/admin/settings");
        break;
      case "support":
        setActiveTab(itemId);
        navigate("/admin/support");
        // Clear support count when admin views support
        setNotificationCounts(prev => ({ ...prev, support: 0 }));
        break;
      case "logout":
        handleLogout();
        break;
      default:
        navigate("/super-admin-dashboard");
    }
  };
  return (
    <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:block md:w-64 bg-white/95 backdrop-blur-sm shadow-lg md:shadow-sm border-r border-white/20 fixed top-14 md:top-0 left-0 right-0 h-[calc(100vh-56px)] md:h-screen z-40 md:z-auto overflow-y-auto`}
      >
        <div className=" h-full flex flex-col justify-start md:justify-between">
          <div>
            {/* logo */}
            <div className="p-4 pb-0 sm:pb-0 sm:p-6 hidden md:block">
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
            <nav className="p-3 pb-0 sm:p-4 sm:pb-0 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavigation(item.id);
                    dispatch(openAdminSidebar(false))
                  }}
                  className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-md sm:rounded-xl mb-1 transition-all text-sm sm:text-sm font-medium flex gap-2 items-center justify-between relative group ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-[#226F75]/10 to-[#253E44]/10 text-[#226F75] border-[#226F75]"
                      : "text-gray-600 hover:bg-[#226F75]/5 hover:text-[#226F75]"
                  }`}
                >
                  <span className="flex gap-2 items-center">
                    {item.icon}
                    {item.label}
                  </span>
                  {item.count > 0 && (
                    <Badge className="h-5 w-5 rounded-full bg-red-500 hover:bg-red-600 text-xs p-0 flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0">
                      {item.count > 99 ? "99+" : item.count}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>
          {/* Signout Button */}
          <div className="p-3 sm:p-4 pb-0 sm:pb-0">
            <button
              onClick={() => {
                dispatch(openSignoutModal(true))
              }}
              className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-md sm:rounded-xl mb-1 transition-all text-sm sm:text-sm font-medium flex gap-2 items-center text-red-500"
            >
              <FaDoorOpen />
              Sign Out
            </button>
          </div>
        </div>
      </div>
  )
}

export default AdminSidebar