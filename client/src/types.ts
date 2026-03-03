export interface Board {
  id: string;
  name: string;
}

export interface BoardItem {
  id: string;
  boardId: string;
  body: string;
  createdAt: string;
}