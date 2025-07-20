interface ComponentProps {
  notificationMethods: any;
  selectedMethod: any;
  setSelectedMethod: any;
  setCurrentStep: any;
}

export default function Step1(props: ComponentProps) {
  return (
    <div className="mx-auto max-w-full">
      <p className="dark:text-dark-txt-secondary mt-12 text-lg leading-8 text-gray-600">
        In accordance with the provisions of the Code of Consumer Protection and Defense, our
        company offers a virtual Complaints Book available to consumers.
      </p>
      <p className="dark:text-dark-txt-secondary mt-4 text-lg leading-8 text-gray-600">
        Due to the nature of our services, only individual buyers who purchase products for personal
        use and are in situations of information asymmetry are considered consumers. It is important
        to note that{" "}
        <strong>
          sellers and vendors who list products on Boomslag do not have a direct consumer
          relationship with our marketplace
        </strong>
        .
      </p>
      <p className="dark:text-dark-txt-secondary mt-4 text-lg leading-8 text-gray-600">
        Users who submit a claim or complaint online through www.boomslag.com and provide their data
        are informed that this information will be treated according to our Privacy Policy and
        Personal Data Use Policy, in order to respond to their communications within the legal
        timeframe.
      </p>
      <fieldset>
        <div className="mt-6 space-y-2">
          {props.notificationMethods.map((notificationMethod: any) => (
            <div key={notificationMethod.id} className="flex items-center">
              <input
                id={notificationMethod.id}
                name="notification-method"
                type="radio"
                checked={props.selectedMethod === notificationMethod.id}
                onChange={() => props.setSelectedMethod(notificationMethod.id)}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor={notificationMethod.id}
                className="dark:text-dark-txt ml-3 block text-sm leading-6 text-gray-900"
              >
                {notificationMethod.title}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      <p className="text-md dark:text-dark-txt-secondary mt-6 leading-8 text-gray-600">
        *If you have a claim or complaint in process, you will not be able to file another one until
        your case is closed.
      </p>
      <div className="mx-auto flex max-w-2xl items-center justify-center">
        <button
          type="button"
          onClick={() => {
            props.setCurrentStep(2);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="mt-4 h-12 w-56 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-500"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
