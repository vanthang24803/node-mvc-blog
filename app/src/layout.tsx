import { ThemeProvider } from "@/components/provider/theme-provider";
import Navbar from "./components/navbar";
import { ModalProvider } from "./components/modal/modal-provider";
import { ToastProvider } from "./components/provider/toast-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navbar />
      <ModalProvider />
      <ToastProvider />
      <main className="pt-24 lg:px-44 px-4 md:px-16">{children}</main>
    </ThemeProvider>
  );
}
