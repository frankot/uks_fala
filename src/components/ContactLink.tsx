"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

interface ContactLinkProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function ContactLink({
  children,
  className,
  onClick,
}: ContactLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.();

    const target = document.getElementById("kontakt");
    if (pathname === "/" && target) {
      e.preventDefault();
      const navOffset = 96;
      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const centeredTop =
        targetTop - (window.innerHeight - target.offsetHeight) / 2 - navOffset / 2;
      window.scrollTo({
        top: Math.max(0, centeredTop),
        behavior: "smooth",
      });
      window.history.replaceState(null, "", "/#kontakt");
      return;
    }

    e.preventDefault();
    router.push("/#kontakt");
  }

  return (
    <Link href="/#kontakt" className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
