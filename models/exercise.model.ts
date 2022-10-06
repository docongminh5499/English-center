

export default interface Exercise {
  id: number;
  name: string;
  openTime: Date | null;
  endTime: Date | null;
  maxTime: number | null;
//   questions: Question[];
}