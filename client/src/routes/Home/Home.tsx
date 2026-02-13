import { useEffect, useState } from "react";

const Home = () => {
  const [isPoop, setIsPoop] = useState(false);

  useEffect(() => {
    const num = Math.floor(Math.random() * 20000);
    if (num == 1) {
      const loadPoop = new Image();
      loadPoop.src = "./poop.jpg";
      loadPoop.onload = () => {
        setIsPoop(true);
        setTimeout(() => setIsPoop(false), 600);
      };
    }
  }, []);

  return (
    <div className="relative w-full">
      <div id="main-img" className="w-full">
        <img src={isPoop ? "./poop.jpg" : "./Home.jpg"} className="aspect-video object-cover w-full max-h-[620px] grayscale-75" />
      </div>

      <div id="footer" className="mx-auto flex flex-col sm:text-xl text-center w-full mt-4">
        <h1>Join us</h1>
        <h1>August 8th 2026</h1>
        <h1>41303 Valley of the Falls Dr, Forest Falls, CA 92339</h1>
      </div>
    </div>
  );
};

export default Home;
