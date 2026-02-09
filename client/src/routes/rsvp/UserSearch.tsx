  import { useState } from "react";

  const UserSearch = () => {
    const [users, setUsers] = useState<any>({});
    const [searchableUser, setSearchableUser] = useState("");

    const searchUsers = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // TODO: implement search logic
      const res = await fetch(`/api/v1/rsvp?user=${searchableUser}`);
      const json = await res.json()
      setUsers(json);
    };

    return (
      <>
        <form className="flex flex-col max-w-lg mx-auto gap-y-2" onSubmit={searchUsers}>
          <h1 className="text-2xl">Please Type Name to RSVP</h1>

          <input
            title="Search"
            placeholder="RSVP name"
            className="border border-solid rounded-md p-1"
            onChange={(e) => setSearchableUser(e.target.value)}
          />
          <button className="border rounded-md p-2 hover:bg-secondary cursor-pointer">Search</button>
          <div></div>
        {Object.keys(users || {}).length > 0 && (
          <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">{JSON.stringify(users, null, 2)}</pre>
        )}
        </form>
      </>
    );
  };

  export default UserSearch;
