import { createFileRoute } from "@tanstack/react-router";
import V3Nav from "@/components/v3/V3Nav";
import V3Hero from "@/components/v3/V3Hero";
import {
  Ticker,
  Offerings,
  ResultsStrip,
  SaathBlock,
  ClosingCTA,
  Footer,
} from "@/components/v3/V3Sections";

export const Route = createFileRoute("/v3")({
  component: V3Page,
  head: () => ({
    meta: [
      { title: "Suman Bagriya — V3" },
      {
        name: "description",
        content:
          "Suman Bagriya — an editorial dark-serif design exploration, in the spirit of enricodeiana.design.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,400..600&display=swap",
      },
    ],
  }),
});

function V3Page() {
  return (
    <main id="main" className="bg-[#0c0b0a]">
      <V3Nav />
      <V3Hero />
      <Ticker />
      <Offerings />
      <ResultsStrip />
      <SaathBlock />
      <ClosingCTA />
      <Footer />
    </main>
  );
}
