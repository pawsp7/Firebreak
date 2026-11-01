"use client";

import { region } from "@/config/region";
import { communities } from "@/data/communities";
import { receptionCentres } from "@/data/reception";
import { frameAt } from "@/lib/spread";
import type { CommunityRisk, EscapeRoute, Situation } from "@/lib/types";
import {
  GeoJSONSource,
  Map as MapLibreMap,
  type MapLayerMouseEvent,
  NavigationControl,
  setWorkerUrl,
} from "maplibre-gl";
import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

// Next.js does not bundle MapLibre's module worker; serve it from /public.
if (typeof window !== "undefined") {
  setWorkerUrl("/maplibre-gl-worker.mjs");
}

type Props = {
  situation: Situation | null;
  hour: number;
  risks: CommunityRisk[];
  selectedId: string | null;
  routes: EscapeRoute[];
  reducedMotion: boolean;
  onSelect: (id: string) => void;
};

type FC = GeoJSON.FeatureCollection<GeoJSON.Geometry>;

function empty(): FC {
  return { type: "FeatureCollection", features: [] };
}

function windToward(fromDeg: number): number {
  return ((fromDeg + 180) % 360) * (Math.PI / 180);
}

export default function MapCanvas({
  situation,
  hour,
  risks,
  selectedId,
  routes,
  reducedMotion,
  onSelect,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const dataRef = useRef({ situation, hour, risks, selectedId, routes, reducedMotion });
  dataRef.current = { situation, hour, risks, selectedId, routes, reducedMotion };

  useEffect(() => {
    if (!rootRef.current || mapRef.current) return;
    const map = new MapLibreMap({
      container: rootRef.current,
      style: region.mapStyle,
      center: [region.center.lon, region.center.lat],
      zoom: region.defaultZoom,
      minZoom: region.minZoom,
      maxZoom: region.maxZoom,
      maxBounds: [
        [region.bbox.west - 3, region.bbox.south - 2],
        [region.bbox.east + 3, region.bbox.north + 2],
      ],
      attributionControl: { compact: true },
      canvasContextAttributes: {
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: false,
        antialias: true,
      },
    });
    map.addControl(new NavigationControl({ visualizePitch: false }), "bottom-right");
    mapRef.current = map;

    const addSourceOnce = (id: string) => {
      if (!map.getSource(id)) map.addSource(id, { type: "geojson", data: empty() });
    };
    const addLayerOnce = (layer: Parameters<MapLibreMap["addLayer"]>[0]) => {
      if (!map.getLayer(layer.id)) map.addLayer(layer);
    };

    const ensureLayers = () => {
      addSourceOnce("mask");
      addSourceOnce("perimeters");
      addSourceOnce("spread");
      addSourceOnce("hotspots");
      addSourceOnce("communities");
      addSourceOnce("routes");
      addSourceOnce("reception");

      const maskSrc = map.getSource("mask") as GeoJSONSource;
      maskSrc?.setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [[
                [region.bbox.west, region.bbox.south],
                [region.bbox.east, region.bbox.south],
                [region.bbox.east, region.bbox.north],
                [region.bbox.west, region.bbox.north],
                [region.bbox.west, region.bbox.south],
              ]],
            },
          },
        ],
      });

      addLayerOnce({
        id: "mask",
        type: "line",
        source: "mask",
        paint: { "line-color": "#e4c07a", "line-width": 1, "line-opacity": 0.35 },
      });
      addLayerOnce({
        id: "perimeters-fill",
        type: "fill",
        source: "perimeters",
        paint: { "fill-color": "#7f1d1d", "fill-opacity": 0.35 },
      });
      addLayerOnce({
        id: "perimeters-line",
        type: "line",
        source: "perimeters",
        paint: { "line-color": "#fb7185", "line-width": 1.6 },
      });
      addLayerOnce({
        id: "spread-fill",
        type: "fill",
        source: "spread",
        paint: { "fill-color": "#ff5a1f", "fill-opacity": 0.38 },
      });
      addLayerOnce({
        id: "spread-line",
        type: "line",
        source: "spread",
        paint: {
          "line-color": "#ffb347",
          "line-width": 2,
          "line-dasharray": [2, 1.2],
        },
      });
      addLayerOnce({
        id: "hotspots",
        type: "circle",
        source: "hotspots",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 4, 4, 8, 8, 11, 11],
          "circle-color": "#ff4d3a",
          "circle-stroke-width": 1,
          "circle-stroke-color": "#ffd7a8",
          "circle-opacity": 0.95,
        },
      });
      addLayerOnce({
        id: "routes",
        type: "line",
        source: "routes",
        paint: {
          "line-color": [
            "match",
            ["get", "risk"],
            "leave",
            "#ff4d3a",
            "prepare",
            "#fb8a3a",
            "watch",
            "#f5c15a",
            "#5ee9b4",
          ],
          "line-width": 4,
          "line-opacity": 0.92,
        },
      });
      addLayerOnce({
        id: "communities",
        type: "circle",
        source: "communities",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "score"],
            0,
            4,
            100,
            9,
          ],
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "score"],
            0,
            "#5ee9b4",
            25,
            "#f5c15a",
            50,
            "#fb8a3a",
            75,
            "#ff4d3a",
          ],
          "circle-stroke-width": 1.2,
          "circle-stroke-color": "#1a120c",
        },
      });
      addLayerOnce({
        id: "reception",
        type: "circle",
        source: "reception",
        paint: {
          "circle-radius": 5.5,
          "circle-color": "#93c5fd",
          "circle-stroke-color": "#1e3a5f",
          "circle-stroke-width": 1,
        },
      });
    };

    map.on("click", "communities", (e: MapLayerMouseEvent) => {
      const id = e.features?.[0]?.properties?.id;
      if (typeof id === "string") onSelectRef.current(id);
    });
    map.on("mouseenter", "communities", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "communities", () => {
      map.getCanvas().style.cursor = "";
    });

    const onLoad = () => {
      ensureLayers();
      map.resize();
      pushData(map, dataRef.current);
    };
    map.once("load", onLoad);
    const ro = new ResizeObserver(() => map.resize());
    ro.observe(rootRef.current);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    pushData(map, { situation, hour, risks, selectedId, routes });
  }, [situation, hour, risks, selectedId, routes, reducedMotion]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const c = communities.find((x) => x.id === selectedId);
    if (!c) return;
    map.flyTo({ center: [c.lon, c.lat], zoom: Math.max(map.getZoom(), 8), essential: true, duration: reducedMotion ? 0 : 900 });
  }, [selectedId, reducedMotion]);

  useEffect(() => {
    if (situation?.mode !== "demo") return;
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({ center: [-118.08, 52.87], zoom: 8.2, essential: true, duration: reducedMotion ? 0 : 1200 });
  }, [situation?.mode, reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    let raf = 0;
    const particles = Array.from({ length: 220 }, () => ({
      x: region.bbox.west + Math.random() * (region.bbox.east - region.bbox.west),
      y: region.bbox.south + Math.random() * (region.bbox.north - region.bbox.south),
      age: Math.random(),
    }));

    const tick = () => {
      const ctx = canvas.getContext("2d");
      const host = canvas.parentElement;
      if (!ctx || !host) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.clearRect(0, 0, w, h);
      const liveMap = mapRef.current;
      const grid = dataRef.current.situation?.windGrid ?? [];
      const wx = dataRef.current.situation?.weather[
        Math.min(dataRef.current.hour, (dataRef.current.situation?.weather.length ?? 1) - 1)
      ];
      const windKmh = grid[0]?.windKmh ?? wx?.windKmh ?? 12;
      const from = grid[0]?.windFromDeg ?? wx?.windFromDeg ?? 270;
      const dir = windToward(from);
      const step = (windKmh / 900) * (0.08 + windKmh / 80);
      ctx.strokeStyle = "rgba(228,192,122,0.28)";
      ctx.lineWidth = 1;
      for (const p of particles) {
        p.x += Math.sin(dir) * step;
        p.y += Math.cos(dir) * step * 0.6;
        p.age += 0.008;
        if (
          p.age > 1 ||
          p.x < region.bbox.west ||
          p.x > region.bbox.east ||
          p.y < region.bbox.south ||
          p.y > region.bbox.north
        ) {
          p.x = region.bbox.west + Math.random() * (region.bbox.east - region.bbox.west);
          p.y = region.bbox.south + Math.random() * (region.bbox.north - region.bbox.south);
          p.age = 0;
        }
        if (!liveMap) continue;
        const a = liveMap.project([p.x, p.y]);
        const b = liveMap.project([
          p.x + Math.sin(dir) * 0.12,
          p.y + Math.cos(dir) * 0.08,
        ]);
        ctx.globalAlpha = 0.25 * (1 - p.age);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, situation]);

  return (
    <div className="map-el" aria-label="Alberta wildfire map">
      <div ref={rootRef} className="map-el" />
      <canvas ref={canvasRef} className="wind-canvas" aria-hidden="true" />
    </div>
  );
}

function pushData(
  map: MapLibreMap,
  state: {
    situation: Situation | null;
    hour: number;
    risks: CommunityRisk[];
    selectedId: string | null;
    routes: EscapeRoute[];
  },
) {
  const { situation, hour, risks, selectedId, routes } = state;
  const scoreOf = new Map(risks.map((r) => [r.communityId, r.score]));
  const set = (id: string, data: FC) => {
    const src = map.getSource(id) as GeoJSONSource | undefined;
    src?.setData(data);
  };

  set("hotspots", {
    type: "FeatureCollection",
    features: (situation?.hotspots ?? []).map((h, i) => ({
      type: "Feature",
      id: i,
      properties: { frp: h.frp ?? 0 },
      geometry: { type: "Point", coordinates: [h.lon, h.lat] },
    })),
  });

  set("perimeters", {
    type: "FeatureCollection",
    features: (situation?.perimeters ?? []).map((p) => ({
      type: "Feature",
      properties: { id: p.id },
      geometry: { type: "Polygon", coordinates: p.coordinates },
    })),
  });

  set("spread", {
    type: "FeatureCollection",
    features: (situation?.clusters ?? []).map((c) => {
      const frame = frameAt(c, hour);
      return {
        type: "Feature" as const,
        properties: { id: c.id, hour },
        geometry: frame.geometry,
      };
    }),
  });

  set("communities", {
    type: "FeatureCollection",
    features: communities.map((c) => ({
      type: "Feature" as const,
      properties: {
        id: c.id,
        name: c.name,
        score: scoreOf.get(c.id) ?? 0,
        selected: c.id === selectedId,
      },
      geometry: { type: "Point", coordinates: [c.lon, c.lat] },
    })),
  });

  set("routes", {
    type: "FeatureCollection",
    features: routes.map((r) => ({
      type: "Feature" as const,
      properties: { id: r.id, risk: r.risk, selected: true },
      geometry: { type: "LineString", coordinates: r.coordinates },
    })),
  });

  set("reception", {
    type: "FeatureCollection",
    features: receptionCentres.map((r) => ({
      type: "Feature" as const,
      properties: { name: r.name },
      geometry: { type: "Point", coordinates: [r.lon, r.lat] },
    })),
  });
}
