import { CurriculumLevel } from "./constants";

export function getLevelName(level?: CurriculumLevel) {
    if (level === CurriculumLevel.Beginer)
        return "Sơ cấp (A1-A2)";
    if (level === CurriculumLevel.Intermediate)
        return "Trung cấp (B1-B2)";
    if (level === CurriculumLevel.Advance)
        return "Cao cấp (C1-C2)";
    return "";
}