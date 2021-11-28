import { useQuery, gql } from "@apollo/client";
import { Grid } from "semantic-ui-react";

import PostCard from "../components/PostCard";

const FETCH_POSTS_QUERY = gql`
    query GetPosts {
        getPosts {
            id
            body
            username
            createdAt
            likeCount
            likes {
                username
            }
            commentCount
            comments {
                id
                createdAt
                username
                body
            }
        }
    }
`;

function Home() {
    const { data, loading } = useQuery(FETCH_POSTS_QUERY);

    return (
        <div>
            <Grid columns={3}>
                <Grid.Row className="page_title">
                    <h1>Recent Posts</h1>
                </Grid.Row>
                <Grid.Row>
                    {loading ? (
                        <h1>Loading posts...</h1>
                    ) : (
                        data?.getPosts.map((post) => (
                            <Grid.Column key={post.id}>
                                <PostCard post={post} />
                            </Grid.Column>
                        ))
                    )}
                </Grid.Row>
            </Grid>
        </div>
    );
}

export default Home;
