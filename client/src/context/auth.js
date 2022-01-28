import { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

const initialState = { userData: null };

if (localStorage.getItem("jwtToken")) {
    const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));
    console.log("decodedToken", decodedToken);

    if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("jwtToken");
    } else {
        initialState.userData = decodedToken;
    }
}

const authContext = createContext({
    userData: null,
    login: () => {},
    logout: () => {},
});

const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                userData: action.payload,
            };
        case "LOGOUT":
            return {
                ...state,
                userData: null,
            };
        default:
            return state;
    }
};

const AuthProvider = (props) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = (userData) => {
        localStorage.setItem("jwtToken", userData.token);
        dispatch({ type: "LOGIN", payload: userData });
    };
    const logout = () => {
        localStorage.removeItem("jwtToken");
        dispatch({ type: "LOGOUT" });
    };

    return <authContext.Provider value={{ userData: state.userData, login, logout }} {...props} />;
};

export { authContext, AuthProvider };
