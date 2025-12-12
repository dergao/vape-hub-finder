import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import vitePrerender from "vite-plugin-prerender";

// Define routes to prerender for SEO
// Cities
const cities = [
  "los-angeles",
  "new-york",
  "miami",
  "chicago",
  "houston",
  "phoenix",
  "denver",
  "seattle",
];

// Stores (add your store slugs here)
const stores: Record<string, string[]> = {
  "los-angeles": [
    "cloud-9-vape-lounge",
    "vapor-paradise",
    "vape-city-dtla",
    "the-vape-spot-santa-monica",
    "elite-vapes-beverly-hills",
  ],
};

// Generate all routes to prerender
const prerenderRoutes = [
  "/",
  "/us",
  ...cities.map((city) => `/us/${city}`),
  ...Object.entries(stores).flatMap(([city, storeList]) =>
    storeList.map((store) => `/us/${city}/${store}`)
  ),
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" &&
      vitePrerender({
        staticDir: path.join(__dirname, "dist"),
        routes: prerenderRoutes,
        renderer: new vitePrerender.PuppeteerRenderer({
          // Wait for React to finish rendering
          renderAfterDocumentEvent: "prerender-ready",
          // Or wait for a specific element
          // renderAfterElementExists: '#root',
          // Or wait for a timeout (fallback)
          renderAfterTime: 5000,
          // Skip third-party requests for faster rendering
          skipThirdPartyRequests: true,
        }),
        postProcess(renderedRoute) {
          // Add prerender meta tag
          renderedRoute.html = renderedRoute.html.replace(
            "</head>",
            '<meta name="prerender-status-code" content="200"></head>'
          );
          return renderedRoute;
        },
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
