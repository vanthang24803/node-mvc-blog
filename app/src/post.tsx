import { useEffect } from "react";
import PostContainer from "./components/post-container";
import Layout from "./layout";
import { useNavigate } from "react-router-dom";

const Post = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "m" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        navigate("/post");
      }
    };

    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Layout>
      <PostContainer />
    </Layout>
  );
};

export default Post;
