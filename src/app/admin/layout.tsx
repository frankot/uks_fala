import { SessionProvider } from "./SessionProvider";

export const metadata = {
  title: "Admin — UKS Fala",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
