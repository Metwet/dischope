import type { Metadata } from "next";
import MainLayout from "./layouts/main-layout";

export const metadata: Metadata = {
  title: "deschope",
  description: "by metwet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
