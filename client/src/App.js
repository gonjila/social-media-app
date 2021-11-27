import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import "./App.css";
import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
    return (
        <Container>
            <Suspense fallback={<div>Loading...</div>}>
                <BrowserRouter>
                    <MenuBar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </BrowserRouter>
            </Suspense>
        </Container>
    );
}

export default App;
