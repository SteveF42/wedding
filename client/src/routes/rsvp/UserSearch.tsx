import React from "react";

const UserSearch = () => {
  return (
    <div className="flex flex-col max-w-lg mx-auto gap-y-2">
      <h1 className="text-2xl">Please Type Name to RSVP</h1>
      <input title="Search" placeholder="RSVP name" className="border border-solid rounded-md p-1" />
      <button className="border rounded-md p-2 hover:bg-secondary cursor-pointer">Search</button>
      <div>
        
      </div>
    </div>
  );
};

export default UserSearch;
