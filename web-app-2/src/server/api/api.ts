import fs from "fs";
import { buildSchema, GraphQLSchema } from "graphql";
import { helloGraph } from "./hello";

interface Api {
  root: any;
  schema: GraphQLSchema
}

export const createResolvers = () => {
  return [
    helloGraph(),
  ];
}

export const createApi = (schemaPath: string, resolvers: any[]): Api => {
  const schemaString = fs.readFileSync(schemaPath).toString();
  const schema = buildSchema(schemaString);

  const root: any = {};
  resolvers.forEach(r => {
    for (const item in r) {
      root[item] = r[item];
    }
  });

  return {
    root,
    schema
  };
}
