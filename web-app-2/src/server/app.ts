import express from "express";
import { graphqlHTTP } from "express-graphql";
import nunjucks from "nunjucks";
import { createApi, createResolvers } from "./api/api";

import EnvironmentVariables from "./environmentVariables";

export default class App {
  private env: EnvironmentVariables;
  private app: express.Express;

  constructor(env: EnvironmentVariables) {
    this.env = env;
    this.app = express();
  }

  public async run() {
    nunjucks.configure("src/server/views", { autoescape: true });

    this.app.get("/", (req, res) => {
        res.send(nunjucks.render("index.html", {}));
    });

    this.app.use("/bundles", express.static("build/bundles/"));

    const resolvers = createResolvers();
    const graph = createApi("./src/server/schema.graphql", resolvers);

    this.app.use("/api", graphqlHTTP({
        schema: graph.schema,
        rootValue: graph.root,
        graphiql: true,
    }));

    this.app.listen(this.env.port, () => {
        console.log(`listening on ${this.env.port}...`);
    });
  }
}