import { Badge, Box, Button, Center, Container, Divider, Grid, Group, Image, Loader, Modal, Radio, ScrollArea, Space, Table, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import moment from "moment";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import API from "../../../../../helpers/api";
import { Url } from "../../../../../helpers/constants";
import { getImageUrl } from "../../../../../helpers/image.helper";
import { useAuth } from "../../../../../stores/Auth";

const CourseExerciseTab = (props: any) => {

	const [authState,] = useAuth();
	const [exercise, setExercise] = useState([]);
	const [studentDoExercise, setStudentDoExercise] = useState([]);
	const [loading, setLoading] = useState(true);
	const course = props.course;
    const studentId = props.studentId;
	console.log(course);
	console.log("==========================================");
	console.log(exercise);

	useEffect(() => {
		(async () => {
			try{
				const exercises:[] = await API.get(Url.parents.getAllExercises, {
					token: authState.token, 
                    studentId: studentId,
					courseId: course.id,
				});
				setExercise(exercises);

				const studentDoExercise:[] = await API.get(Url.parents.getStudentDoExercise, {
					token: authState.token, 
                    studentId: studentId,
					courseId: course.id,
				});
				setStudentDoExercise(studentDoExercise);
			}catch (error){
				console.log(error);
				toast.error("Hệ thống đang gặp sự cố, vui lòng thử lại sau!");
			}finally {
				setLoading(false);
			}
		})();
  	}, []);

	const exerciseRows = exercise.map((element: any) =>{
		const openTime = new Date(element.openTime);
		const endTime = new Date(element.endTime);
		const now = new Date();
		let maxGrade = 0;
		let times = 0;
		studentDoExercise.forEach((stdDoExe:any) => {
			if (stdDoExe.exercise.id === element.id){
				maxGrade = stdDoExe.score > maxGrade ? stdDoExe.score : maxGrade;
				times++;
			}
		});
		return (
			<tr key={element.id}>
				<td><Text align="center">{element.name}</Text></td>
				<td><Text align="center">{moment(openTime).format("hh:mm - DD/MM/YYYY")}</Text></td>
				<td><Text align="center">{moment(endTime).format("hh:mm - DD/MM/YYYY")}</Text></td>
				<td><Text align="center">{element.maxTime}</Text></td>
				<td><Text align="center">{times}</Text></td>
				<td><Text align="center">{times === 0 ? "-" : maxGrade}</Text></td>
			</tr>
  	)
	});

	return (
		<>

            <Group position="center" mt={"md"}>
                <Title order={1}> Danh sách bài tập </Title>
            </Group>
            {loading &&
                <Center mt={"xl"}>
                    <Loader size={"xl"}/>
                </Center>
                
            }
            {exercise.length === 0 && !loading &&
                <>
                    <Space h={200}/>
                    <Group position="center" mt={"md"}>
                        <Title order={1}> Hiện tại chưa có bài tập nào. </Title>
                    </Group>
                </>
            }

            {exercise.length !== 0 && !loading &&
                <>
                    <Group position="center" mt={"md"}>
					<ScrollArea style={{width: "100%", flex: 1}}>
                        <Table withBorder withColumnBorders highlightOnHover >
                            <thead>
                                <tr>
                                    <th><Text align="center">Tên bài tập</Text></th>
                                    <th><Text align="center">Thời gian mở</Text></th>
                                    <th><Text align="center">Thời gian kết thúc</Text></th>
                                    <th><Text align="center">Số lần thục hiện tối đa</Text></th>
                                    <th><Text align="center">Số lần đã thục hiện</Text></th>
                                    <th><Text align="center">Điểm cao nhất</Text></th>
                                </tr>
                            </thead>
                            <tbody>{exerciseRows}</tbody>
                        </Table>
						</ScrollArea>
                    </Group>
                </>
            }
		</>
	);
}

export default CourseExerciseTab;