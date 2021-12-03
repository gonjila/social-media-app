import { useMutation, gql } from "@apollo/client";
import { Form, Button } from "semantic-ui-react";

import { useForm } from "../utils/hooks";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

function PostForm() {
    const { values, onChange, onSubmit } = useForm(createPostCallback, { body: "" });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: { getPosts: [result.data.createPost, ...data.getPosts] },
            });
            values.body = "";
        },
        variables: values,
    });

    function createPostCallback() {
        createPost();
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post:</h2>
                <Form.Input
                    label="body"
                    name="body"
                    type="text"
                    error={error ? true : false}
                    value={values.body}
                    onChange={onChange}
                />
                <Button type="submit" color="teal">
                    Submit
                </Button>
            </Form>
            {error && (
                <div className="ui error message" style={{ marginBottom: "15px" }}>
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </>
    );
}

const CREATE_POST_MUTATION = gql`
    mutation CreatePost($body: String!) {
        createPost(body: $body) {
            id
            body
            username
            createdAt
            comments {
                id
                createdAt
                username
                body
            }
            commentCount
            likes {
                id
                createdAt
                username
            }
            likeCount
        }
    }
`;

export default PostForm;
