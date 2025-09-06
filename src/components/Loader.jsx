import React from "react";

const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-10">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-cyan-400 border-l-cyan-400 animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-b-purple-500 border-r-purple-500 animate-[spin_2s_linear_infinite_reverse]"></div>
        </div>
        <p className="text-cyan-200 text-sm tracking-wide">{label}</p>
      </div>
    </div>
  );
};

export default Loader;
