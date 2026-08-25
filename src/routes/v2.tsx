import { createFileRoute } from "@tanstack/react-router";
import V2Nav from "@/components/v2/V2Nav";
import V2Hero from "@/components/v2/V2Hero";
import { About, System, Saath, Business, Faq, Connect, Footer } from "@/components/v2/V2Sections";

export const Route = createFileRoute("/v2")({
  component: V2Page,
  head: () => ({
    meta: [
      { title: "Suman Bagriya — V2" },
      {
        name: "description",
        content:
          "Suman Bagriya — a drag-to-explore canvas exploration, in the spirit of personaal.studio.",
      },
    ],
  }),
});

function V2Page() {
  return (
    <main className="bg-[#050505] text-[#f3ede2]">
      <V2Nav />
      <V2Hero />
      <About />
      <System />
      <Saath />
      <Business />
      <Faq />
      <Connect />
      <Footer />
    </main>
  );
}
