import { Link } from "react-router-dom";
import { Blog } from "type";
import { MoveLeft } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SocialShare } from "./social-share";
import { useUser } from "./provider/user-provider";

interface BlogContainerProps {
  blog: Blog | null;
}

export const BlogContainer = ({ blog }: BlogContainerProps) => {
  const { user } = useUser();
  return (
    <div className="flex flex-col lg:space-y-8 md:space-y-6 space-y-4 pb-10">
      <Link to="/" className="flex items-center space-x-4 group">
        <MoveLeft className="group-hover:-translate-x-2 transition-all ease-in-out" />
        <span className="text-neutral-600 group-hover:text-neutral-800">
          All posts
        </span>
      </Link>
      <div className="flex flex-col space-y-4 lg:px-20 ">
        <div className="text-neutral-500 flex items-center space-x-1 text-sm">
          <span>Published</span>
          <span>
            {blog?.updatedAt
              ? format(new Date(blog?.updatedAt), "MMMM dd, yyyy")
              : ""}{" "}
            in
          </span>
          {blog?.author._id == user?._id ? (
            <Link to="/infomation">
              <span className="underline hover:text-blue-500">
                Personal Blog
              </span>
            </Link>
          ) : (
            <Link to={`/profile/${blog?.author._id}`}>
              <span className="underline hover:text-blue-500">
                Personal Blog
              </span>
            </Link>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">{blog?.title}</h1>
        <div className="flex items-center space-x-4">
          <Avatar className="hover:cursor-pointer">
            <AvatarImage
              src={blog?.author.imageUrl || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              By {blog?.author.lastName} {blog?.author.firstName}
            </span>
            <span className="text-xs text-neutral-500">Bloger</span>
          </div>
        </div>

        <p className="lg:text-lg">{blog?.description}</p>
        <img src={blog?.image} alt="image" className="w-full object-cover" />
        <div
          className="pb-10"
          dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
        />
        <SocialShare />
      </div>
    </div>
  );
};
