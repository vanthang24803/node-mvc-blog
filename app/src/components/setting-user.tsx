import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Settings } from "lucide-react";
import { useUser } from "./provider/user-provider";
import { ChangeEvent, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import toast from "react-hot-toast";
import axios from "axios";

export const SettingUser = () => {
  const { user, setUser } = useUser();
  const [image, setImage] = useState<File | null>(null);
  const defaultImageUrl =
    "https://scontent.fhan3-1.fna.fbcdn.net/v/t39.30808-1/338811183_744515227275476_4602096052407324602_n.jpg?stp=c59.0.320.320a_dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFQeFuUBXvdp7ja0aNKKUumucJq3RmBK_y5wmrdGYEr_LH85fl5-FyhusxH2rtboixAJDEgBsuT_fUvkq9d9yCr&_nc_ohc=t3LfmUZ4BM0AX8foqso&_nc_ht=scontent.fhan3-1.fna&oh=00_AfBhaZ1VY_xMIgkVtCvQzHdtoJrMI45W3RK-iW99PCaRpA&oe=65447581";
  const [imageUrl, setImageUrl] = useState<string>(
    user?.imageUrl || defaultImageUrl
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setImage(file);

    if (file) {
      setImageUrl(URL.createObjectURL(file));
    } else {
      setImageUrl("");
    }
  };

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    data.append("firstName", firstName);
    data.append("lastName", lastName);
    data.append("email", email);
    if (image) {
      data.append("image", image);
    }

    try {
      toast.loading("Waiting 🚀");
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_URL_API}/profile/${user?._id}`,
        {
          method: "PUT",
          body: data,
          credentials: "include",
        }
      );
      if (response.ok) {
        axios
          .get(`${import.meta.env.VITE_URL_API}/profile`, {
            withCredentials: true,
          })
          .then((response) => {
            console.log(response.data);
            setUser(response.data);
          });
        toast.dismiss();
        toast.success("Success");
        setLoading(false);
        setOpen(!open);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong!");
      setLoading(false);
    } finally {
      setTimeout(() => {
        toast.dismiss();
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <>
      <div className="md:block hidden">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="bg-blue-500 hover:bg-blue-400 space-x-2">
              <Settings className="w-3 h-3" />
              <span>Update Infomations</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Infomations</DialogTitle>
              <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
                <div className="flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    id="upload-button"
                    name="image"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="upload-button">
                    <img
                      src={imageUrl || defaultImageUrl}
                      alt="avt"
                      className="rounded-full object-fill w-[168px] h-[168px] cursor-pointer"
                    />
                  </label>
                </div>
                <div>
                  <Label htmlFor="firstName">Firstname</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="firstName"
                    className="bg-zinc-100/60 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                    placeholder="Firstname..."
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Lastname</Label>
                  <Input
                    id="lastName"
                    type="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-zinc-100/60 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                    placeholder="Lastname..."
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    required
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-100/60 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                    placeholder="Email..."
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  Success
                </Button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="block md:hidden">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="bg-blue-500 hover:bg-blue-400 space-x-2">
              <Settings className="w-3 h-3" />
              <span>Settings</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Infomations</DialogTitle>
              <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
                <div className="flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    id="upload-button"
                    name="image"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="upload-button">
                    <img
                      src={imageUrl || defaultImageUrl}
                      alt="avt"
                      className="rounded-full object-fill w-[168px] h-[168px] cursor-pointer"
                    />
                  </label>
                </div>
                <div className="flex items-start flex-col space-y-2">
                  <Label htmlFor="firstName">Firstname</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="firstName"
                    className="bg-zinc-100/60 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                    placeholder="Firstname..."
                  />
                </div>
                <div className="flex items-start flex-col space-y-2">
                  <Label htmlFor="lastName">Lastname</Label>
                  <Input
                    id="lastName"
                    type="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-zinc-100/60 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                    placeholder="Lastname..."
                  />
                </div>
                <div className="flex items-start flex-col space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    required
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-100/60 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                    placeholder="Email..."
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  Success
                </Button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
