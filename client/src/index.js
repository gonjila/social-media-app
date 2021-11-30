import ReactDOM from "react-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/auth";
import App from "./App";
import "semantic-ui-css/semantic.min.css";

const client = new ApolloClient({
    uri: "http://localhost:5000/",
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
