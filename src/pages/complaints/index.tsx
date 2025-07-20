import Step1 from "@/components/pages/complaints/Step1";
import Step2 from "@/components/pages/complaints/Step2";
import SEO, { SEOProps } from "@/components/pages/SEO";
import Layout from "@/hocs/Layout";
import { useState } from "react";

const SEOList: SEOProps = {
  title: "Libro de Reclamaciones | SoloPython",
  description:
    "¿Tienes alguna queja o incidencia con nuestros cursos y recursos de Python? Envíanos tu reclamación a través de nuestro Libro de Reclamaciones y nuestro equipo te dará respuesta a la mayor brevedad.",
  keywords:
    "Libro de reclamaciones, quejas SoloPython, reclamaciones Python, soporte Python, feedback SoloPython",
  href: "/complaints",
  robots: "index, follow",
  author: "SoloPython",
  publisher: process.env.DOMAIN_NAME || "solopython.com",
  image: "/assets/img/thumbnails/complaints_thumbnail.jpg",
  twitterHandle: "@solopython",
};

export default function Page() {
  const notificationMethods = [
    { id: "seller", title: "I'm a seller on SoloPython" },
    { id: "buyer", title: "I'm a buyer on SoloPython" },
    { id: "affiliate", title: "I'm an affiliate promoting products on SoloPython" },
    { id: "anonymous", title: "I'm not associated with SoloPython" },
  ];

  const [selectedMethod, setSelectedMethod] = useState<string>("seller");
  const [currentStep, setCurrentStep] = useState<number>(1);

  return (
    <>
      <SEO {...SEOList} />
      <main className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex w-full max-w-2xl flex-col items-center">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Libro de reclamaciones
          </h2>

          {currentStep === 1 && (
            <Step1
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              notificationMethods={notificationMethods}
              setCurrentStep={setCurrentStep}
            />
          )}

          {currentStep === 2 && (
            <Step2
              selectedMethod={selectedMethod}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              setSelectedMethod={setSelectedMethod}
            />
          )}
        </div>
      </main>
    </>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
