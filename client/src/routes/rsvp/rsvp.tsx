import { useEffect, useState } from "react";
import LockScreen from "./LockScreen";
import UserSearch from "./UserSearch";

const RSVP = () => {
  const [locked, setLocked] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authorized on mount
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/v1/auth/check", {
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.authorized) {
            setLocked(false);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const unlock = () => {
    setLocked(false);
  };

  if (loading) {
    return (
      <div className="mx-auto flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

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
