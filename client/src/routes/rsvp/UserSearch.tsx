import { useState } from "react";
import { useWindowSize } from "react-use";
import ListUsers from "./ListUsers";
import type { UserInterface } from "./rsvp.types";
import ReactConfetti from "react-confetti";

type Users = {
  groupId: number;
  members: UserInterface[];
};

const UserSearch = () => {
  const [users, setUsers] = useState<Users | undefined>();
  const [searchableUser, setSearchableUser] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: implement search logic
    setLoading(true);
    const res = await fetch(`/api/v1/rsvp?user=${searchableUser}`);
    if (res.status === 404) {
      setLoading(false);
      setUsers(undefined);
      return;
    }

    const json = await res.json();
    console.log(json);
    setUsers(json);
    setLoading(false);
  };

  const { height, width } = useWindowSize();
  if (isSubmitted) {
    return (
      <>
        <ReactConfetti width={width} height={height} tweenDuration={2000} gravity={0.3} recycle={false} numberOfPieces={1000} />
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-800">Thank You!</h1>
            <p className="text-xl text-gray-600">Your reservation has been received.</p>
            <p className="text-gray-500">We look forward to celebrating with you!</p>
          </div>
          <div className="text-6xl">🎉</div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col max-w-lg mx-auto gap-y-2 p-4" id="user-search">
      <h1 className="text-3xl text-center">RSVP</h1>
      <hr />
      <p className="text-center mt-8">Please enter the first and last name of one member from your party below </p>

      <form className="w-full flex gap-x-2" onSubmit={searchUsers}>
        <input
          title="Search"
          placeholder="Ex. Christopher Espinosa"
          className="border border-solid rounded-md p-1 flex-2"
          onChange={(e) => setSearchableUser(e.target.value)}
        />
        <button className="border rounded-md p-2 hover:bg-secondary cursor-pointer">Search</button>
      </form>
      <div className="">
        {loading ? <div>Loading...</div> : <ListUsers setSubmitted={(val) => setIsSubmitted(val)} users={users?.members || []} />}
      </div>
    </div>
  );
};

export default UserSearch;
