export interface Board {
  id: string;
  name: string;
  createdAt: Date;
}

export const formatObj = (obj: any) => {
  const newObj = { ...obj };

  if (obj.createdAt) {
    newObj.createdAt = new Date(obj.createdAt);
  }

  return newObj;
}