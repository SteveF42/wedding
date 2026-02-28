import { useState } from "react";
import type { UserInterface } from "./rsvp.types";
import SwitchingButtons from "./SwitchingButtons";

type ListUserProps = {
  users: UserInterface[];
  setSubmitted: (submitted: boolean) => void;
};

type UserRsvpState = {
  id: number;
  rsvpStatus: "ACCEPTED" | "DECLINED";
  plusOneName?: string;
};

const ListUsers = ({ users, setSubmitted }: ListUserProps) => {
  if (!users || users.length === 0) return null;

  // Initialize state for each user
  const [userStates, setUserStates] = useState<UserRsvpState[]>(
    users.map((user) => ({
      id: user.id,
      rsvpStatus: user.rsvpStatus === "PENDING" ? "ACCEPTED" : (user.rsvpStatus as "ACCEPTED" | "DECLINED"),
      plusOneName: user.plusOne?.name || "",
    })),
  );
  
  const [dietaryRestrictions, setDietaryRestrictions] = useState(users?.[0].dietaryRestrictions || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateUserRsvp = (userId: number, status: "ACCEPTED" | "DECLINED") => {
    setUserStates((prev) => prev.map((state) => (state.id === userId ? { ...state, rsvpStatus: status } : state)));
  };

  const updatePlusOneName = (userId: number, name: string) => {
    setUserStates((prev) => prev.map((state) => (state.id === userId ? { ...state, plusOneName: name } : state)));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit RSVP updates for each user
      const updates = userStates.map(async (userState) => {
        const response = await fetch(`/api/v1/${userState.id}/rsvp`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rsvpStatus: userState.rsvpStatus,
            plusOneName: userState.plusOneName,
            dietaryRestrictions,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update RSVP for user ${userState.id}`);
        }

        return response.json();
      });

      await Promise.all(updates);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert("Failed to submit RSVP. Please try again.");
    }
  };

  return (
    <form className="space-y-8 mt-8" onSubmit={onSubmit}>
      <div className="flex flex-col items-center gap-y-2">
        {users.map((user) => {
          const userState = userStates.find((state) => state.id === user.id);
          if (!userState) return null;

          return (
            <div className="space-y-2 w-full" key={user.id}>
              <h1 className="text-2xl text-center">
                {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}{" "}
              </h1>
              <div className="">
                <SwitchingButtons value={userState.rsvpStatus} onChange={(status) => updateUserRsvp(user.id, status)} />
              </div>
              {user.canBringPlusOne && (
                <div className="">
                  <p>You have been allowed +1 guest. Please state their names below</p>
                  <input
                    className="w-full p-2 border rounded-md"
                    type="text"
                    placeholder="Jennifer Rivas"
                    value={userState.plusOneName || ""}
                    onChange={(e) => updatePlusOneName(user.id, e.target.value)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div>
        <h1>Please state your dietary restrictions.</h1>
        <textarea
          className="border border-black w-full rounded-md resize-none p-2"
          rows={4}
          value={dietaryRestrictions}
          onChange={(e) => setDietaryRestrictions(e.target.value)}></textarea>
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="border rounded-md p-2 hover:bg-secondary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ListUsers;
