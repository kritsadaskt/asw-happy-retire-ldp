"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import {
  projects,
  projectsSection as content,
  zones,
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

export function ProjectsMap() {
  const [zone, setZone] = useState<ZoneId>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const visibleProjects = useMemo(
    () =>
      zone === "all"
        ? projects
        : projects.filter((project) => project.zone === zone),
    [zone],
  );

  const selectZone = (next: ZoneId) => {
    setZone(next);
    setActiveId(null);
  };

  const zoneList = (
    <ul className="space-y-1">
      {zones.map((item) => {
        const isActive = item.id === zone;
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => selectZone(item.id)}
              aria-pressed={isActive}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition",
                isActive
                  ? "bg-navy text-white"
                  : "text-navy hover:bg-navy/5",
              )}
            >
              <Icon
                name={item.icon}
                className={cn(
                  "shrink-0 text-sm",
                  isActive ? "text-cream" : "text-navy/55",
                )}
              />
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-bold">
                  {item.label}
                </span>
                {item.caption ? (
                  <span
                    className={cn(
                      "block truncate text-2xs",
                      isActive ? "text-white/70" : "text-navy/50",
                    )}
                  >
                    {item.caption}
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  const projectCard = (projectId: string, className?: string) => {
    const project = visibleProjects.find((item) => item.id === projectId);
    if (!project) return null;
    const isActive = project.id === activeId;

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
          <Image
            src={project.logo}
            alt=""
            width={256}
            height={256}
            className="size-10 shrink-0 rounded-xl object-cover"
          />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-bold text-navy">
              {project.name}
            </span>
            <span className="block truncate text-2xs text-navy/55">
              {project.location}
            </span>
            <span className="block text-2xs font-bold text-navy/80">
              {project.priceFrom}
            </span>
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-3 rounded-full border border-navy/15 bg-white px-5 py-3">
              <Icon name="search" className="shrink-0 text-sm text-navy/50" />
              <span className="sr-only">{content.zoneSelectLabel}</span>
              <select
                value={zone}
                onChange={(event) => selectZone(event.target.value as ZoneId)}
                className="w-full appearance-none bg-transparent text-sm font-medium text-navy focus:outline-none sm:w-56"
              >
                {zones.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id === "all" ? content.zoneSelectLabel : item.label}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron-down"
                className="shrink-0 text-xs text-navy/45"
              />
            </label>

            <ButtonLink
              href={content.allProjectsCta.href}
              external
              trailingIcon="arrow-right"
            >
              {content.allProjectsCta.label}
            </ButtonLink>
          </div>
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

      {/* Mobile zone chips */}
      <div className="mt-6 lg:hidden">
        <ul className="flex snap-x gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {zones.map((item) => {
            const isActive = item.id === zone;
            return (
              <li key={item.id} className="snap-start">
                <button
                  type="button"
                  onClick={() => selectZone(item.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold whitespace-nowrap transition",
                    isActive
                      ? "border-navy bg-navy text-white"
                      : "border-navy/15 bg-white text-navy",
                  )}
                >
                  <Icon name={item.icon} className="text-2xs" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="relative mt-4 lg:mt-8">
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

        {/* Desktop floating panels */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="shell relative h-full">
            <div className="pointer-events-auto absolute top-6 left-5 flex h-[calc(100%-3rem)] w-[336px] flex-col overflow-hidden rounded-3xl bg-white/97 shadow-float backdrop-blur">
              <div className="shrink-0 border-b border-navy/10 p-3">
                {zoneList}
              </div>

              <div className="flex shrink-0 items-baseline justify-between px-4 pt-3">
                <p className="text-xs font-bold text-navy/70">
                  {content.listTitle}
                </p>
                <p className="text-2xs text-navy/50">
                  {visibleProjects.length} {content.projectCountSuffix}
                </p>
              </div>

              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
                {visibleProjects.length === 0 ? (
                  <p className="rounded-2xl bg-cream-soft px-4 py-5 text-center text-xs text-navy/60">
                    {content.emptyState}
                  </p>
                ) : (
                  visibleProjects.map((project) => projectCard(project.id))
                )}
              </div>
            </div>

            <p className="absolute top-10 right-5 max-w-[260px] text-right text-xl leading-snug font-bold text-navy drop-shadow-[0_2px_10px_rgba(255,255,255,0.9)]">
              {content.quote.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>

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
        </div>

        {/* Mobile bottom sheet */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 lg:hidden">
          <div className="pointer-events-auto flex snap-x gap-3 overflow-x-auto px-5 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {visibleProjects.length === 0 ? (
              <p className="w-full rounded-2xl bg-white px-4 py-4 text-center text-xs text-navy/60 shadow-float">
                {content.emptyState}
              </p>
            ) : (
              visibleProjects.map((project) =>
                projectCard(
                  project.id,
                  "w-[270px] shrink-0 snap-start shadow-float",
                ),
              )
            )}
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
