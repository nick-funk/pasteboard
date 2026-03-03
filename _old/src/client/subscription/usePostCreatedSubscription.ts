import { useCallback, useEffect, useRef } from "react";

import { Post } from "../models/post";

export interface PostCreatedSubscriptionPayload {
  action: string;
  post: Post;
}

interface Props {
  onCreated: (post: Post) => void;
  boardID: string | null;
}

export const usePostCreatedSubscription = ({
  onCreated,
  boardID = null,
}: Props) => {
  const socket = useRef<WebSocket | null>(null);

  const onMessage = useCallback(
    (msg: MessageEvent<any>) => {
      const { data } = msg;
      if (!data) {
        return;
      }

      const { post } = JSON.parse(data) as PostCreatedSubscriptionPayload;
      if (!post) {
        return;
      }

      if (boardID !== null && boardID !== post.boardID) {
        return;
      }

      onCreated(post);
    },
    [boardID, onCreated]
  );

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:7000/subscription");
    const ws = socket.current;
    if (ws === null || ws === undefined) {
      return;
    }

    ws.onmessage = onMessage;

    return () => {
      ws.close();
    };
  }, []);
};
