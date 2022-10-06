export default interface Document {
    id: number;
    name: string;
    author: string | null;
    pubYear: number | null;
    src: string | null;
}