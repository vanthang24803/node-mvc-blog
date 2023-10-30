import { useEffect } from "react";
import axios from "axios";
import { Logo } from "./logo";
import NavMenu from "./nav-menu";
import { useUser } from "./provider/user-provider";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, setUser } = useUser();
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_URL_API}/profile`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data )
        setUser(response.data);
      });
  }, []);

  const logOut = () => {
    fetch(`${import.meta.env.VITE_URL_API}/logout`, {
      credentials: "include",
      method: "POST",
    });
    setUser(null);
    toast.success("Success");
  };

  return (
    <nav className="w-full z-20 fixed flex lg:px-12 md:px-8 items-center justify-between px-4 py-4 border-b-[1px] dark:border-gray-400 border-gray-200 bg-white dark:bg-black ">
      <Logo />
      <NavMenu currentUser={user} logOut={logOut} />
    </nav>
  );
};

export default Navbar;
