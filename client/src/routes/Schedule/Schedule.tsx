import type { IconType } from "react-icons";
import { GiLinkedRings } from "react-icons/gi";
import {
  MdCelebration,
  MdDirectionsCar,
  MdMusicNote,
  MdOutlineCameraAlt,
  MdRestaurant,
  MdVideogameAsset,
} from "react-icons/md";

const scheduleItems = [
  {
    time: "2:00pm",
    title: "Welcome drinks/bites",
    Icon: MdCelebration,
    description: "Grab a drink, a bite, and settle in with everyone before we begin.",
  },
  {
    time: "3:00pm",
    title: "Ceremony Start",
    Icon: GiLinkedRings,
    description: "The main event begins — find your seat and get ready for happy tears.",
  },
  {
    time: "3:30pm",
    title: "Cocktail Hour/Photos",
    Icon: MdOutlineCameraAlt,
    description: "Celebrate, mingle, and snap photos while we transition to dinner.",
  },
  {
    time: "4:00pm",
    title: "Dinner time",
    Icon: MdRestaurant,
    description: "Take your seat and enjoy dinner with family and friends.",
  },
  {
    time: "5:00pm",
    title: "Games/Social Activities",
    Icon: MdVideogameAsset,
    description: "Smash Tournament and Kahoot for potential prizes"
  },
  {
    time: "6:00pm",
    title: "Dance!",
    Icon: MdMusicNote,
    description: "Shoes optional, dancing encouraged. Let’s make the floor shake.",
  },
  {
    time: "9:00pm",
    title: "GO HOME (or help clean up)",
    Icon: MdDirectionsCar,
    description: "Safe travels home — or stay and be one of our cleanup heroes.",
  },
] satisfies Array<{
  time: string;
  title: string;
  description: string;
  Icon: IconType;
}>;

const Schedule = () => {
  return (
    <div className="relative isolate overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex rounded-full border border-secondary/60 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-textcolor backdrop-blur">
            Wedding Day Timeline
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-textcolor sm:text-5xl">
            Schedule
          </h1>
          <p className="mt-3 text-sm text-textcolor/70 sm:text-base">Times are subject to change</p>
        </div>

        <div className="relative mt-10 sm:mt-14">
          <div
            className="absolute left-5 top-0 bottom-0 w-px bg-linear-to-b from-secondary via-primary/60 to-secondary sm:left-1/2 sm:-translate-x-1/2"
            aria-hidden="true"
          />

          <ul className="space-y-8 sm:space-y-10">
            {scheduleItems.map(({ time, title, description, Icon }, index) => {
              const isLeft = index % 2 === 0;

              return (
                <li key={`${time}-${title}`} className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-10">
                  <div
                    className={[
                      "absolute top-6 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background shadow-sm",
                      "left-3.25 sm:left-1/2 sm:-translate-x-1/2",
                    ].join(" ")}
                    aria-hidden="true"
                  />

                  <div
                    className={[
                      "ml-12 rounded-2xl border border-secondary/35 bg-white/80 p-5 text-left shadow-[0_10px_30px_-12px_rgba(85,120,94,0.3)] backdrop-blur sm:ml-0 sm:p-6",
                      isLeft ? "sm:mr-8" : "sm:order-2 sm:ml-8",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "mb-2 inline-flex rounded-full bg-white-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-textcolor",
                      ].join(" ")}
                    >
                      {time}
                    </div>
                    <h2 className="text-xl font-semibold text-textcolor">{title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-textcolor/80">{description}</p>
                    <div className="mt-4 rounded-xl bg-linear-to-br from-white-accent/80 to-background p-4">
                      <Icon className="h-12 w-12 text-primary" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="hidden sm:block" aria-hidden="true" />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
