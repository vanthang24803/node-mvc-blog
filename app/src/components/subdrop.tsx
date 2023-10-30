import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Blog } from "type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash, Settings, MoreHorizontal } from "lucide-react";
import { useBlog } from "./provider/blog-provider";
import axios from "axios";
import { useUser } from "./provider/user-provider";

interface SubDropProps {
  blog: Blog;
}

export const SubDrop = ({ blog }: SubDropProps) => {
  const { setBlog } = useBlog();
  const { user } = useUser();
  const onRemove = async () => {
    try {
      toast.loading("Waiting 🚀");
      const response = await fetch(
        `${import.meta.env.VITE_URL_API}/post/${blog._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        axios
          .get(`${import.meta.env.VITE_URL_API}/profile/${user?._id}`)
          .then((response) => {
            if (Array.isArray(response.data)) {
              setBlog(response.data);
            }
          })
          .catch((err) => console.log(err));
        toast.dismiss();
        toast.success("Success");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong!");
    } finally {
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <Link to={`/update/${blog._id}`}>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              <span>Update</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={onRemove}>
            <Trash className="w-4 h-4 mr-2" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
