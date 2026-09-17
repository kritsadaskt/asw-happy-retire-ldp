import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { ProjectsMap } from "@/components/sections/ProjectsMap";
import { RegisterForm } from "@/components/sections/RegisterForm";
import { getProjectSelectGroups, mapProjects } from "@/lib/projects";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroBanner />
        <RegisterForm projectGroups={getProjectSelectGroups(mapProjects)} />
        <ProjectsMap projects={mapProjects} />
      </main>
      <Footer />
    </>
  );
}
