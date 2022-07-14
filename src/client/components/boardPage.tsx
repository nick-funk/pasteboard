import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { Board } from "../models/board";
import { Post as PostModel } from "../models/post";
import { CreatePostForm } from "./createPostForm";
import { Post } from "./post";

interface Props {
  board: Board;
}

export const BoardPage: FunctionComponent<Props> = ({ board }) => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [cursor, setCursor] = useState<string>(new Date().toISOString());

  const fetchData = useCallback(
    async (
      boardID: string,
      cursor: string,
      posts: PostModel[],
      paginating: boolean
    ) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardID,
          after: cursor,
          count: 20,
        }),
      });

      if (response.ok) {
        const json = await response.json();

        if (paginating) {
          setPosts([...posts, ...json.posts]);
        } else {
          setPosts(json.posts);
        }

        setHasMore(json.hasMore);
        setCursor(json.nextCursor);
      }
    },
    [setPosts, setHasMore, setCursor]
  );

  useEffect(() => {
    fetchData(board.id, cursor, posts, false).catch(console.error);
  }, []);

  const onPostCreated = useCallback(
    (post: PostModel | null) => {
      if (!post) {
        return;
      }

      setPosts([post, ...posts]);
    },
    [posts, setPosts]
  );

  const onLoadMore = useCallback(async () => {
    if (!hasMore) {
      return;
    }

    await fetchData(board.id, cursor, posts, true);
  }, [hasMore, board.id, cursor, posts]);

  const onDeletePost = useCallback((id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  }, [setPosts, posts]);

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
            <Post id={p.id} body={p.body} onDelete={onDeletePost} />
          );
        })}
        {hasMore && (
          <div className="column">
            <button className="button is-primary" onClick={onLoadMore}>
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};