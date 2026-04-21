import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { CarDetail } from "./pages/Car";
import { Dashboard } from "./pages/Dashboard";
import { New } from "./pages/Dashboard/New";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Layout } from "./components/layout";
import { Private } from "./routes/private";


const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/car/:id",
        element: <CarDetail/>
      },
      {
        path: "/dashboard",
        element: <Private> <Dashboard/> </Private> 
      },
      {
        path: "/dashboard/new",
        element: <Private> <New/> </Private> 
      },
    ]
  },

  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  }
 
])

export { router };