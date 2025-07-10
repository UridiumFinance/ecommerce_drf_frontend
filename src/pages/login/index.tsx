import SEO, { SEOProps } from "@/components/pages/SEO";
import Layout from "@/hocs/Layout";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import LoadingMoon from "@/components/loaders/LoadingMoon";
import { ToastError, ToastSuccess } from "@/components/toast/alerts";
import { loadProfile, loadUser, setLoginSuccess } from "@/redux/actions/auth/actions";
import { SendOTPEmail, SendOTPEmailProps } from "@/utils/api/auth/SendOTPEmail";
import verifyOTPLogin, { SendVerifyOTPLoginProps } from "@/utils/api/auth/VerifyOTPLogin";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { UnknownAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { syncCart } from "@/redux/actions/cart/actions";

const SEOList: SEOProps = {
  title: "Iniciar sesión en SoloPython",
  description:
    "Accede a tu cuenta en SoloPython para continuar aprendiendo programación en Python con tus cursos y recursos favoritos.",
  keywords: "login, iniciar sesión, acceso, cuenta SoloPython, aprender Python",
  href: "/login",
  robots: "noindex, nofollow",
  author: "SoloPython",
  publisher: process.env.DOMAIN_NAME || "solopython.com",
  image: "/assets/img/thumbnails/default_thumbnail.jpg",
  twitterHandle: "@solopython",
};

export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [otp, setOTP] = useState<string>("");

  const [step, setStep] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(false);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sendOTPEmailData: SendOTPEmailProps = {
      email,
    };

    try {
      setLoading(true);
      const res = await SendOTPEmail(sendOTPEmailData);
      if (res.status === 200) {
        setStep(2);
        ToastSuccess("We have sent you an email with your otp code.");
      } else {
        setEmail("");
      }
    } catch (err) {
      ToastError(`${err}`);
    } finally {
      setLoading(false);
    }
  };

  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();
  const router = useRouter();

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sendVerifyOTPLoginData: SendVerifyOTPLoginProps = {
      email,
      otp,
    };

    try {
      setLoading(true);
      const res = await verifyOTPLogin(sendVerifyOTPLoginData);
      if (res.status === 200) {
        await dispatch(loadProfile());
        await dispatch(loadUser());
        await dispatch(syncCart());
        await dispatch(setLoginSuccess());
        ToastSuccess("Login successfull.");
        router.push("/");
      } else {
        setEmail("");
        setOTP("");
      }
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
          Sign in to your account
        </h2>
      </div>

      {step === 1 && (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleOnSubmit} className="space-y-6">
            <FormInput data={email} setData={setEmail} type="email" kind="email" title="Email" />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <LoadingMoon /> : "Sign in"}
            </Button>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{" "}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Register here
            </Link>
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleOTPSubmit} className="space-y-6">
            <FormInput data={otp} setData={setOTP} type="text" kind="text" title="OTP COde" />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <LoadingMoon /> : "Sign in"}
            </Button>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{" "}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Register here
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
