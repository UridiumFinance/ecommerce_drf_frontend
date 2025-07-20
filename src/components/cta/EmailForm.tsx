import { useState } from "react";
import newsletterSignup, { NewsLetterSignupProps } from "@/utils/api/newsletter/newsletterSignup";
import { ToastError, ToastSuccess } from "../toast/alerts";
import LoadingMoon from "../loaders/LoadingMoon";
import Button from "../Button";
import EditEmail from "../forms/EditEmail";

export default function EmailForm() {
  const [email, setEmail] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubscribe = async (event: any) => {
    event.preventDefault();

    const formData: NewsLetterSignupProps = {
      email,
    };

    try {
      setLoading(true);
      const res = await newsletterSignup(formData);
      if (res.status === 200) {
        ToastSuccess("Welcome to our newsletter! We are excited to have you on board.");
      } else {
        ToastError(res.detail);
      }
    } catch (e) {
      ToastError("Error subscribing to newsletter");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    inputValue = inputValue
      .replace(/<script.*?>.*?<\/script>/gi, "") // Remover script tags
      .replace(/<\/?[^>]+(>|$)/g, "") // Remover HTML tags
      .replace(/[;:"!]/g, ""); // Remueve ; : " !

    setEmail(inputValue);
  };

  return (
    <div>
      <form onSubmit={handleSubscribe} className="mt-6 sm:flex sm:max-w-md">
        <input
          id="email-address"
          name="email-address"
          type="email"
          required
          autoComplete="email"
          disabled={loading}
          placeholder="e.g yourname@email.com"
          value={email}
          onChange={handleInputChange}
          className="outline-color-border placeholder:text-color-subtext focus:outline-color-secondary text-color-text w-full min-w-0 rounded-md px-3 py-1.5 text-base outline outline-1 -outline-offset-1 focus:outline focus:outline-2 focus:-outline-offset-2 sm:w-64 sm:text-sm/6 xl:w-full"
        />

        <div className="mt-4 sm:mt-0 sm:ml-4 sm:shrink-0">
          <Button type="submit" disabled={loading}>
            {loading ? <LoadingMoon color="#fff" /> : "Subscribe"}
          </Button>
        </div>
      </form>
    </div>
    // <form className="mt-6 sm:flex sm:max-w-md">
    //               <input
    //                 id="email-address"
    //                 name="email-address"
    //                 type="email"
    //                 required
    //                 placeholder="Enter your email"
    //                 autoComplete="email"
    //                 className="outline-color-border placeholder:text-color-subtext focus:outline-color-secondary text-color-text w-full min-w-0 rounded-md px-3 py-1.5 text-base outline outline-1 -outline-offset-1 focus:outline focus:outline-2 focus:-outline-offset-2 sm:w-64 sm:text-sm/6 xl:w-full"
    //               />
    //               <div className="mt-4 sm:mt-0 sm:ml-4 sm:shrink-0">
    //                 <Button>Subscribe</Button>
    //               </div>
    //             </form>
  );
}
