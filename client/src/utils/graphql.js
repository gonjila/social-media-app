import { gql } from "@apollo/client";

export const FETCH_POSTS_QUERY = gql`
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
