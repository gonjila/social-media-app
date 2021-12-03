import { useContext, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { Button, Card, Grid, Icon, Image, Label } from "semantic-ui-react";

import { authContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

function SinglePost(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData } = useContext(authContext);

    const { data } = useQuery(SINGLE_POST_QUERY, {
        variables: { postId: location.pathname.split("/posts/")[1] },
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

export default SinglePost;
