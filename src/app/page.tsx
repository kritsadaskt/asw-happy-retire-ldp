import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { ProjectsMap } from "@/components/sections/ProjectsMap";
import { RegisterForm } from "@/components/sections/RegisterForm";
import { getMapProjects } from "@/lib/projects";

export const revalidate = 3600;

export default async function HomePage() {
  const projects = await getMapProjects();

  return (
    <>
      <Header />
      <main>
        <HeroBanner />
        <RegisterForm />
        <ProjectsMap projects={projects} />
      </main>
      <Footer />
    </>
  );
}
