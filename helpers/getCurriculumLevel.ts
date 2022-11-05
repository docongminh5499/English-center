import { CurriculumLevel } from "./constants";

export function getCurriculumLevel(level?: CurriculumLevel): string {
    if (level === CurriculumLevel.Beginer) return "Sơ cấp";
    else if (level === CurriculumLevel.Intermediate) return "Trung cấp";
    return "Cao cấp";
}