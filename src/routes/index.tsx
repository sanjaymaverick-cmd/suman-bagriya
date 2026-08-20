import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import SiteSections from "@/components/site/SiteSections";
import PageGrid from "@/components/site/PageGrid";

const K95Scene = lazy(() => import("@/components/k95/K95Scene"));

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <main className="relative bg-paper">
      <div className="grain" aria-hidden="true" />
      <PageGrid />
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
