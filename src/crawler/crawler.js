
import { ghClient } from "../api/gitApi.js";
import { client } from "../database/setup-db.js";

export const fetchRepositories = async (segment, limit, batchSize) => {
  let hasNextPage = true;
  let endCursor = null;
  let allRepos = [];

  while (hasNextPage && allRepos.length < limit) {
    const query = `
      query ($cursor: String) {
        search(query: "${segment}", type: REPOSITORY, first: ${batchSize}, after: $cursor) {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              ... on Repository {
                name
                owner { login }
                stargazerCount
              }
            }
          }
        }
        rateLimit {
          cost
          remaining
          resetAt
        }
      }
    `;

    try {
      const response = await ghClient.post("", { query, variables: { cursor: endCursor } });
      const data = response.data.data;

      const repos = data.search.edges.map((edge) => edge.node);
      allRepos.push(...repos);

      console.log(`Fetched ${allRepos.length} repos so far...`);
      console.log(`Rate limit remaining: ${data.rateLimit.remaining}, cost: ${data.rateLimit.cost}`);

      for (const repo of repos) {
        await client.query(
          "INSERT INTO repositories (name, owner, stars) VALUES ($1, $2, $3)",
          [repo.name, repo.owner.login, repo.stargazerCount]
        );
      }

      hasNextPage = data.search.pageInfo.hasNextPage;
      endCursor = data.search.pageInfo.endCursor;

      console.log("has next", hasNextPage , "cursor", endCursor);

    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
      break;
    }
  }

  return allRepos.slice(0, limit);
};