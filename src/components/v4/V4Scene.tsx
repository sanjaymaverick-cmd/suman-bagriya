import { type ReactNode, useEffect, useState } from "react";

export function V4Scene({
  index,
  title,
  children,
  first = false,
}: {
  index: number;
  title: string;
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <div
      data-v4-scene
      data-scene-index={index}
      data-scene-title={title}
      className={`v4-scene-shell ${first ? "v4-scene-first" : ""}`}
    >
      <div className="v4-scene-face">{children}</div>
      {!first && <div className="v4-scene-seam" aria-hidden="true" />}
    </div>
  );
}

export function V4SceneHud({ count }: { count: number }) {
  const [active, setActive] = useState(1);
  const [title, setTitle] = useState("Opening");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-v4-scene]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const element = visible.target as HTMLElement;
        setActive(Number(element.dataset.sceneIndex ?? 1));
        setTitle(element.dataset.sceneTitle ?? "Scene");
      },
      { threshold: [0.22, 0.45, 0.7] },
    );
    scenes.forEach((scene) => observer.observe(scene));

    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-6 sm:justify-start sm:px-8">
      <div className="flex min-w-[220px] items-center gap-3 rounded-full border border-white/15 bg-[#171310]/78 px-4 py-2.5 text-white shadow-2xl backdrop-blur-xl">
        <span className="font-mono text-[9px] tracking-[0.16em] text-white/55">
          {String(active).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <span className="h-px flex-1 overflow-hidden bg-white/15">
          <span className="block h-full origin-left bg-[#d88c7b]" style={{ transform: `scaleX(${progress})` }} />
        </span>
        <span className="max-w-[90px] truncate text-[9px] tracking-[0.15em] uppercase text-white/72">{title}</span>
      </div>
    </div>
  );
}
