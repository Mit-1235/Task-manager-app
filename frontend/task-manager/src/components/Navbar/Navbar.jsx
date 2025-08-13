import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
// import SearchBar from "../SearchBar/SearchBar";

// const Navbar = ({ userInfo, onSearchTask, handleClearSearch }) => {
const Navbar = ({ userInfo }) => {
  // const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // const handleSearch = () => {
  //   if (searchQuery) {
  //     onSearchTask(searchQuery);
  //   }
  // };

  // const onClearSearch = () => {
  //   setSearchQuery("");
  //   handleClearSearch();
  // };

  return (
    <div className="bg-white drop-shadow px-4 py-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black">Task Manager</h2>

        <div>
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
