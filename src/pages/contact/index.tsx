import LoadingMoon from "@/components/loaders/LoadingMoon";
import SEO, { SEOProps } from "@/components/pages/SEO";
import { ToastError, ToastSuccess } from "@/components/toast/alerts";
import Layout from "@/hocs/Layout";
import sendContactForm, { SendContactFormProps } from "@/utils/api/contact/sendContactForm";
import { BuildingOffice2Icon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const SEOList: SEOProps = {
  title: "Contáctanos | SoloPython",
  description:
    "¿Tienes preguntas, sugerencias o necesitas ayuda con nuestros cursos y recursos de Python? Ponte en contacto con el equipo de SoloPython y te responderemos lo antes posible.",
  keywords:
    "Contacto, SoloPython, soporte Python, ayuda Python, consultas Python, sugerencias Python, feedback SoloPython",
  href: "/contacto",
  robots: "index, follow",
  author: "SoloPython",
  publisher: process.env.DOMAIN_NAME || "solopython.com",
  image: "/assets/img/thumbnails/contact_thumbnail.jpg",
  twitterHandle: "@solopython",
};

export default function Page() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sanitizeText = (value: string) => value.replace(/[^a-zA-Z0-9\s',:.?\-ÁÉÍÓÚáéíóúÑñüÜ]/g, "");

  const sanitizeEmail = (value: string) =>
    value
      .replace(/<script.*?>.*?<\/script>/gi, "")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/[;:"!]/g, "");

  const sanitizePhone = (value: string) => {
    let v = value.replace(/[^0-9+\-\s]/g, "");
    // only one leading '+'
    const pluses = (v.match(/\+/g) || []).length;
    if (pluses > 1) {
      v = v.replace(/\+/g, "");
      v = "+" + v;
    }
    return v;
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // basic front‑end checks
    if (!firstName || !lastName || !email || !message) {
      return ToastError("Por favor, completa los campos obligatorios.");
    }
    const emailRe = /^\S+@\S+\.\S+$/;
    if (!emailRe.test(email)) {
      return ToastError("El correo no tiene un formato válido.");
    }

    try {
      setLoading(true);
      const data: SendContactFormProps = {
        firstName,
        lastName,
        email,
        phoneNumber,
        message,
      };
      const res = await sendContactForm(data);
      if (res.status === 201) {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setMessage("");
        ToastSuccess("¡Mensaje enviado correctamente!");
      } else {
        ToastError(res.detail || "No se pudo enviar el mensaje.");
      }
    } catch {
      ToastError("Error de red al enviar el mensaje.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO {...SEOList} />
      <div className="relative isolate bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          {/* left info column */}
          <div className="relative px-6 pt-24 pb-20 sm:pt-32 lg:static lg:px-8 lg:py-48">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-100 ring-1 ring-gray-900/10 lg:w-1/2">
                {/* SVG background omitted for brevity */}
              </div>
              <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Contáctanos
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                ¿Tienes dudas o sugerencias? Completa el formulario y nos pondremos en contacto
                pronto.
              </p>
              <dl className="mt-10 space-y-4 text-base text-gray-600">
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Dirección</span>
                    <BuildingOffice2Icon className="h-7 w-6 text-gray-400" />
                  </dt>
                  <dd>
                    545 Mavis Island
                    <br />
                    Chicago, IL 99191
                  </dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Teléfono</span>
                    <PhoneIcon className="h-7 w-6 text-gray-400" />
                  </dt>
                  <dd>
                    <a href="tel:+15552345678" className="hover:text-gray-900">
                      +1 (555) 234-5678
                    </a>
                  </dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Email</span>
                    <EnvelopeIcon className="h-7 w-6 text-gray-400" />
                  </dt>
                  <dd>
                    <a href="mailto:hello@example.com" className="hover:text-gray-900">
                      hello@example.com
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* right form column */}
          <form
            onSubmit={handleOnSubmit}
            noValidate
            className="px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48"
          >
            <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label htmlFor="first-name" className="block text-sm font-semibold text-gray-900">
                    Nombre
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="first-name"
                      name="first-name"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={firstName}
                      onChange={e => setFirstName(sanitizeText(e.target.value))}
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="last-name" className="block text-sm font-semibold text-gray-900">
                    Apellidos
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={lastName}
                      onChange={e => setLastName(sanitizeText(e.target.value))}
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                    Correo electrónico
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={e => setEmail(sanitizeEmail(e.target.value))}
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="phone-number"
                    className="block text-sm font-semibold text-gray-900"
                  >
                    Teléfono (opcional)
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="phone-number"
                      name="phone-number"
                      type="tel"
                      autoComplete="tel"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(sanitizePhone(e.target.value))}
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900">
                    Mensaje
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={message}
                      onChange={e => setMessage(sanitizeText(e.target.value))}
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm focus:outline-2 focus:outline-indigo-600 ${
                    loading ? "cursor-not-allowed opacity-50" : "hover:bg-indigo-500"
                  }`}
                >
                  {loading ? <LoadingMoon color="#fff" /> : "Enviar mensaje"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
