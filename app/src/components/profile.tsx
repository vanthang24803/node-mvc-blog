import { useEffect, useState } from "react";
import { useUser } from "./provider/user-provider";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card } from "./card";
import { useModal } from "@/hooks/use-modal-store";
import { SettingUser } from "./setting-user";

export const Profile = () => {
  const { user } = useUser();
  const { onOpen } = useModal();
  const [data, setData] = useState([]);
  const [currentTab, setCurrentTab] = useState("Posts");
  useEffect(() => {
    if (user?._id) {
      axios
        .get(`${import.meta.env.VITE_URL_API}/profile/${user._id}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <>
      {user ? (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-x-4 pb-10 border-b">
            <img
              src="https://thematchavibe.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F44c4cd8e-c037-49ed-9781-61e8138c6054%2FEthlu9nVgAAWY4U.jpeg?table=block&id=85948c1f-1d97-4ab2-b9a4-850c8fe94864&spaceId=d606c289-fea7-4e40-acdb-483697d91ac5&width=2000&userId=&cache=v2"
              alt="billboard"
              className="lg:h-[400px] md:h-[300px] h-[250px] object-cover w-full rounded-md"
            />
            <div className="flex w-full justify-center items-center ">
              <div className="border-4 border-white rounded-full absolute">
                <img
                  src={
                    user?.imageUrl ||
                    "https://scontent.fhan3-1.fna.fbcdn.net/v/t39.30808-1/338811183_744515227275476_4602096052407324602_n.jpg?stp=c59.0.320.320a_dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFQeFuUBXvdp7ja0aNKKUumucJq3RmBK_y5wmrdGYEr_LH85fl5-FyhusxH2rtboixAJDEgBsuT_fUvkq9d9yCr&_nc_ohc=t3LfmUZ4BM0AX8foqso&_nc_ht=scontent.fhan3-1.fna&oh=00_AfBhaZ1VY_xMIgkVtCvQzHdtoJrMI45W3RK-iW99PCaRpA&oe=65447581"
                  }
                  alt="avt"
                  className="rounded-full object-fill w-[168px] h-[168px] "
                />
              </div>
            </div>
            <div className="text-xl md:text-3xl font-bold mt-24 flex items-center justify-center">
              <span className="md:ml-4 ml-3">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <div className="md:flex hidden justify-center items-center space-x-3 mt-6">
              <Link to="/post">
                <Button className="space-x-2">
                  <Plus className="w-3 h-3" /> <span>Create new blog </span>
                </Button>
              </Link>
              <SettingUser />
            </div>
            <div className="flex md:hidden justify-center items-center space-x-3 mt-6">
              <Link to="/post">
                <Button className="space-x-2">
                  <Plus className="w-3 h-3" /> <span>Create</span>
                </Button>
              </Link>
              <SettingUser />
            </div>
          </div>

          <div className="flex flex-col space-x-8 hover:cursor-pointer">
            <div className="flex items-center space-x-4">
              <span
                className={`border-b-2 pb-2 ${
                  currentTab === "Posts"
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                onClick={() => setCurrentTab("Posts")}
              >
                Posts
              </span>
              <span
                className={`border-b-2 pb-2 ${
                  currentTab === "Introduce"
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                onClick={() => setCurrentTab("Introduce")}
              >
                Introduce
              </span>
            </div>
          </div>
          {currentTab == "Posts" && (
            <>
              {data.length != 0 ? (
                <div className="my-20 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                  <Card data={data} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 pb-2">
                  <img
                    src="https://www.notion.so/cdn-cgi/image/format=webp,width=256/front-static/pages/templates/pointing-at-frame-illustration.png"
                    alt="error"
                    className="lg:w-1/5"
                  />
                  <div className="flex flex-col space-y-4">
                    <span className="text-sm  text-neutral-500">
                      No blogs have been created yet
                    </span>
                    <Button className="md:w-[200px]">Create one</Button>
                  </div>
                </div>
              )}
            </>
          )}

          {currentTab == "Introduce" && (
            <div>
              <div className="mb-10 flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="font-bold"> Name :</span>
                  <span className="text-sm hover:underline cursor-pointer">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold"> Email :</span>
                  <span className="text-sm hover:underline cursor-pointer">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col space-y-4 md:space-y-2 lg:space-y-0">
          <div className="mt-24 flex flex-col space-y-2 lg:py-4 items-center justify-center">
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
