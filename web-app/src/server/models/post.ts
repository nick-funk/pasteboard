import { MongoContext } from "../mongoContext";

export interface Post {
  id: string;
  boardID: string;
  createdAt: Date;
  body: string;
}

export const createPost = async (mongo: MongoContext, post: Post) => {
  const existingBoard = await mongo.boards().findOne({ id: post.boardID });
  if (!existingBoard) {
    throw new Error("board does not exist");
  }

  const existingPost = await mongo
    .posts()
    .findOne({ id: post.id, boardID: post.boardID });
  if (existingPost) {
    throw new Error("post with id already exists");
  }

  const result = await mongo.posts().insertOne(post);

  if (result.acknowledged) {
    return post;
  } else {
    throw new Error("unable to create board");
  }
};

interface PostsPaginationResult {
  posts: Post[];
  after: Date;
  nextCursor: Date;
  hasMore: boolean;
}

export const paginatePosts = async (
  mongo: MongoContext,
  boardID: string,
  after: Date,
  count: number
): Promise<PostsPaginationResult> => {
  const existingBoard = await mongo.boards().findOne({ id: boardID });
  if (!existingBoard) {
    throw new Error("board does not exist");
  }

  const result = await mongo
    .posts()
    .find({ boardID, createdAt: { $lt: after } })
    .sort({ createdAt: -1 })
    .limit(count + 1)
    .toArray();

  const hasMore = result && result.length > count;
  const lastIndex = hasMore ? count - 1 : result.length - 1;
  const posts = result && lastIndex >= 0 ? result.slice(0, lastIndex + 1) : [];
  const nextCursor =
    posts && posts.length > 0 ? posts[posts.length - 1].createdAt : after;

  return {
    posts,
    after,
    nextCursor,
    hasMore,
  };
};
