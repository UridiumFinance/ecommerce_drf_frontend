import LoadingMoon from "@/components/loaders/LoadingMoon";
import { ToastError, ToastSuccess } from "@/components/toast/alerts";
import { sendComplaint } from "@/utils/api/complaints/sendComplaint";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface ComponentProps {
  selectedMethod: any;
  currentStep: any;
  setCurrentStep: any;
  setSelectedMethod: any;
}

export default function Step2(props: ComponentProps) {
  const [sellerID, setSellerID] = useState<string>("");
  const [isValidSeller, setIsValidSeller] = useState<boolean>(false);
  const [loadingSellerValidation, setLoadingSellerValidation] = useState<boolean>(false);

  const handleChangeSellerID = (event: any) => {
    const value = event.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9@.+-_]/g, ""); // Allow only alphanumeric characters and @/./+/-/_

    setSellerID(sanitizedValue);
  };

  const handleValidateSeller = async (e: any) => {
    e.preventDefault();
    try {
      setLoadingSellerValidation(true);
      const res = await validateSeller({ sellerID });
      if (res.status === 200) {
        if (res.results === true) {
          setIsValidSeller(true);
        } else {
          ToastError("Invalid Seller ID");
        }
      } else {
        ToastError("Error validating seller");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingSellerValidation(false);
    }
  };

  let content;

  const [fullName, setFullName] = useState<string>("");
  const [lastNames, setLastNames] = useState<string>("");
  const [identification, setIdentification] = useState<string>("");
  const [telephone, setTelephone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [complaint, setComplaint] = useState<string>("");

  const handleChangeFullname = (event: any) => {
    const value = event.target.value;
    // Allow only alphanumeric characters, spaces, and @/./+/-/_
    const sanitizedValue = value.replace(/[^a-zA-Z0-9@.+-_ ]/g, "");
    setFullName(sanitizedValue);
  };

  const handleChangeLastname = (event: any) => {
    const value = event.target.value;
    // Allow only alphanumeric characters, spaces, and @/./+/-/_
    const sanitizedValue = value.replace(/[^a-zA-Z0-9@.+-_ ]/g, "");
    setLastNames(sanitizedValue);
  };

  const handleChangeGovID = (event: any) => {
    const value = event.target.value;
    // Allow only alphanumeric characters (no special characters)
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setIdentification(sanitizedValue);
  };

  const handleChangeTelephone = (event: any) => {
    const value = event.target.value;
    // Allow only numbers and hyphens
    const sanitizedValue = value.replace(/[^0-9-]/g, "");
    setTelephone(sanitizedValue);
  };

  const handleChangeEmail = (event: any) => {
    const value = event.target.value;
    // Basic email sanitization (allow letters, numbers, and typical email special characters)
    const sanitizedValue = value.replace(/[^a-zA-Z0-9@._-]/g, "");
    setEmail(sanitizedValue);
  };

  const handleChangeAddressLine1 = (event: any) => {
    setAddressLine1(event.target.value);
  };

  const handleChangeAddressLine2 = (event: any) => {
    setAddressLine2(event.target.value);
  };

  const handleChangeCity = (event: any) => {
    const value = event.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z ]/g, "");
    setCity(sanitizedValue);
  };

  const handleChangeState = (event: any) => {
    const value = event.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z ]/g, "");
    setState(sanitizedValue);
  };

  const handleChangeCountry = (event: any) => {
    const value = event.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z ]/g, "");
    setCountry(sanitizedValue);
  };

  const handleChangePostalCode = (event: any) => {
    const value = event.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setPostalCode(sanitizedValue);
  };

  const handleChangeComplaint = (event: any) => {
    setComplaint(event.target.value);
  };

  const [selectedApplication, setSelectedApplication] = useState<string>("");

  const applicationType = [
    {
      id: "complaint",
      title: "Complaint: Issues or dissatisfaction with the service provided by SoloPython staff.",
    },
    {
      id: "grievance",
      title:
        "Grievance: Problems or dissatisfaction related to products and/or services offered on SoloPython.",
    },
  ];

  const allFieldsFilled = () => {
    return (
      fullName.trim() !== "" &&
      lastNames.trim() !== "" &&
      identification.trim() !== "" &&
      telephone.trim() !== "" &&
      email.trim() !== "" &&
      addressLine1.trim() !== "" &&
      city.trim() !== "" &&
      state.trim() !== "" &&
      country.trim() !== "" &&
      postalCode.trim() !== "" &&
      selectedApplication.trim() !== "" &&
      complaint.trim() !== ""
    );
  };

  const [loadingSendComplaint, setLoadingSendComplaint] = useState<boolean>(false);
  const handleSendComplaint = async (e: any) => {
    e.preventDefault();

    if (!allFieldsFilled()) {
      ToastError("All fields must be filled!");
      return;
    }

    try {
      setLoadingSendComplaint(true);
      const res = await sendComplaint({
        fullName,
        lastNames,
        identification,
        telephone,
        email,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        postalCode,
        complaint,
        selectedApplication,
        selectedMethod: props.selectedMethod,
      });

      if (res.status === 201) {
        ToastSuccess("Complaint has been sent");
        // Reset form fields
        setFullName("");
        setLastNames("");
        setIdentification("");
        setTelephone("");
        setEmail("");
        setAddressLine1("");
        setAddressLine2("");
        setCity("");
        setState("");
        setCountry("");
        setPostalCode("");
        setComplaint("");
        setSelectedApplication("");
        props.setCurrentStep(1);
        props.setSelectedMethod("");
      } else if (res.status === 400) {
        ToastError(res.error);
      } else {
        ToastError(t("Error sending complaint"));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingSendComplaint(false);
    }
  };

  function formContent() {
    return (
      <form onSubmit={handleSendComplaint} className="">
        <button
          type="button"
          onClick={() => props.setCurrentStep(props.currentStep - 1)}
          className="mb-4 flex items-center font-medium text-gray-600 transition-colors hover:text-indigo-600"
        >
          <ChevronLeftIcon className="mr-2 h-5 w-5" aria-hidden="true" />
          Volver
        </button>
        <div className="rounded bg-indigo-400 p-3 font-semibold text-white">1. Personal Data</div>

        <div className="mt-4 grid grid-cols-3 space-x-2">
          <div>
            <input
              className="dark:bg-dark-second w-full bg-gray-100 p-3 outline-none sm:w-auto sm:flex-grow"
              type="text"
              value={identification}
              name="identification"
              required
              onChange={handleChangeGovID}
              placeholder="Gov. ID"
            />
          </div>
          <input
            className="dark:bg-dark-second w-full bg-gray-100 p-3 outline-none sm:w-auto sm:flex-grow"
            type="text"
            value={fullName}
            name="fullName"
            required
            onChange={handleChangeFullname}
            placeholder="Names"
          />
          <input
            className="dark:bg-dark-second w-full bg-gray-100 p-3 outline-none sm:w-auto sm:flex-grow"
            type="text"
            value={lastNames}
            name="lastNames"
            required
            onChange={handleChangeLastname}
            placeholder="Last Names"
          />
        </div>
        <div className="my-4 grid grid-cols-12 space-x-2">
          <input
            className="dark:bg-dark-second col-span-4 w-full bg-gray-100 p-3 outline-none sm:w-auto sm:flex-grow"
            type="text"
            value={telephone}
            name="telephone"
            required
            onChange={handleChangeTelephone}
            placeholder="Telephone"
          />
          <input
            className="dark:bg-dark-second col-span-8 w-full bg-gray-100 p-3 outline-none sm:w-auto sm:flex-grow"
            type="text"
            value={email}
            name="email"
            required
            onChange={handleChangeEmail}
            placeholder="Email"
          />
        </div>

        <div className="rounded bg-indigo-400 p-3 font-semibold text-white">2. Address</div>

        <div className="mt-4 grid grid-cols-4 space-x-2">
          <input
            className="dark:bg-dark-second w-full bg-gray-100 p-3 outline-none sm:w-auto sm:flex-grow"
            type="text"
            value={country}
            name="country"
            required
            onChange={handleChangeCountry}
            placeholder="Country"
          />
          <input
            className="dark:bg-dark-second w-full bg-gray-100 p-3 outline-none sm:w-auto sm:flex-grow"
            type="text"
            value={city}
            name="city"
            required
            onChange={handleChangeCity}
            placeholder="City"
          />
          <input
            className="dark:bg-dark-second w-full bg-gray-100 p-3 outline-none sm:w-auto sm:flex-grow"
            type="text"
            value={state}
            name="state"
            required
            onChange={handleChangeState}
            placeholder="State/Province/Region"
          />

          <input
            className="dark:bg-dark-second w-full bg-gray-100 p-3 outline-none sm:w-auto sm:flex-grow"
            type="text"
            value={postalCode}
            name="postalCode"
            required
            onChange={handleChangePostalCode}
            placeholder="Postal Code"
          />
        </div>
        <div className="my-4 grid grid-cols-2 space-x-2">
          <input
            className="dark:bg-dark-second w-full bg-gray-100 p-3 outline-none sm:w-auto sm:flex-grow"
            type="text"
            value={addressLine1}
            name="addressLine1"
            required
            onChange={handleChangeAddressLine1}
            placeholder="Address Line 1"
          />
          <input
            className="dark:bg-dark-second w-full bg-gray-100 p-3 outline-none sm:w-auto sm:flex-grow"
            type="text"
            value={addressLine2}
            name="addressLine2"
            onChange={handleChangeAddressLine2}
            placeholder="Address Line 2"
          />
        </div>

        <div className="rounded bg-indigo-400 p-3 font-semibold text-white">3. Details</div>

        <p className="mt-6">What type of application do you want to enter?</p>

        <fieldset>
          <div className="mt-4 space-y-2">
            {applicationType.map((application: any) => (
              <div key={application.id} className="flex items-center">
                <input
                  id={application.id}
                  name="notification-method"
                  type="radio"
                  checked={selectedApplication === application.id}
                  onChange={() => setSelectedApplication(application.id)}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor={application.id}
                  className="dark:text-dark-txt ml-3 block text-sm leading-6 text-gray-900"
                >
                  {application.title}
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <p className="mt-6">How can we help you?</p>

        <textarea
          className="dark:bg-dark-second mt-4 w-full bg-gray-100 p-3 outline-none sm:flex-grow"
          value={complaint}
          name="complaint"
          required
          onChange={handleChangeComplaint}
          placeholder="Describe your complaint"
          rows={5}
        />

        <div className="mx-auto mt-6 flex max-w-2xl items-center justify-center">
          <button
            type="submit"
            className="h-12 w-56 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-500"
            disabled={!allFieldsFilled() || loadingSendComplaint}
          >
            {loadingSendComplaint ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    );
  }

  switch (props.selectedMethod) {
    case "seller":
      content = (
        <div>
          {props.currentStep === 2 && (
            <>
              <button
                type="button"
                onClick={() => props.setCurrentStep(props.currentStep - 1)}
                className="mb-4 flex items-center font-medium text-gray-600 transition-colors hover:text-indigo-600"
              >
                <ChevronLeftIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                Volver
              </button>
              <p className="dark:text-dark-txt-secondary">
                Please validate your username to continue. Remember that if you have a claim or
                complaint in process you will not be able to register a new one until it has been
                closed.
              </p>
              <div className="my-6">
                <form
                  onSubmit={handleValidateSeller}
                  className="flex w-full flex-col items-center sm:w-96 sm:flex-row"
                >
                  <input
                    className="dark:bg-dark-second w-full bg-gray-100 p-3 outline-none sm:w-auto sm:flex-grow"
                    type="text"
                    value={sellerID}
                    name="sellerID"
                    required
                    onChange={handleChangeSellerID}
                    placeholder="Seller ID"
                  />
                  <button
                    type="submit"
                    disabled={loadingSellerValidation}
                    className="bg-opacity-20 hover:bg-opacity-30 dark:bg-dark-main dark:hover:bg-opacity-40 h-12 w-40 rounded-md border-2 border-purple-200 font-bold hover:border-pink-300 focus:border-pink-300 focus:outline-none sm:ml-4 dark:border-purple-400 dark:hover:border-purple-500 dark:focus:border-purple-500"
                  >
                    {loadingSellerValidation ? <LoadingMoon size={14} color="#000" /> : "Validate"}
                  </button>
                </form>
              </div>
              {isValidSeller && formContent()}
            </>
          )}
        </div>
      );
      break;
    case "buyer":
      content = (
        <div>
          {/* <p>Information for buyers: Please provide details about your purchase.</p> */}
          {formContent()}
        </div>
      );
      break;
    case "affiliate":
      content = (
        <div>
          {/* <p>
            Information for affiliates: Please provide details about your affiliation and the
            product.
          </p> */}
          {formContent()}
        </div>
      );
      break;
    case "anonymous":
      content = (
        <div>
          {/* <p>Information for anonymous users: Please provide details about your issue.</p> */}
          {formContent()}
        </div>
      );
      break;
    default:
      content = (
        <div>
          <p>Please select an option to proceed.</p>
          {/* {formContent()} */}
        </div>
      );
  }

  return <div className="mt-12">{content}</div>;
}
