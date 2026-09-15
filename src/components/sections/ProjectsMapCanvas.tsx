"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map,
  Marker,
  useMap,
} from "@vis.gl/react-google-maps";
import Image from "next/image";
import { useEffect } from "react";

import { projectsSection, type Project } from "@/content/projects";
import { cn } from "@/lib/cn";

type CanvasProps = {
  apiKey: string;
  mapId: string | null;
  projects: Project[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

const { center, zoom, focusZoom } = projectsSection.mapDefaults;

/** Pans and zooms to the selected project whenever the selection changes. */
function CameraController({
  target,
}: {
  target: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (!target) {
      map.panTo(center);
      map.setZoom(zoom);
      return;
    }

    map.panTo(target);
    map.setZoom(focusZoom);
  }, [map, target]);

  return null;
}

function LogoMarker({
  project,
  isActive,
  onSelect,
}: {
  project: Project;
  isActive: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <AdvancedMarker
      position={project.position}
      title={project.name}
      zIndex={isActive ? 20 : 1}
      onMouseEnter={() => onSelect(project.id)}
    >
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${projectsSection.viewProjectLabel} ${project.name}`}
        className="block -translate-y-1/2"
      >
        <span
          className={cn(
            "relative flex items-center gap-2 rounded-full border-2 bg-white py-1 pr-3 pl-1 shadow-float transition",
            isActive
              ? "scale-110 border-navy"
              : "border-white hover:border-navy/40",
          )}
        >
          <Image
            src={project.logo}
            alt=""
            width={256}
            height={256}
            className="size-8 rounded-full object-cover"
          />
          <span className="text-2xs leading-none font-bold whitespace-nowrap text-navy">
            {project.name}
          </span>
          <span
            aria-hidden
            className={cn(
              "absolute -bottom-1.5 left-4 size-3 rotate-45 border-r-2 border-b-2 bg-white",
              isActive ? "border-navy" : "border-white",
            )}
          />
        </span>
      </a>
    </AdvancedMarker>
  );
}

export default function ProjectsMapCanvas({
  apiKey,
  mapId,
  projects,
  activeId,
  onSelect,
}: CanvasProps) {
  const active = projects.find((project) => project.id === activeId) ?? null;

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        mapId={mapId ?? undefined}
        gestureHandling="cooperative"
        disableDefaultUI
        zoomControl
        clickableIcons={false}
        reuseMaps
        className="size-full"
      >
        {projects.map((project) =>
          mapId ? (
            <LogoMarker
              key={project.id}
              project={project}
              isActive={project.id === activeId}
              onSelect={onSelect}
            />
          ) : (
            // AdvancedMarker (and therefore the logo pins) needs a Map ID.
            // Without one the map still works with the classic pins.
            <Marker
              key={project.id}
              position={project.position}
              title={project.name}
              onClick={() => onSelect(project.id)}
            />
          ),
        )}

        <CameraController target={active ? active.position : null} />
      </Map>
    </APIProvider>
  );
}
