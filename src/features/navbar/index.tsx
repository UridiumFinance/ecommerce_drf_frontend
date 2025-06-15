"use client";

import { useState } from "react";
import NavbarDesktop from "./desktop/NavbarDesktop";
import NavbarMobile from "./mobile/NavbarMobile";

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="">
      <NavbarDesktop navigation={navigation} setMobileMenuOpen={setMobileMenuOpen} />
      <NavbarMobile
        navigation={navigation}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </header>
  );
}
