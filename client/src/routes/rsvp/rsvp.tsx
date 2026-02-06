import { useState } from "react";
import LockScreen from "./LockScreen";
import UserSearch from "./UserSearch";

const RSVP = () => {
  const [locked, setLocked] = useState(true);
  const unlock = () => {
    setLocked(false);
  };

  return (
    <div className="mx-auto">
      {locked ? (
        <LockScreen unlock={unlock}/>
      ) : (
       <UserSearch /> 
      )}

      <div></div>
    </div>
  );
};

export default RSVP;
