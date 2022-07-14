import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { Board } from "../models/board";
import { Post } from "../models/post";
import { CreatePostForm } from "./createPostForm";

interface Props {
  board: Board;
}

export const BoardPage: FunctionComponent<Props> = ({ board }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardID: board.id,
          after: new Date().toString(),
          count: 25,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        setPosts(json.posts);
      }
    };
    fetchData().catch(console.error);
  }, [setPosts, board.id]);

  const onPostCreated = useCallback(
    (post: Post | null) => {
      if (!post) {
        return;
      }

      setPosts([post, ...posts]);
    },
    [posts, setPosts]
  );

  return (
    <div>
      <div className="column">
        <div className="title">{board.name}</div>
        <div>
          <CreatePostForm boardID={board.id} onCreated={onPostCreated} />
        </div>
      </div>

      <div className="column">
        {posts.map((p) => {
          return (
            <div id={`post-${p.id}`} className="column">
              <div className="box">{p.body}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
