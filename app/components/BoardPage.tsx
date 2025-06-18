import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
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

  return <View style={styles.container}>
    <FlatList 
      style={styles.list} 
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={(info) => {
        return <View>
          <Text>{info.item.value}</Text>
        </View>
      }}
    />
  </View>
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 8,
    paddingRight: 8,
    flex: 1,
  },
  list: {
    
  }
});