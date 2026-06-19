import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import AllAppointments from "../pages/AllAppointments/AllAppointments";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Error404 from "../pages/Error404/Error404";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <Error404 />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/appointments",
                element: <AllAppointments />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
        ],
    },
]);

export default router;