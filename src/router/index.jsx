import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../pages/Layout";
import Login from "../pages/Login";
import AuthComponent from "../components/authComponent";
const Home = lazy(()=>import('../pages/Home'))
const Article = lazy(()=>import('../pages/Article'))
const Publish = lazy(()=>import('../pages/Publish'))

const routes = [
  { path:'/login',element:<Login/> },
  { path:'/layout',element:
    <AuthComponent>
      <Layout/> 
    </AuthComponent>,
    children:[
      { path:'/layout/home',element:<Home/> },
      { path:'/layout/article',element:<Article/> },
      { path:'/layout/publish',element:<Publish/> }
    ]
  },
  { path:'/',element:<Navigate to='layout/home'/> },
]
 
export default routes