import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import LoadingMoon from "@/components/loaders/LoadingMoon";
import SEO, { SEOProps } from "@/components/pages/SEO";
import { ToastError } from "@/components/toast/alerts";
import Layout from "@/hocs/Layout";
import usePasswordValidation from "@/hooks/usePasswordValidation";
import { register } from "@/redux/actions/auth/actions";
import { IRegisterProps } from "@/redux/actions/auth/interfaces";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { UnknownAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

const SEOList: SEOProps = {
  title: "Crea tu cuenta gratis | SoloPython",
  description:
    "Regístrate gratis en SoloPython y comienza a aprender programación en Python con cursos prácticos, proyectos y una comunidad activa.",
  keywords:
    "crear cuenta, registrarse, aprender Python, cursos Python, SoloPython, programación para principiantes",
  href: "/register",
  robots: "index, follow",
  author: "SoloPython",
  publisher: process.env.DOMAIN_NAME || "solopython.com",
  image: "/assets/img/thumbnails/default_thumbnail.jpg",
  twitterHandle: "@solopython",
};

export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");

  const { canSubmit, PasswordValidationText } = usePasswordValidation({
    username,
    password,
    rePassword,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmit) {
      ToastError("Ensure all fields in the form are complete and meet the requirements.");
      return;
    }

    const registerData: IRegisterProps = {
      email,
      username,
      first_name: firstName,
      last_name: lastName,
      password,
      re_password: rePassword,
    };

    try {
      setLoading(true);
      await dispatch(register(registerData));
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
          Create a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleOnSubmit} className="space-y-6">
          <FormInput data={email} setData={setEmail} type="email" kind="email" title="Email" />

          <FormInput
            data={username}
            setData={setUsername}
            type="text"
            kind="username"
            title="Username"
          />

          <FormInput
            data={firstName}
            setData={setFirstName}
            type="text"
            kind="text"
            title="First Name"
          />

          <FormInput
            data={lastName}
            setData={setLastName}
            type="text"
            kind="text"
            title="Last Name"
          />

          <FormInput
            data={password}
            setData={setPassword}
            type="password"
            kind="password"
            title="Password"
          />

          <FormInput
            data={rePassword}
            setData={setRePassword}
            type="password"
            kind="password"
            title="Repeat Password"
          />

          {PasswordValidationText()}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <LoadingMoon /> : "Register"}
          </Button>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Didn&apos;t receive the activation email?{" "}
          <Link
            href="/resend-activation"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Resend email
          </Link>
        </p>

        <p className="text-center text-sm/6 text-gray-500">
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
