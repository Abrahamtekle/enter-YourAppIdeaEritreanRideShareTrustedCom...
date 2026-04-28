import Home from "./pages/Home";
import RidesList from "./pages/RidesList";
import RideDetail from "./pages/RideDetail";
import PostRide from "./pages/PostRide";
import ChatList from "./pages/ChatList";
import ChatThread from "./pages/ChatThread";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

export const routers = [
  { path: "/", name: "home", element: <Home /> },
  { path: "/rides", name: "rides", element: <RidesList /> },
  { path: "/rides/:id", name: "ride-detail", element: <RideDetail /> },
  { path: "/post-ride", name: "post-ride", element: <PostRide /> },
  { path: "/chat", name: "chat", element: <ChatList /> },
  { path: "/chat/:id", name: "chat-thread", element: <ChatThread /> },
  { path: "/profile", name: "profile", element: <Profile /> },
  { path: "/profile/:id", name: "profile-view", element: <Profile /> },
  { path: "/login", name: "login", element: <Login /> },
  { path: "/signup", name: "signup", element: <Signup /> },
  /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
  { path: "*", name: "404", element: <NotFound /> },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
