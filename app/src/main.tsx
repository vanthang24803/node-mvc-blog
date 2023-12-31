import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserContextProvider } from "./components/provider/user-provider.tsx";
import Post from "./post.tsx";
import { Blog } from "./blog.tsx";
import { User } from "./user.tsx";
import { Update } from "./update.tsx";
import { BlogContextProvider } from "./components/provider/blog-provider.tsx";
import { Member } from "./member.tsx";
import { ErrorPage } from "./components/error.tsx";
import { Test } from "./test.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/post",
    element: <Post />,
  },
  {
    path: "/post/:id",
    element: <Blog />,
  },
  {
    path: "/infomation",
    element: <User />,
  },
  {
    path: "/update/:id",
    element: <Update />,
  },
  {
    path: "/profile/:id",
    element: <Member />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path : "/test",
    element : <Test />
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserContextProvider>
      <BlogContextProvider>
        <RouterProvider router={router} />
      </BlogContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
