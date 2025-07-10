import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/reducers";
import GuestLinks from "./GuestLinks";
import AuthLinks from "./AuthLinks";
import SearchBar from "../search/SearchBar";
import Cart from "../cart/Cart";

interface NavItem {
  name: string;
  href: string;
}

interface ComponentProps {
  navigation: NavItem[];
  setMobileMenuOpen: any;
}

export default function NavbarDesktop({ navigation, setMobileMenuOpen }: ComponentProps) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <nav
      aria-label="Global"
      className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8"
    >
      {/* Left */}
      <div className="flex items-center gap-x-6">
        <Link href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">Your Company</span>
          <img
            alt=""
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="h-8 w-auto"
          />
        </Link>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className="text-color-heading text-sm/6 font-semibold"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="flex-1">
        <div className="w-full">
          <SearchBar />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center justify-end gap-x-6">
        <Cart />
        {isAuthenticated ? <AuthLinks /> : <GuestLinks />}
      </div>

      {/* Mobile toggle */}
      <div className="flex lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="text-color-text -m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon aria-hidden="true" className="h-6 w-6" />
        </button>
      </div>
    </nav>
  );
}
