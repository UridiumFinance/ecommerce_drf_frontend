import SEO, { SEOProps } from "@/components/pages/SEO";
import ProfileLayout from "@/hocs/ProfileLayout";

const SEOList: SEOProps = {
  title: "Tu perfil | SoloPython",
  description:
    "Accede y actualiza la información de tu cuenta en SoloPython. Gestiona tu perfil, datos de contacto y preferencias para recibir las últimas novedades sobre cursos y recursos de Python.",
  keywords:
    "perfil usuario, cuenta SoloPython, editar perfil, información personal, preferencias de cuenta, SoloPython",
  href: "/profile",
  robots: "noindex, nofollow",
  author: "SoloPython",
  publisher: process.env.DOMAIN_NAME || "solopython.com",
  image: "/assets/img/thumbnails/profile_thumbnail.jpg",
  twitterHandle: "@solopython",
};

export default function Page() {
  return (
    <div>
      <SEO {...SEOList} />
      <main>Profile Information</main>
    </div>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};
