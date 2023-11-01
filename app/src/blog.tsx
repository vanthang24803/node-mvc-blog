import { useParams } from "react-router-dom";
import Layout from "./layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { BlogContainer } from "./components/blog-container";
import { PostLoading } from "./components/post-loading";
export const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_URL_API}/post/${id}`)
      .then((respone) => {
        setBlog(respone.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <Layout>{loading ? <PostLoading /> : <BlogContainer blog={blog} />}</Layout>
  );
};
