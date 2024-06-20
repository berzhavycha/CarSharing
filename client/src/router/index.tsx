import { Header } from "@/layouts";
import { MainUserPage } from "@/pages";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Header />}>
            <Route index element={<MainUserPage />} />
        </Route>
    )
)