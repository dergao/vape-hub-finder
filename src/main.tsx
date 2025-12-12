import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Signal to prerenderer that the page is ready
// This is used by vite-plugin-prerender to know when React has finished rendering
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    // Dispatch event after React has hydrated
    setTimeout(() => {
      document.dispatchEvent(new Event("prerender-ready"));
    }, 100);
  });
}
