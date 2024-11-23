import "./globals.css";
import { ReactQueryProvider } from "./providers";
import { cookies } from "next/headers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userLocale = cookies().get("NEXT_LOCALE")?.value || "en";

  return (
    <html lang={userLocale}>
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
