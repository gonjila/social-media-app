import { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";

import { authContext } from "../context/auth";
import { FETCH_POSTS_QUERY } from "../utils/graphql";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

function Home() {
    const { userData } = useContext(authContext);
    const { data, loading } = useQuery(FETCH_POSTS_QUERY);

    return (
        <div>
            <Grid columns={3}>
                <Grid.Row className="page_title">
                    <h1>Recent Posts</h1>
                </Grid.Row>
                <Grid.Row>
                    {userData && (
                        <Grid.Column>
                            <PostForm />
                        </Grid.Column>
                    )}
                    {loading ? (
                        <h1>Loading posts...</h1>
                    ) : (
                        <Transition.Group duration={500} divided size="huge" verticalAlign="middle">
                            {data?.getPosts.map((post) => (
                                <Grid.Column key={post.id}>
                                    <PostCard post={post} />
                                </Grid.Column>
                            ))}
                        </Transition.Group>
                    )}
                </Grid.Row>
            </Grid>
        </div>
    );
}

export default Home;
