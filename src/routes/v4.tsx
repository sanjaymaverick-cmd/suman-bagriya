import { createFileRoute } from "@tanstack/react-router";
import V4Nav from "@/components/v4/V4Nav";
import V4Hero from "@/components/v4/V4Hero";
import { V4Closing, V4Faq, V4Journey, V4Manifesto, V4Ritual, V4Saath, V4Stories, V4Suman } from "@/components/v4/V4Sections";
import { V4Scene, V4SceneHud, V4VelocityField } from "@/components/v4/V4Scene";
import V4CursorPhysics from "@/components/v4/V4CursorPhysics";

export const Route = createFileRoute("/v4")({
  component: V4Page,
  head: () => ({
    meta: [
      { title: "Suman Bagriya — V4 Metabolic Muse" },
      { name: "description", content: "A cinematic, modern metabolic wellness experience guided by Suman Bagriya." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap" },
    ],
  }),
});

function V4Page() {
  return (
    <main id="main" className="bg-[#f1ece4] font-['DM_Sans',sans-serif]">
      <V4Nav />
      <V4VelocityField />
      <V4CursorPhysics />
      <V4Scene index={1} title="Opening" first><V4Hero /></V4Scene>
      <V4Scene index={2} title="Manifesto"><V4Manifesto /></V4Scene>
      <V4Scene index={3} title="The ritual"><V4Ritual /></V4Scene>
      <V4Scene index={4} title="Stories"><V4Stories /></V4Scene>
      <V4Scene index={5} title="Suman"><V4Suman /></V4Scene>
      <V4Scene index={6} title="Saath"><V4Saath /></V4Scene>
      <V4Scene index={7} title="90 days"><V4Journey /></V4Scene>
      <V4Scene index={8} title="Questions"><V4Faq /></V4Scene>
      <V4Scene index={9} title="Begin"><V4Closing /></V4Scene>
      <V4SceneHud count={9} />
    </main>
  );
}
