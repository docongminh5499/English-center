export default interface Lecture {
    version: number,
    id: number,
    name: string,
    desc: string | null,
    detail: string,
    order: number,
    pseudoId: string,
}
