import React from "react";
import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <div className="flex justify-between items-center text-foreground">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/upintown.svg"
          alt="Up In Town Logo"
          width={48}
          height={48}
        />
      </Link>
      {/* Navbar */}
      <div className="flex items-center gap-12 font-medium">
        <Link
          href="/"
          className="hover:text-foreground/40 transition-all duration-300"
        >
          Home
        </Link>
        <Link
          href="/work"
          className="hover:text-foreground/40 transition-all duration-300"
        >
          Work
        </Link>
        <Link
          href="/about"
          className="hover:text-foreground/40 transition-all duration-300"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="hover:text-foreground/40 transition-all duration-300"
        >
          Contact
        </Link>
      </div>
    </div>
  );
}

export default Header;
