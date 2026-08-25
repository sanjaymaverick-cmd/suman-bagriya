import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import SiteSections from "@/components/site/SiteSections";
import PageGrid from "@/components/site/PageGrid";
import SiteNav from "@/components/site/SiteNav";

const K95Scene = lazy(() => import("@/components/k95/K95Scene"));

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <main id="main" className="relative bg-paper">
      {/* The visible hero line lives inside the WebGL scene, so the document had no
          top-level heading for screen readers or search engines to anchor on. */}
      <h1 className="sr-only">
        Suman Bagriya — metabolic health coach. Lose weight and reclaim your energy without dieting
        or calorie counting.
      </h1>
      <div className="grain" aria-hidden="true" />
      <PageGrid />
      <SiteNav />
      {ready ? (
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center bg-paper font-mono text-[12px] tracking-[0.2em] text-muted">
              LOADING
            </div>
          }
        >
          <K95Scene />
        </Suspense>
      ) : (
        <div className="h-screen bg-paper" />
      )}
      <SiteSections />
    </main>
  );
}
