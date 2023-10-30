import { Blog } from "type";
import { useUser } from "./provider/user-provider";
import { Warning } from "./warning";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "./ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

interface BlogContainerProps {
  data: Blog | null;
}

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

export const UpdateContainer = ({ data }: BlogContainerProps) => {
  const { user } = useUser();
  const [title, setTitle] = useState(data?.title || "");

  const [description, setDescription] = useState(data?.description || "");
  const [content, setContent] = useState(data?.content || "");
  const [file, setFile] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataSubmit = new FormData();
    dataSubmit.append("title", title);
    dataSubmit.append("description", description);
    dataSubmit.append("content", content);
    if (file) {
      dataSubmit.append("image", file[0]);
    }
    try {
      toast.loading("Waiting 🚀");
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_URL_API}/post/${data?._id}`,
        {
          method: "PUT",
          body: dataSubmit,
          credentials: "include",
        }
      );
      if (response.ok) {
        toast.dismiss();
        toast.success("Success");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      toast.error("Something went wrong!");
    } finally {
      setTimeout(() => {
        toast.dismiss();
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <>
      {user?._id == data?.author._id ? (
        <div className="flex flex-col md:space-y-8 space-y-4">
          <div className="flex flex-col space-y-2 lg:py-4">
            <h4 className="text-4xl font-medium">🚧 Update Blog</h4>
            <span className="text-[16.5px] text-slate-600">
              Update infotimations
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
                  value={title || data?.title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-zinc-100/60 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                  placeholder="Enter title here..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="description"
                  value={description || data?.description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-zinc-100/60 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                  placeholder="Enter description here..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <img src={data?.image} alt="image" />
                <Input
                  id="image"
                  type="file"
                  name="image"
                  onChange={(e) => setFile(e.target.files)}
                  className="bg-zinc-100/60 border-0 focus-visible:ring-0 text-black focus-visible:ring-offsetP-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <ReactQuill
                  theme="snow"
                  id="content"
                  modules={modalQill}
                  value={content || data?.content}
                  onChange={setContent || data?.content}
                />
              </div>
              <Button
                className="lg:w-[260px] md:w-[200px] w-full"
                disabled={loading}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Warning />
      )}
    </>
  );
};
