import Footer from "@/features/footer";
import Navbar from "@/features/navbar";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";

import TermsFooter from "@/components/pages/terms/Footer";
import TermNavigationItem from "@/components/pages/terms/TermNavitationItem";

interface PageProps {
  children: React.ReactNode;
}

export default function TermsLayout({ children }: PageProps) {
  const router = useRouter();

  const sections = [
    {
      title: "Terms of Use",
      href: "/terms",
      current: router.pathname === "/terms",
    },
    {
      title: "Privacy Policy",
      href: "/terms/privacy",
      current: router.pathname === "/terms/privacy",
    },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>

                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                  <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul className="-mx-2 mt-8 space-y-1">
                          {sections.map(section => (
                            <TermNavigationItem key={section.href} section={section} />
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <Navbar />

      <div>
        {/* Static sidebar for desktop */}
        <div className="lg:grid lg:grid-cols-12">
          <div className="sticky top-0 col-span-2 mt-1 hidden h-screen space-y-1 overflow-y-auto border-r border-gray-200 py-4 lg:block">
            {sections.map(section => (
              <TermNavigationItem key={section.href} section={section} />
            ))}
          </div>

          <div className="p-4 lg:hidden">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="col-span-9 p-12">
            <div className="mx-auto max-w-7xl">
              <div className="mx-auto max-w-7xl">{children}</div>
            </div>
            <div className="py-8">
              <TermsFooter sections={sections} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
