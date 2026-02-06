import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./routes/Home";
import Header from "./components/Header/Header";
import RSVP from "./routes/rsvp";
import Photos from "./routes/photos";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Header />,
    children: [
      {
        path:"/",
        index: true,
        element: <Home />,
      },
      {
        path: "/rsvp",
        element: <RSVP />
      },
      {
        path: "/photos",
        element: <Photos />
      }
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
