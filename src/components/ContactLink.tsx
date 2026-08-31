"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { scrollToContact } from "@/lib/scroll-to-contact";

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
    e.preventDefault();

    if (pathname === "/" && scrollToContact()) {
      window.history.replaceState(null, "", "/#kontakt");
      return;
    }

    router.push("/#kontakt");
  }

  return (
    <Link href="/#kontakt" className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
