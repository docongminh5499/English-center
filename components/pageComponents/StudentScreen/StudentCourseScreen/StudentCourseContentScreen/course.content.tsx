import { useRouter } from "next/router";


const StudentCourseContentScreen = (props:any) => {

    const route = useRouter();
    const courseId = route.query.slug;
    return (
        <>
            <h1>Student Content Screen For CourseId {courseId}</h1>
        </>
    )
}

export default StudentCourseContentScreen;