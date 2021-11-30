import { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { useForm } from "../utils/hooks";
import { authContext } from "../context/auth";

function Login() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const initialState = { username: "", password: "" };
    const { onChange, onSubmit, values } = useForm(loginUserCallback, initialState);
    const { login } = useContext(authContext);

    // პირველი არის ფუნქცია რომლითაც მუტაცია ხდება და მეორე useQueryს თემაა.
    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(proxy, result) {
            console.log("%clogin update", "color:#FF0000", result.data.login);
            login(result.data.login);
            // navigate("/");
        },
        // graphQLის სერვერიდან რამე ერორი თუ წამოვა აქ მოხვდება.
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values,
    });

    function loginUserCallback() {
        loginUser();
    }

    return (
        <div className="form_container">
            <Form className={loading ? "loading" : ""}>
                <h1>Login</h1>
                <Form.Input
                    label="Username"
                    name="username"
                    placeholder="Username..."
                    type="text"
                    error={errors?.username ? true : false}
                    value={values.username}
                    onChange={onChange}
                />
                <Form.Input
                    label="Password"
                    name="password"
                    placeholder="Password..."
                    type="password"
                    error={errors?.password ? true : false}
                    value={values.password}
                    onChange={onChange}
                />
                <Button type="submit" onClick={onSubmit} primary>
                    Login
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map((value) => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

const LOGIN_USER = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            id
            email
            token
            username
            createdAt
        }
    }
`;

export default Login;
