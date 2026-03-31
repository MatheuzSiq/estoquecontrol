"use client";

import { useState } from "react";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import ProfileMenu from "./ProfileMenu";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Logo />

            {/* desktop menu */}
            <div className="hidden md:block">
              <NavLinks />
            </div>

            <div className="flex items-center gap-4">
              <ProfileMenu />

              {/* mobile button */}
              <button
                onClick={() => setOpen(true)}
                className="md:hidden text-gray-300 hover:text-white"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={open} setOpen={setOpen} />
    </>
  );
}
