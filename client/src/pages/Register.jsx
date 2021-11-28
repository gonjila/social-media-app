import { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { useForm } from "../utils/hooks";

function Register() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const initialState = { username: "", email: "", password: "", confirmPassword: "" };
    const { onChange, onSubmit, values } = useForm(registerUser, initialState);

    // პირველი არის ფუნქცია რომლითაც მუტაცია ხდება და მეორე useQueryს თემაა.
    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(proxy, result) {
            navigate("/");
        },
        // graphQLის სერვერიდან რამე ერორი თუ წამოვა აქ მოხვდება.
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values,
    });

    function registerUser() {
        addUser();
    }

    return (
        <div className="form_container">
            <Form className={loading ? "loading" : ""}>
                <h1>Register</h1>
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
                    label="Email"
                    name="email"
                    placeholder="Email..."
                    type="email"
                    error={errors?.email ? true : false}
                    value={values.email}
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
                <Form.Input
                    label="Confirm Password"
                    name="confirmPassword"
                    placeholder="Confirm Password..."
                    type="password"
                    error={errors?.confirmPassword ? true : false}
                    value={values.confirmPassword}
                    onChange={onChange}
                />
                <Button type="submit" onClick={onSubmit} primary>
                    Registe
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

const REGISTER_USER = gql`
    mutation Register($email: String!, $username: String!, $password: String!, $confirmPassword: String!) {
        register(
            registerInputs: {
                email: $email
                username: $username
                password: $password
                confirmPassword: $confirmPassword
            }
        ) {
            id
            email
            token
            username
            createdAt
        }
    }
`;

export default Register;
