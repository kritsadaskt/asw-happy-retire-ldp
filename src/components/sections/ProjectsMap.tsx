"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import {
  projectsSection as content,
  getProjectTypeMeta,
  zones,
  type Project,
  type ZoneId,
} from "@/content/projects";
import { cn } from "@/lib/cn";

const ProjectsMapCanvas = dynamic(
  () => import("@/components/sections/ProjectsMapCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="grid size-full place-items-center bg-navy-mist text-sm text-navy/50">
        กำลังโหลดแผนที่...
      </div>
    ),
  },
);

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim() || null;

export function ProjectsMap({ projects }: { projects: Project[] }) {
  const [zone, setZone] = useState<ZoneId>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const visibleProjects = useMemo(
    () =>
      zone === "all"
        ? projects
        : projects.filter((project) => project.zone === zone),
    [projects, zone],
  );

  const listedProjects = useMemo(
    () =>
      visibleProjects.filter((project) => project.status === "ready_project"),
    [visibleProjects],
  );

  const selectZone = (next: ZoneId) => {
    setZone(next);
    setActiveId(null);
  };

  const zoneRows = [zones.slice(0, 5), zones.slice(5)];

  const zoneNav = (
    <nav aria-label={content.zoneSelectLabel}>
      <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/97 p-1.5 shadow-float backdrop-blur">
        {zoneRows.map((row) => (
          <ul
            key={row.map((item) => item.id).join("-")}
            className="flex flex-wrap justify-center gap-1"
          >
            {row.map((item) => {
              const isActive = item.id === zone;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => selectZone(item.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium whitespace-nowrap transition",
                      isActive
                        ? "bg-navy text-white"
                        : "text-navy hover:bg-navy/5",
                    )}
                  >
                    <Icon
                      name={item.icon}
                      className={cn(
                        "text-xs",
                        isActive ? "text-cream" : "text-navy/50",
                      )}
                    />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </nav>
  );

  const projectCard = (project: Project, className?: string) => {
    const isActive = project.id === activeId;
    const type = getProjectTypeMeta(project.type);

    return (
      <div
        key={project.id}
        className={cn(
          "flex items-center gap-2.5 rounded-2xl border p-2.5 transition",
          isActive
            ? "border-navy bg-cream-soft"
            : "border-navy/10 bg-white hover:border-navy/30",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => setActiveId(project.id)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-cream-soft text-navy"
            title={type.label}
          >
            <Icon name={type.icon} className="text-sm" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-bold text-navy">
              {project.name}
            </span>
            <span className="block truncate text-2xs text-navy/55">
              {project.location}
            </span>
            {project.priceFrom ? (
              <span className="block text-2xs font-bold text-navy/80">
                {project.priceFrom}
              </span>
            ) : null}
          </span>
        </button>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${content.viewProjectLabel} ${project.name}`}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-navy/5 text-navy transition hover:bg-navy hover:text-white"
        >
          <Icon name="external-link" className="text-xs" />
        </a>
      </div>
    );
  };

  return (
    <Section id="projects" tone="cream-soft" contained={false}>
      <div className="shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.subtitle}
          />

          <ButtonLink
            href={content.allProjectsCta.href}
            external
            trailingIcon="arrow-right"
          >
            {content.allProjectsCta.label}
          </ButtonLink>
        </div>

        {apiKey ? null : (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-navy/10 bg-white px-5 py-4">
            <Icon name="map" className="mt-1 shrink-0 text-navy/60" />
            <div>
              <p className="text-sm font-bold text-navy">
                {content.mapFallback.title}
              </p>
              <p className="mt-1 text-xs text-navy/60 sm:text-sm">
                {content.mapFallback.description}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="relative mt-6 lg:mt-8">
        <div className="h-[60vh] min-h-[440px] w-full overflow-hidden bg-navy-mist md:h-[70vh] md:min-h-[620px] lg:h-[78vh]">
          {apiKey ? (
            <ProjectsMapCanvas
              apiKey={apiKey}
              mapId={mapId}
              projects={visibleProjects}
              activeId={activeId}
              onSelect={setActiveId}
            />
          ) : (
            <Image
              src={content.mapFallback.image.src}
              alt={content.mapFallback.image.alt}
              width={content.mapFallback.image.width}
              height={content.mapFallback.image.height}
              className="size-full object-cover"
            />
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 flex flex-col pt-3 lg:pt-5">
          <div className="pointer-events-auto shrink-0 px-4 lg:px-0">
            <div className="shell">{zoneNav}</div>
          </div>

          <div className="relative min-h-0 flex-1">
            <div className="shell relative hidden h-full lg:block">
              <div className="pointer-events-auto absolute top-3 left-5 flex w-[336px] max-h-[calc(100%-1.5rem)] flex-col overflow-hidden rounded-3xl bg-white/97 shadow-float backdrop-blur">
                <div className="flex shrink-0 items-baseline justify-between px-4 pt-4 pb-2">
                  <p className="text-xs font-bold text-navy/70">
                    {content.listTitle}
                  </p>
                  <p className="text-2xs text-navy/50">
                    {listedProjects.length} {content.projectCountSuffix}
                  </p>
                </div>

                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 pt-1">
                  {listedProjects.length === 0 ? (
                    <p className="rounded-2xl bg-cream-soft px-4 py-5 text-center text-xs text-navy/60">
                      {content.emptyState}
                    </p>
                  ) : (
                    listedProjects.map((project) => projectCard(project))
                  )}
                </div>
              </div>

              <div className="pointer-events-auto absolute right-5 bottom-6">
                <ButtonLink
                  href={content.fullMapCta.href}
                  external
                  icon="expand"
                >
                  {content.fullMapCta.label}
                </ButtonLink>
              </div>
            </div>

            <div className="pointer-events-auto absolute inset-x-0 bottom-0 lg:hidden">
              <div className="flex snap-x gap-3 overflow-x-auto px-5 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {listedProjects.length === 0 ? (
                  <p className="w-full rounded-2xl bg-white px-4 py-4 text-center text-xs text-navy/60 shadow-float">
                    {content.emptyState}
                  </p>
                ) : (
                  listedProjects.map((project) =>
                    projectCard(
                      project,
                      "w-[270px] shrink-0 snap-start shadow-float",
                    ),
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="shell mt-6 flex justify-center lg:hidden">
        <ButtonLink href={content.fullMapCta.href} external icon="expand">
          {content.fullMapCta.label}
        </ButtonLink>
      </div>
    </Section>
  );
}
