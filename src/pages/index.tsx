import SEO, { SEOProps } from "@/components/pages/SEO";
import Layout from "@/hocs/Layout";

const SEOList: SEOProps = {
  title: "Aprende Python desde cero | SoloPython",
  description:
    "Domina la programación en Python con cursos prácticos, artículos y proyectos. Desde lo básico hasta nivel avanzado, todo en un solo lugar.",
  keywords:
    "Python, cursos de Python, aprender Python, programación en Python, SoloPython, desarrollo backend, scripts Python, proyectos Python",
  href: "/",
  robots: "index, follow",
  author: "SoloPython",
  publisher: process.env.DOMAIN_NAME || "solopython.com",
  image: "/assets/img/thumbnails/default_thumbnail.jpg",
  twitterHandle: "@solopython",
};

export default function Home() {
  return (
    <div>
      <SEO {...SEOList} />
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        Hello WOrld
      </main>
    </div>
  );
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
