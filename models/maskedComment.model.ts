export default interface MaskedComment {
    comment: string | null;
    starPoint: number | null;
    userFullName: string | null;
    commentDate: Date | null;
    avatar: string | null | undefined;
}