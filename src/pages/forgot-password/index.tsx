import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import LoadingMoon from "@/components/loaders/LoadingMoon";
import SEO, { SEOProps } from "@/components/pages/SEO";
import { ToastError } from "@/components/toast/alerts";
import Layout from "@/hocs/Layout";
import { forgotPassword } from "@/redux/actions/auth/actions";
import { IForgotPasswordProps } from "@/redux/actions/auth/interfaces";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { UnknownAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

const SEOList: SEOProps = {
  title: "Recuperar contraseña | SoloPython",
  description:
    "¿Olvidaste tu contraseña? Recupera el acceso a tu cuenta en SoloPython y sigue aprendiendo programación en Python sin interrupciones.",
  keywords: "recuperar contraseña, olvidar contraseña, restablecer acceso, SoloPython",
  href: "/forgot-password",
  robots: "noindex, nofollow",
  author: "SoloPython",
  publisher: process.env.DOMAIN_NAME || "solopython.com",
  image: "/assets/img/thumbnails/default_thumbnail.jpg",
  twitterHandle: "@solopython",
};

export default function Page() {
  const [email, setEmail] = useState<string>("");

  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const forgotPasswordData: IForgotPasswordProps = {
      email,
    };

    try {
      setLoading(true);
      await dispatch(forgotPassword(forgotPasswordData));
    } catch (err) {
      ToastError(`${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <SEO {...SEOList} />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Forgot your password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleOnSubmit} className="space-y-6">
          <FormInput data={email} setData={setEmail} type="email" kind="email" title="Email" />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <LoadingMoon /> : "Recover account"}
          </Button>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already a member?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
