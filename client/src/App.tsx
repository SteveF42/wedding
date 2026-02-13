import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./routes/Home";
import Header from "./components/Header/Header";
import RSVP from "./routes/rsvp";
import Photos from "./routes/Photos";
import Registry from "./routes/Registry";
import Schedule from "./routes/Schedule";
import WeddingParty from "./routes/WeddingParty";
import FAQ from "./routes/FAQ";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
      },
      {
        path: "/rsvp",
        element: <RSVP />,
      },
      {
        path: "/photos",
        element: <Photos />,
      },
      {
        path: "/registry",
        element: <Registry />,
      },
      {
        path: "/schedule",
        element: <Schedule />,
      },
      {
        path: "/party",
        element: <WeddingParty />,
      },
      {
        path: "/faq",
        element: <FAQ />
      }
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
