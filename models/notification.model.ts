export default interface Notification {
  id: number;
  content: string;
  read: boolean;
  userId: number;
  createdAt: Date;
}