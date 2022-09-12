export default interface Course {
  id: number;
  name: string;
  maxNumberOfStudent: number;
  type: string;
  price: number;
  openingDate: Date;
  closingDate: Date;
  image: string;
}