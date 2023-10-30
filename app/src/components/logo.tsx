import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/">
      <img src="../logo.svg" alt="logo" className="w-24 object-fill" />
    </Link>
  );
};
