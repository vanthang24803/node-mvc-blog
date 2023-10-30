import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "./layout";
import { UpdateContainer } from "./components/update-container";
import { useEffect, useState } from "react";
import { useUser } from "./components/provider/user-provider";
import { useModal } from "./hooks/use-modal-store";
import { Button } from "./components/ui/button";

export const Update = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [data, setData] = useState(null);
  const { onOpen } = useModal();
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_URL_API}/post/${id}`)
      .then((respone) => {
        setData(respone.data);
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <Layout>
      {user ? (
        <UpdateContainer data={data} />
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
    </Layout>
  );
};
