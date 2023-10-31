import { useModal } from "@/hooks/use-modal-store";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useUser } from "./provider/user-provider";

export const HeaderMain = () => {
  const { onOpen } = useModal();
  const { user } = useUser();

  return (
    <>
      <div className="lg:flex hidden space-x-5 md:flex-row flex-col space-y-6 items-center justify-center">
        <div className="flex flex-col space-y-3">
          <h1 className="lg:text-6xl md:text-4xl text-4xl font-bold">
            The next gen of notes and blogs.
          </h1>
          <span className="lg:text-lg text-base">
            Simple. Powerful. Beautiful. Communicate more efficiently with
            Notion’s flexible building blocks.
          </span>
          {user ? (
            <Link to="/post">
              <Button>Create new blog now ! 👏</Button>
            </Link>
          ) : (
            <Button onClick={() => onOpen("login")} className="md:w-1/2">
              Login Here 🚀
            </Button>
          )}
        </div>
        <img
          src="https://www.notion.so/cdn-cgi/image/format=auto,width=640,quality=100/front-static/pages/docs/docs-hero.png"
          alt="image"
          className="lg:w-full object-cover md:w-1/2 w-full"
        />
      </div>
      <div className="flex lg:hidden  flex-col space-y-6 items-center justify-center">
        <img
          src="https://www.notion.so/cdn-cgi/image/format=auto,width=640,quality=100/front-static/pages/docs/docs-hero.png"
          alt="image"
          className="md:w-[70%] w-full"
        />
        <div className="flex flex-col space-y-3">
          <h1 className="md:text-5xl text-4xl font-bold">
            The next gen of notes and blogs.
          </h1>
          <span className="lg:text-xl text-base">
            Simple. Powerful. Beautiful. Communicate more efficiently with
            Notion’s flexible building blocks.
          </span>
          {user ? (
            <Link to="/post">
              <Button>Create new blog now ! 👏</Button>
            </Link>
          ) : (
            <Button onClick={() => onOpen("login")}>Login Here 🚀</Button>
          )}
        </div>
      </div>
    </>
  );
};
