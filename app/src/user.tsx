import { ModalProvider } from "./components/modal/modal-provider";
import Navbar from "./components/navbar";
import { Profile } from "./components/profile";
import { ThemeProvider } from "./components/provider/theme-provider";
import { ToastProvider } from "./components/provider/toast-provider";

export const User = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navbar />
      <ModalProvider />
      <ToastProvider />
      <div className="lg:px-44 px-4 md:px-16">
        <Profile />
      </div>
    </ThemeProvider>
  );
};
