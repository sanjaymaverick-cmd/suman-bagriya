import { createFileRoute } from "@tanstack/react-router";
import V5Studio from "@/components/v5/V5Studio";

export const Route = createFileRoute("/v5")({
  component: V5Page,
  head: () => ({
    meta: [
      { title: "Suman Bagriya — V5 Energy Universe" },
      { name: "description", content: "A joyful, immersive wellness ritual guided by Suman Bagriya." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Unbounded:wght@600;700;800;900&display=swap" },
    ],
  }),
});

function V5Page() { return <V5Studio />; }
