import { useParams } from "react-router-dom";
import Layout from "./layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { BlogContainer } from "./components/blog-container";
export const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_URL_API}/post/${id}`)
      .then((respone) => {
        setBlog(respone.data);
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <Layout>
      <BlogContainer blog={blog} />
    </Layout>
  );
};
