import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProjectsGrid from "@/components/ProjectsGrid";
import About from "@/components/About";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Chatbot from "@/components/Chatbot";
import { createClient } from "@/lib/supabase/server";
import type { Project, Service, Testimonial, SiteSettings } from "@/lib/types";

export const revalidate = 30;

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: projects }, { data: services }, { data: testimonials }, { data: settings }] =
    await Promise.all([
      supabase.from("projects").select("*").eq("published", true).order("sort_order"),
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("testimonials").select("*").order("sort_order"),
      supabase.from("site_settings").select("*").eq("id", 1).single(),
    ]);

  const siteSettings = (settings as SiteSettings) ?? null;

  return (
    <main className="relative bg-black">
      <Loader name={siteSettings?.hero_name ?? "SUMIT SHETTAR"} />
      <Nav />
      <Hero settings={siteSettings} />
      <ProjectsGrid projects={(projects as Project[]) ?? []} />
      <About settings={siteSettings} />
      <Services services={(services as Service[]) ?? []} />
      <Testimonials testimonials={(testimonials as Testimonial[]) ?? []} />
      <Contact settings={siteSettings} />
      <Chatbot settings={siteSettings} />
    </main>
  );
}
