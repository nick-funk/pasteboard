export interface Board {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  boardID: string;
  createdAt: Date;
  value: string;
}

export const formatObj = (obj: any) => {
  const newObj = { ...obj };

  if (obj.createdAt) {
    newObj.createdAt = new Date(obj.createdAt);
  }

  return newObj;
}