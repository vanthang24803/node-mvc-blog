import axios from "axios";
import { useEffect, useState } from "react";
import Container from "./components/container";
import Layout from "./layout";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const fetchPosts = (page: number) => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_URL_API}/posts?page=${page}`)
      .then((response) => {
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);
  return (
    <Layout>
      <Container
        blogs={posts}
        currentPage={currentPage}
        totalPage={totalPages}
        onPageChange={setCurrentPage}
        loading={loading}
      />
    </Layout>
  );
}

export default App;
