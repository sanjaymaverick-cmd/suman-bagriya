import { useEffect, useState } from "react";
import * as THREE from "three";

export function isCoarsePointer() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

export function gpuBudget() {
  const mobile = isCoarsePointer();
  return {
    maxDim: mobile ? 512 : 768,
    maxPlanes: mobile ? 20 : 36,
    maxTextures: mobile ? 24 : 40,
    anisotropy: mobile ? 1 : 4,
  };
}

function downscale(source: CanvasImageSource, w: number, h: number, maxDim: number) {
  const scale = Math.min(1, maxDim / Math.max(w, h));
  const cw = Math.max(1, Math.round(w * scale));
  const ch = Math.max(1, Math.round(h * scale));
  if (cw === w && ch === h && source instanceof HTMLCanvasElement) return source;
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.drawImage(source, 0, 0, cw, ch);
  return canvas;
}

type Entry = { tex: THREE.Texture; refs: number; last: number };

class TextureMemory {
  private map = new Map<string, Entry>();
  private inflight = new Map<string, Promise<THREE.Texture>>();

  acquire(url: string) {
    const hit = this.map.get(url);
    if (hit) {
      hit.refs += 1;
      hit.last = performance.now();
      return Promise.resolve(hit.tex);
    }
    const pending = this.inflight.get(url);
    if (pending) {
      return pending.then((tex) => {
        const e = this.map.get(url);
        if (e) {
          e.refs += 1;
          e.last = performance.now();
        }
        return tex;
      });
    }
    const job = this.load(url);
    this.inflight.set(url, job);
    return job;
  }

  private async load(url: string) {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error(`texture ${url}`));
      i.src = url;
    });
    const { maxDim, anisotropy, maxTextures } = gpuBudget();
    this.evict(maxTextures - 1);
    const canvas = downscale(img, img.naturalWidth || img.width, img.naturalHeight || img.height, maxDim);
    const tex = new THREE.Texture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.anisotropy = anisotropy;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    this.map.set(url, { tex, refs: 1, last: performance.now() });
    this.inflight.delete(url);
    return tex;
  }

  release(url: string) {
    const hit = this.map.get(url);
    if (!hit) return;
    hit.refs = Math.max(0, hit.refs - 1);
    hit.last = performance.now();
  }

  evict(keep: number) {
    if (this.map.size <= keep) return;
    const idle = [...this.map.entries()]
      .filter(([, v]) => v.refs <= 0)
      .sort((a, b) => a[1].last - b[1].last);
    for (const [url, v] of idle) {
      if (this.map.size <= keep) break;
      v.tex.dispose();
      this.map.delete(url);
    }
  }

  stats() {
    return { textures: this.map.size, refs: [...this.map.values()].reduce((n, v) => n + v.refs, 0) };
  }
}

export const textureMemory = new TextureMemory();

export function useManagedTexture(url: string) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let live = true;
    textureMemory.acquire(url).then((t) => {
      if (live) setTex(t);
    });
    return () => {
      live = false;
      textureMemory.release(url);
    };
  }, [url]);
  return tex;
}
