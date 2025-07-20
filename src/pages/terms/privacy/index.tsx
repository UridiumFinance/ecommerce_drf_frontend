import React from "react";
import SEO, { SEOProps } from "@/components/pages/SEO";
import TermsLayout from "@/hocs/TermsLayout";

const SEOList: SEOProps = {
  title: "Política de Privacidad | SoloPython",
  description:
    "Lee nuestra Política de Privacidad para entender cómo recopilamos, usamos y protegemos tus datos personales en SoloPython. Conoce tus derechos y nuestras prácticas de seguridad.",
  keywords:
    "Política de privacidad, privacidad de datos, SoloPython, protección de datos, uso de datos personales, seguridad de la información",
  href: "/privacy",
  robots: "index, follow",
  author: "SoloPython",
  publisher: process.env.DOMAIN_NAME || "solopython.com",
  image: "/assets/img/thumbnails/privacy_thumbnail.jpg",
  twitterHandle: "@solopython",
};

export default function Page() {
  return (
    <>
      <SEO {...SEOList} />
      <main className="row-start-2 flex flex-col items-center gap-8 px-6 sm:items-start">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900">Política de Privacidad</h1>
          <p className="mt-2 text-gray-600">Última actualización: 20 de julio de 2025</p>

          {/* 1. Introducción */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">1. Introducción</h2>
            <p className="mt-2 text-gray-700">
              En SoloPython nos comprometemos a proteger tu privacidad. Esta política describe cómo
              recopilamos, usamos y compartimos la información que obtenemos cuando usas nuestra
              tienda en línea.
            </p>
          </section>

          {/* 2. Información que recopilamos */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">2. Información que recopilamos</h2>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
              <li>
                <strong>Datos personales:</strong> nombre, correo electrónico, dirección y teléfono
                que nos proporcionas al registrarte o realizar un pedido.
              </li>
              <li>
                <strong>Datos de pago:</strong> información de tarjeta o método de pago (procesada
                directamente por nuestra pasarela de pagos).
              </li>
              <li>
                <strong>Datos de uso:</strong> información sobre tu navegación y uso de nuestro
                sitio (páginas visitadas, búsquedas, dispositivo).
              </li>
              <li>
                <strong>Cookies y similares:</strong> pequeños archivos que se almacenan en tu
                navegador para mejorar la experiencia.
              </li>
            </ul>
          </section>

          {/* 3. Uso de la información */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">3. Uso de la información</h2>
            <p className="mt-2 text-gray-700">Utilizamos tus datos para:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
              <li>Procesar y entregar tus pedidos.</li>
              <li>Comunicarte novedades y ofertas (con tu consentimiento).</li>
              <li>Mejorar el funcionamiento de nuestro sitio.</li>
              <li>Atender consultas y solicitudes de soporte.</li>
            </ul>
          </section>

          {/* 4. Cookies y tecnologías similares */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              4. Cookies y tecnologías similares
            </h2>
            <p className="mt-2 text-gray-700">Empleamos cookies propias y de terceros para:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
              <li>Recordar tus preferencias y mantener tu sesión iniciada.</li>
              <li>Analizar el tráfico y comportamiento de usuarios (Google Analytics).</li>
              <li>Mostrar publicidad relevante en otros sitios (anuncios remarketing).</li>
            </ul>
            <p className="mt-2 text-gray-700">
              Puedes desactivar las cookies desde la configuración de tu navegador, aunque esto
              puede afectar la funcionalidad.
            </p>
          </section>

          {/* 5. Compartir con terceros */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">5. Compartir con terceros</h2>
            <p className="mt-2 text-gray-700">
              No vendemos tus datos personales. Podemos compartirlos con:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
              <li>Proveedores de pago para procesar tus transacciones.</li>
              <li>Empresas de logística para entregar tus pedidos.</li>
              <li>Herramientas de marketing y analítica (con acuerdos de confidencialidad).</li>
            </ul>
          </section>

          {/* 6. Seguridad de los datos */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">6. Seguridad de los datos</h2>
            <p className="mt-2 text-gray-700">
              Implementamos medidas técnicas y organizativas para proteger tu información contra
              acceso no autorizado, alteración o pérdida.
            </p>
          </section>

          {/* 7. Derechos de los usuarios */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">7. Derechos de los usuarios</h2>
            <p className="mt-2 text-gray-700">Tienes derecho a:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
              <li>Acceder, rectificar o eliminar tus datos personales.</li>
              <li>Solicitar la portabilidad de la información.</li>
              <li>Oponerte o limitar el tratamiento conforme a la ley.</li>
              <li>Retirar tu consentimiento para comunicaciones.</li>
            </ul>
            <p className="mt-2 text-gray-700">
              Para ejercerlos, contáctanos a{" "}
              <a href="mailto:soporte@solopython.com" className="text-indigo-600 hover:underline">
                soporte@solopython.com
              </a>
              .
            </p>
          </section>

          {/* 8. Cambios en esta política */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">8. Cambios en esta política</h2>
            <p className="mt-2 text-gray-700">
              Podemos actualizar esta política en cualquier momento. Publicaremos la versión
              revisada con la nueva fecha de actualización. El uso continuo implica aceptación de
              los cambios.
            </p>
          </section>

          {/* 9. Contacto */}
          <section className="mt-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-900">9. Contacto</h2>
            <p className="mt-2 text-gray-700">
              Si tienes preguntas o inquietudes sobre esta política, escríbenos a{" "}
              <a href="mailto:soporte@solopython.com" className="text-indigo-600 hover:underline">
                soporte@solopython.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <TermsLayout>{page}</TermsLayout>;
};
