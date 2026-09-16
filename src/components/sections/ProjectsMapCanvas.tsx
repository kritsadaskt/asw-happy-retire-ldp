"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map,
  Marker,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect } from "react";

import { Icon } from "@/components/ui/Icon";
import {
  getProjectTypeMeta,
  projectsSection,
  type Project,
} from "@/content/projects";
import { cn } from "@/lib/cn";

type CanvasProps = {
  apiKey: string;
  mapId: string | null;
  projects: Project[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

const { center, zoom, focusZoom } = projectsSection.mapDefaults;

/** Pans to a selected pin, otherwise fits every visible project on screen. */
function CameraController({
  target,
  projects,
}: {
  target: { lat: number; lng: number } | null;
  projects: Project[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    try {
      if (target) {
        map.panTo(target);
        map.setZoom(focusZoom);
        return;
      }

      if (projects.length === 0) {
        map.panTo(center);
        map.setZoom(zoom);
        return;
      }

      if (projects.length === 1) {
        map.panTo(projects[0].position);
        map.setZoom(focusZoom);
        return;
      }

      if (typeof google === "undefined" || !google.maps?.LatLngBounds) {
        map.panTo(center);
        map.setZoom(zoom);
        return;
      }

      const bounds = new google.maps.LatLngBounds();
      for (const project of projects) {
        bounds.extend(project.position);
      }
      map.fitBounds(bounds, 80);
    } catch {
      // Google Maps may reject camera calls when the SDK failed to load.
    }
  }, [map, target, projects]);

  return null;
}

function TypeMarker({
  project,
  isActive,
  onSelect,
}: {
  project: Project;
  isActive: boolean;
  onSelect: (id: string) => void;
}) {
  const type = getProjectTypeMeta(project.type);

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
        className="relative block pb-1.5"
      >
        <span
          className={cn(
            "relative flex origin-bottom items-center gap-2 rounded-full border-2 bg-white py-1 pr-3 pl-1 shadow-float transition",
            isActive
              ? "scale-110 border-navy"
              : "border-white hover:border-navy/40",
          )}
        >
          <span
            className="grid size-8 place-items-center rounded-full bg-cream-soft text-navy"
            title={type.label}
          >
            <Icon name={type.icon} className="text-xs" />
          </span>
          <span className="text-2xs leading-none font-bold whitespace-nowrap text-navy">
            {project.name}
          </span>
          <span
            aria-hidden
            className={cn(
              "absolute top-full left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r-2 border-b-2 bg-white",
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
        minZoom={6}
        maxZoom={16}
        clickableIcons={false}
        reuseMaps
        className="size-full"
      >
        {projects.map((project) =>
          mapId ? (
            <TypeMarker
              key={project.id}
              project={project}
              isActive={project.id === activeId}
              onSelect={onSelect}
            />
          ) : (
            // AdvancedMarker (and therefore the type pins) needs a Map ID.
            // Without one the map still works with the classic pins.
            <Marker
              key={project.id}
              position={project.position}
              title={project.name}
              onClick={() => onSelect(project.id)}
            />
          ),
        )}

        <CameraController
          target={active ? active.position : null}
          projects={projects}
        />
      </Map>
    </APIProvider>
  );
}
