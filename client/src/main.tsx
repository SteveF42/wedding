import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import "./index.css";
import { Theme } from "@radix-ui/themes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme appearance="inherit" accentColor="gray" grayColor="gray" panelBackground="solid">
      <App />
    </Theme>
  </StrictMode>,
);
