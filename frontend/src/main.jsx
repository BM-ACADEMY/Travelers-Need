import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import AdminModule from "./modules/admin/AdminModule.jsx";
// import { ModalProvider } from "./hooks/ModelContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
<App/>
    {/* <AdminModule/>  */}
  </StrictMode>
);
