import React from "react";
import SEO, { SEOProps } from "@/components/pages/SEO";
import TermsLayout from "@/hocs/TermsLayout";

const SEOList: SEOProps = {
  title: "Términos y Condiciones | SoloPython",
  description:
    "Consulta los términos y condiciones de uso de SoloPython para acceder a nuestros cursos, artículos y recursos. Conoce tus derechos, responsabilidades y políticas de la plataforma.",
  keywords:
    "Términos y condiciones, SoloPython, condiciones de uso, políticas de plataforma, términos de servicio Python",
  href: "/terms",
  robots: "index, follow",
  author: "SoloPython",
  publisher: process.env.DOMAIN_NAME || "solopython.com",
  image: "/assets/img/thumbnails/terms_thumbnail.jpg",
  twitterHandle: "@solopython",
};

export default function Page() {
  return (
    <>
      <SEO {...SEOList} />
      <main className="row-start-2 flex flex-col items-center gap-8 px-6 sm:items-start">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900">
            Términos y Condiciones de SoloPython Store
          </h1>
          <p className="mt-2 text-gray-600">Última actualización: 20 de julio de 2025</p>

          {/* 1. Definiciones */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">1. Definiciones</h2>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
              <li>
                <strong>SoloPython Store</strong> o “la Tienda”: el sitio web https://solopython.com
                y sus subdominios dedicados a la venta de productos y servicios.
              </li>
              <li>
                <strong>Cliente</strong> o “Usuario”: persona natural o jurídica que navega, compra
                o contrata productos o servicios en la Tienda.
              </li>
              <li>
                <strong>Productos</strong>: bienes físicos, digitales, cursos o contenidos
                audiovisuales ofrecidos a la venta.
              </li>
              <li>
                <strong>Pedido</strong>: solicitud de compra de uno o varios Productos realizada por
                el Cliente y aceptada por la Tienda.
              </li>
            </ul>
          </section>

          {/* 2. Objeto */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">2. Objeto</h2>
            <p className="mt-2 text-gray-700">
              Estos Términos y Condiciones regulan la compra y contratación de Productos en
              SoloPython Store. Su aceptación es requisito imprescindible para completar cualquier
              Pedido.
            </p>
          </section>

          {/* 3. Aceptación de los Términos */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">3. Aceptación de los Términos</h2>
            <p className="mt-2 text-gray-700">
              Al registrarse o realizar un Pedido, el Cliente declara haber leído, entendido y
              aceptado sin reservas estos Términos y Condiciones.
            </p>
          </section>

          {/* 4. Registro y Cuenta */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">4. Registro y Cuenta</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-6 text-gray-700">
              <li>El Cliente puede comprar como invitado o creando una cuenta.</li>
              <li>
                Es responsabilidad del Cliente mantener la confidencialidad de su usuario y
                contraseña.
              </li>
              <li>
                La Tienda no se hace responsable por accesos indebidos derivados de uso no
                autorizado de la cuenta del Cliente.
              </li>
            </ol>
          </section>

          {/* 5. Productos y Disponibilidad */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">5. Productos y Disponibilidad</h2>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
              <li>
                Las fotografías, descripciones y precios de los Productos publicados son
                orientativos y pueden variar según stock y actualizaciones.
              </li>
              <li>
                La Tienda hará su mejor esfuerzo por mantener la disponibilidad actualizada. En caso
                de falta de stock tras el Pedido, se informará al Cliente para ofrecer alternativa o
                reembolso.
              </li>
            </ul>
          </section>

          {/* 6. Precios y Pagos */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">6. Precios y Pagos</h2>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
              <li>
                Todos los precios están indicados en moneda local e incluyen los impuestos vigentes.
              </li>
              <li>
                El Cliente puede pagar mediante tarjeta de crédito/débito, PayPal u otros métodos
                habilitados. El cobro se realizará al confirmar el Pedido.
              </li>
              <li>
                La Tienda se reserva el derecho de verificar los datos de facturación antes de
                procesar el pago.
              </li>
            </ul>
          </section>

          {/* 7. Envíos y Entregas */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">7. Envíos y Entregas</h2>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
              <li>
                Los Productos físicos se envían a la dirección proporcionada por el Cliente. Los
                plazos de entrega estimados aparecerán al tramitar el Pedido.
              </li>
              <li>
                Los costes de envío se calculan según la ubicación y el peso/volumen del Pedido.
              </li>
              <li>
                Para Productos digitales, la entrega es inmediata tras la confirmación de pago
                (acceso a plataforma o enlace de descarga).
              </li>
            </ul>
          </section>

          {/* 8. Devoluciones y Cambios */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">8. Devoluciones y Cambios</h2>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
              <li>
                Para Productos físicos, el Cliente dispone de 7 días naturales desde la recepción
                para solicitar devolución o cambio, siempre que el Producto no esté usado y conserve
                su embalaje original.
              </li>
              <li>
                El Cliente debe contactar a soporte@solopython.com con el número de Pedido y motivo.
                Los costes de envío de devolución serán a cargo del Cliente, salvo defecto o error
                de la Tienda.
              </li>
              <li>
                No aplican devoluciones a Productos digitales que ya hayan sido descargados o
                consumidos online.
              </li>
            </ul>
          </section>

          {/* 9. Garantías */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">9. Garantías</h2>
            <p className="mt-2 text-gray-700">
              Los Productos físicos cuentan con la garantía legal de 6 meses por defectos de
              fábrica, según la normativa de protección al consumidor. Para reclamaciones de
              garantía, el Cliente debe presentar prueba de compra y detallar el defecto.
            </p>
          </section>

          {/* 10. Responsabilidad */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">10. Responsabilidad</h2>
            <p className="mt-2 text-gray-700">
              La Tienda no será responsable por daños indirectos, pérdida de datos o lucro cesante
              derivados del uso o imposibilidad de uso de los Productos. La responsabilidad máxima
              estará limitada al importe total del Pedido.
            </p>
          </section>

          {/* 11. Propiedad Intelectual */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">11. Propiedad Intelectual</h2>
            <p className="mt-2 text-gray-700">
              Todos los contenidos de SoloPython (textos, diseños, logos, cursos, código fuente)
              están protegidos por derechos de autor y marcas registradas. Queda prohibida la
              reproducción, distribución o transformación total o parcial sin autorización expresa.
            </p>
          </section>

          {/* 12. Protección de Datos */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">12. Protección de Datos</h2>
            <p className="mt-2 text-gray-700">
              SoloPython cumple la Ley de Protección de Datos Personales. La información del Cliente
              se utilizará para procesar Pedidos y enviar comunicaciones, previo consentimiento.
              Consulta nuestra Política de Privacidad para más detalles.
            </p>
          </section>

          {/* 13. Fuerza Mayor */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">13. Fuerza Mayor</h2>
            <p className="mt-2 text-gray-700">
              La Tienda no se responsabiliza por el incumplimiento de sus obligaciones debido a
              causas de fuerza mayor (desastres naturales, huelgas, regulaciones gubernamentales,
              etc.).
            </p>
          </section>

          {/* 14. Modificación de los Términos */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              14. Modificación de los Términos
            </h2>
            <p className="mt-2 text-gray-700">
              La Tienda puede actualizar estos Términos en cualquier momento. Las modificaciones se
              publicarán en esta página con la fecha de última revisión. El uso continuado implica
              aceptación.
            </p>
          </section>

          {/* 15. Ley Aplicable y Jurisdicción */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              15. Ley Aplicable y Jurisdicción
            </h2>
            <p className="mt-2 text-gray-700">
              Estos Términos se rigen por las leyes de Perú. Para controversias, las partes se
              someten a los tribunales de Lima.
            </p>
          </section>

          {/* 16. Contacto */}
          <section className="mt-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-900">16. Contacto</h2>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
              <li>
                <strong>Email:</strong> soporte@solopython.com
              </li>
              <li>
                <strong>Teléfono:</strong> +51 1 2345678
              </li>
              <li>
                <strong>Dirección:</strong> Av. Ejemplo 123, Lima, Perú
              </li>
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <TermsLayout>{page}</TermsLayout>;
};
