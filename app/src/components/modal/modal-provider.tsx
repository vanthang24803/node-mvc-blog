import { useEffect, useState } from "react";
import { LoginModal } from "./login-modal";
import RegisterModal from "./register-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <LoginModal />
      <RegisterModal />
    </>
  )
};
