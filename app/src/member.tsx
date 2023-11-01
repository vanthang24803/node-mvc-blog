import { useParams } from "react-router-dom";
import Layout from "./layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Blog, UserType } from "type";
import { Card } from "./components/card";
import { CardLoading } from "./components/card-loading";

export const Member = () => {
  const [currentTab, setCurrentTab] = useState("Posts");
  const [member, setMember] = useState<UserType | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_URL_API}/member/${id}`)
      .then((response) => {
        setMember(response.data);
        setBlogs(response.data.posts);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const { id } = useParams();

  return (
    <Layout>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-x-4 pb-10 border-b">
          <img
            src="https://endurable-marjoram-e5c.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fa16250a3-0458-4a30-85fc-e39e02770b1e%2F2.png?table=block&id=5a9f5aa9-d3d6-4af9-8d40-88f0d40cc9ec&spaceId=b0a33545-3f07-44a6-a0a9-6cb561fd8650&width=2000&userId=&cache=v2"
            alt="billboard"
            className="lg:h-[320px] md:h-[250px] h-[200px] object-cover w-full rounded-md"
          />
          <div className="flex w-full justify-center items-center ">
            <div className="border-4 border-white rounded-full absolute">
              <img
                src={
                  member?.imageUrl ||
                  "https://scontent.fhan3-1.fna.fbcdn.net/v/t39.30808-1/338811183_744515227275476_4602096052407324602_n.jpg?stp=c59.0.320.320a_dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFQeFuUBXvdp7ja0aNKKUumucJq3RmBK_y5wmrdGYEr_LH85fl5-FyhusxH2rtboixAJDEgBsuT_fUvkq9d9yCr&_nc_ohc=t3LfmUZ4BM0AX8foqso&_nc_ht=scontent.fhan3-1.fna&oh=00_AfBhaZ1VY_xMIgkVtCvQzHdtoJrMI45W3RK-iW99PCaRpA&oe=65447581"
                }
                alt="avt"
                className="rounded-full object-fill w-[168px] h-[168px] "
              />
            </div>
          </div>
          <div className="text-xl md:text-3xl font-bold mt-24 flex items-center justify-center">
            <span className="md:ml-4 ml-3">
              {member?.firstName} {member?.lastName}
            </span>
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
            {blogs.length != 0 ? (
              <div className="my-20 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                {loading ? (
                  <CardLoading />
                ) : (
                  <Card data={blogs} idMember={id} />
                )}
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
                  {member?.firstName} {member?.lastName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold"> Email :</span>
                <span className="text-sm hover:underline cursor-pointer">
                  {member?.email}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
