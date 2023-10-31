import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const ErrorPage = () => {
  return (
    <div className="flex flex-col space-y-4 items-center justify-center h-[100vh]">
      <img
        src="https://www.notion.so/cdn-cgi/image/format=auto,width=96,quality=100/front-static/pages/home/persona-carousel/icons/engineering-v2.png"
        alt="error"
      />
      <span className="text-neutral-600 ">Not found content!</span>
      <Link to="/">
        <Button>Back to home page</Button>
      </Link>
    </div>
  );
};
