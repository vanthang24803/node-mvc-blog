import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const Warning = () => {
  return (
    <div className="flex flex-col space-y-2 items-center justify-center">
      <img
        src="https://www.notion.so/cdn-cgi/image/format=webp,width=256/front-static/pages/home/docs-illo.png"
        alt="error"
        className="md:w-1/5 w-1/2"
      />
      <h1 className="text-3xl font-bold">Warning 🚧</h1>
      <span className="text-neutral-600">
        You do not have sufficient rights to modify this content!
      </span>
      <Link to="/">
        <Button>Back to home </Button>
      </Link>
    </div>
  );
};
