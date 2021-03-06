import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Button, Confirm, Icon } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../utils/graphql";
import MyPopup from "../utils/MyPopup";

function DeleteButton({ postId, callback, commentId }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false);
            if (!commentId) {
                const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: { getPosts: data.getPosts.filter((p) => p.id !== postId) },
                });
            }
            callback && callback();
        },
        variables: { postId, commentId },
    });

    return (
        <>
            <MyPopup content={commentId ? "Delete comment" : "Delete post"}>
                <Button as="div" color="red" floated="right" onClick={() => setConfirmOpen(true)}>
                    <Icon name="trash" style={{ margin: 0 }} />
                </Button>
            </MyPopup>
            <Confirm open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePostOrComment} />
        </>
    );
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`;

const DELETE_COMMENT_MUTATION = gql`
    mutation DeleteComment($postId: ID!, $commentId: ID!) {
        deleteComment(postId: $postId, commentId: $commentId) {
            id
            comments {
                id
                createdAt
                username
                body
            }
            commentCount
        }
    }
`;

export default DeleteButton;
