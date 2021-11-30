import { useContext, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Container } from "semantic-ui-react";

import "./App.css";
import { authContext } from "./context/auth";
import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userData } = useContext(authContext);

    useEffect(() => {
        if (userData) {
            if (location.pathname === "/login" || location.pathname === "/register") {
                navigate("/");
            }
        }
    }, [location.pathname, userData]);

    return (
        <Container>
            <Suspense fallback={<div>Loading...</div>}>
                <MenuBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* {!userData && (
                        <> */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {/* </>
                    )} */}
                </Routes>
            </Suspense>
        </Container>
    );
}

export default App;
