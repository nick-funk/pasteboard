import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { EnvConfig } from "../envConfig";

interface Post {
  id: string;
  createdAt: string;
  value: string;
}

interface GetPostsResponse {
  boardID: string;
  posts: Post[];
}

interface Props {
  id: string;
}

export const BoardPage: FunctionComponent<Props> = ({ id }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  const loadPosts = useCallback(async () => {
    const config = EnvConfig.instance();
    const url = new URL(`/boards/${id}`, config.apiURL);
    console.log(url);

    const response = await fetch(
      url.toString()
    );

    if (!response.ok) {
      return;
    }

    const json = await response.json() as GetPostsResponse;
    if (!json) {
      return;
    }

    setPosts(json.posts);
  }, [setPosts]);

  useEffect(() => {
    console.log("load posts");
    void loadPosts();
  }, [loadPosts]);

  return <View>
    {posts.map((p) => <View key={p.id}>
        <Text>{p.value}</Text>
      </View>
    )}
  </View>
}