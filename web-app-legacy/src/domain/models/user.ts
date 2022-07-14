export default interface Post {
    id: string;
    username: string;
    email: string;
    hashPass?: string;
    createdAt: Date;
}