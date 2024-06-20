import { Header } from "@/layouts";
import { MainUserPage, SignUpPage } from "@/pages";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Header />}>
                <Route index element={<MainUserPage />} />
            </Route>
            <Route path="sign-up" element={<SignUpPage />} />
        </>
    )
)
