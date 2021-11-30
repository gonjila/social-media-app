import ReactDOM from "react-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "apollo-link-context";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/auth";
import App from "./App";
import "semantic-ui-css/semantic.min.css";

const httpLink = createHttpLink({
    uri: "http://localhost:5000/",
});

const authLink = setContext(() => {
    const token = localStorage.getItem("jwtToken");
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : ``,
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    </ApolloProvider>,
    document.getElementById("root")
);
