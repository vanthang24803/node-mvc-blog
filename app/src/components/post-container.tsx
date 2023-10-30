import toast from "react-hot-toast";
import { Input } from "./ui/input";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "./ui/button";
import { useUser } from "./provider/user-provider";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "./ui/label";
import { useState } from "react";

const modalQill = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const PostContainer = () => {
  const { user } = useUser();

  const { onOpen } = useModal();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<FileList | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("description", description);
    if (file) {
      data.append("image", file[0]);
    }
    data.set("content", content);
    try {
      toast.loading("Waiting 🚀");
      const response = await fetch(`${import.meta.env.VITE_URL_API}/post`, {
        method: "POST",
        body: data,
        credentials: "include",
      });

      if (response.ok) {
        toast.dismiss();
        window.location.href = "/";
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
    <>
      {user ? (
        <div className="flex flex-col md:space-y-8 space-y-4">
          <div className="flex flex-col space-y-2 lg:py-4">
            <h4 className="text-4xl font-medium">Getting Started</h4>
            <span className="text-[16.5px] text-slate-600">
              👋 Welcome to Blog!
            </span>
            <span className="text-slate-500  items-center space-x-3 lg:block hidden">
              <b className="mr-1">👉 **Have a question?**</b> Click the `?` at
              the bottom right for more guides, or to send us a message.
            </span>
          </div>

          <form className="space-y-6 pb-6" onSubmit={onSubmit}>
            <div className="space-y-4 px-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-zinc-100/60 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                  placeholder="Enter title here..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  type="description"
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-zinc-100/60 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                  placeholder="Enter description here..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  name="image"
                  onChange={(e) => setFile(e.target.files)}
                  className="bg-zinc-100/60 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <ReactQuill
                  theme="snow"
                  id="content"
                  modules={modalQill}
                  value={content}
                  onChange={setContent}
                />
              </div>
              <Button className="lg:w-[260px] md:w-[200px] w-full">
                Submit
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col space-y-4 md:space-y-2 lg:space-y-0">
          <div className="flex flex-col space-y-2 lg:py-4 items-center justify-center">
            <h4 className="text-4xl font-medium">👋Welcome</h4>
            <span className="text-lg text-slate-600">
              You need login to create blog! 🙏
            </span>
          </div>
          <Button
            className="lg:w-[250px] md:w-[280px] w-full"
            onClick={() => onOpen("login")}
          >
            Login Here 🚀
          </Button>
        </div>
      )}
    </>
  );
};

export default PostContainer;
