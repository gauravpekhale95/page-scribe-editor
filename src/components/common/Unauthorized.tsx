import React from "react";

export interface UnauthorizedProps {
  type: boolean;
}

const Unauthorized: React.FC<UnauthorizedProps> = ({ type }) => {
  return (
    <div className="text-center p-12 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-4xl text-[#496DAF]">Oops! This page has expired!</h1>
      <p className="text-xl text-gray-800 mt-6">
        Please log back into{" "}
        {type ? "Document AI Chrome Extension" : "Task Center"} to resume.
      </p>
      {/* <p className="text-lg text-gray-600 mt-4">
        You're not allowed to access this page. Maybe you need to log in, or
        maybe the internet-gods just don't want you here today. 😅
      </p> */}
    </div>
  );
};

export default Unauthorized;