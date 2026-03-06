const GRAPHQL_ENDPOINT = '/api/graphql';

export async function fetchPostsGraphQL() {
    const query = `
        query AllPosts {
            allPosts {
                id
                authorId
                title
                content
                image
                creationDate
                likesCount
                likedByUsers {
                    id
                }
            }
        }
    `;

    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, operationName: 'AllPosts' }),
    });

    const result = await response.json();

    if (result && result.data && Array.isArray(result.data.allPosts)) {
        return result.data.allPosts;
    }

    return [];
}
