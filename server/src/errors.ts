export class BoardNotFoundError extends Error {
  constructor(boardID?: string) {
    super("board not found");
  }
}

interface PostNotFoundParams {
  boardID?: string;
  id?: string;
}

export class PostNotFoundError extends Error {
  constructor(params: PostNotFoundParams = {}) {
    super("post not found");
  }
}