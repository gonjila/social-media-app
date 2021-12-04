import { useContext, useState, useRef } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { Button, Card, Form, Grid, Icon, Image, Label } from "semantic-ui-react";

import { authContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

function SinglePost() {
    const location = useLocation();
    const navigate = useNavigate();
    const commentInputRef = useRef(null);
    const { userData } = useContext(authContext);
    const [comment, setComment] = useState("");

    const postId = location.pathname.split("/posts/")[1];

    const { data } = useQuery(SINGLE_POST_QUERY, {
        variables: { postId },
    });

    const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
        update() {
            setComment("");
            commentInputRef.current.blur();
        },
        variables: { postId, body: comment },
    });

    const deletePostCallback = () => {
        navigate("/");
    };

    const getPost = data?.getPost;
    let postMarkup;
    if (!getPost) {
        postMarkup = <p>Loading post...</p>;
    } else {
        const { id, body, createdAt, username, comments, commentCount, likes, likeCount } = getPost;
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
                            size="small"
                            float="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={userData} post={{ id, likeCount, likes }} />
                                <Button as="div" labelPosition="right" onClick={() => console.log("commenting")} />
                                <Button as="div" labelPosition="right" onClick={() => console.log("commenting")}>
                                    <Button basic color="blue">
                                        <Icon name="comments" />
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {commentCount}
                                    </Label>
                                </Button>
                                {userData && userData.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}
                            </Card.Content>
                        </Card>
                        {userData && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="Comment.."
                                                name="comment"
                                                value={comment}
                                                onChange={(event) => setComment(event.target.value)}
                                                ref={commentInputRef}
                                            />
                                            <button
                                                type="submit"
                                                className="ui button teal"
                                                disabled={comment.trim() === ""}
                                                onClick={createComment}
                                            >
                                                Sumbit
                                            </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {comments.map((comment) => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {userData && userData.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id} />
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    return postMarkup;
}

const SINGLE_POST_QUERY = gql`
    query GetPost($postId: ID!) {
        getPost(postId: $postId) {
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
                username
            }
            likeCount
        }
    }
`;

const CREATE_COMMENT_MUTATION = gql`
    mutation CreateComment($postId: ID!, $body: String!) {
        createComment(postId: $postId, body: $body) {
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

export default SinglePost;
