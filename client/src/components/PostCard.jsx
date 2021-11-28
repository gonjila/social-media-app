import { Card, Image, Button, Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

function PostCard(props) {
    const { id, username, body, createdAt, likes, likeCount, commentCount } = props.post;

    const likePost = (e) => {
        console.log("like post");
    };
    const commentOnPost = () => {
        console.log("comment on the post");
    };

    return (
        <Card fluid style={{ marginBottom: "30px" }}>
            <Card.Content>
                <Image
                    floated="right"
                    size="mini"
                    src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>
                    {moment(createdAt).fromNow(true)}
                </Card.Meta>
                <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button as="div" labelPosition="right" onClick={likePost}>
                    <Button color="teal" basic>
                        <Icon name="heart" />
                    </Button>
                    <Label basic color="teal" pointing="left">
                        {likeCount}
                    </Label>
                </Button>
                <Button as="div" labelPosition="right" onClick={commentOnPost}>
                    <Button color="blue" basic>
                        <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                        {commentCount}
                    </Label>
                </Button>
            </Card.Content>
        </Card>
    );
}

export default PostCard;
