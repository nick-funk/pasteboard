export interface Board {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  boardId: string;
  body: string;
}