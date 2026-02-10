import React from "react";
import { Card } from "./card";
import { FaDoorOpen } from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { UseSelector, useDispatch, useSelector } from "react-redux";
import { openSignoutModal } from "@/redux/action";

interface SignoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const signoutModal = ({ isOpen, onClose }: SignoutModalProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const active = useSelector((state:any) => state.signout)

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="w-screen h-screen fixed top-0 left-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose} // Close when clicking backdrop
    >
      <Card
        className="w-[90%] md:w-[30%] p-8 md:p-10 space-y-3 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside card
      >
        <div className="rounded-full p-2 bg-[#253E44]/10 text-[#253E44] w-fit">
          <FaDoorOpen />
        </div>
        <div>
          <h1 className="font-bold md:text-xl">
            Are you sure you want to sign out?
          </h1>
          <p className="text-xs text-gray-500">
            You will need to sign back in to access your projects and contracts.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full text-sm">
          <button
            className="bg-[#253E44] w-full md:w-[48%] rounded-full p-2.5 font-semibold text-white hover:bg-opacity-80"
            onClick={handleLogout}
          >
            Sign out
          </button>
          <button
            className="border border-[#253E44] w-full md:w-[48%] rounded-full p-2.5 font-semibold hover:bg-[#253E44]/80 hover:border-opacity-80 hover:text-white"
            onClick={onClose} // Use onClose prop instead of local state
          >
            Cancel
          </button>
        </div>
      </Card>
    </div>
  );
};

export default signoutModal;
