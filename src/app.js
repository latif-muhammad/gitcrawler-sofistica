import { client, setupDB } from "./database/setup-db.js";
import { fetchRepositories } from "./crawler/crawler.js"

const app = async () => {
  (async () => {
    await setupDB();
    const repos = await fetchRepositories(10, 10);
    console.log("\nTop Repositories:");
    console.log(repos);
    await client.end();
  })();
};


app();