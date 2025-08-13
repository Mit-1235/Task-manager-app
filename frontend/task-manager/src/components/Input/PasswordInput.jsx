import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center bg-transparent border border-gray-300 rounded-lg px-5 mb-3  ">
      <input
        value={value}
        onChange={onChange}
        className="w-full h-12 text-sm bg-transparent py-3 mr-3 rounded-lg outline-none  "
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        
      />

      {isShowPassword ? (
        <FaRegEye
          size={22}
          className="text-[#2B85FF] cursor-pointer"
          onClick={() => toggleShowPassword()}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-slate-400 cursor-pointer"
          onClick={() => toggleShowPassword()}
        />
      )}
    </div>
  );
};

export default PasswordInput;
