import { Badge, Box, Button, Center, Container, Divider, Grid, Group, Image, Loader, Modal, Radio, Space, Table, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import moment from "moment";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import API from "../../../../../helpers/api";
import { CourseStatus, Url } from "../../../../../helpers/constants";
import { getCourseStatus } from "../../../../../helpers/getCourseStatus";
import { getImageUrl } from "../../../../../helpers/image.helper";
import { useAuth } from "../../../../../stores/Auth";

const CourseExerciseTab = (props: any) => {

	const [authState,] = useAuth();
	const [exercise, setExercise] = useState([]);
	const [studentDoExercise, setStudentDoExercise] = useState([]);
	const [loading, setLoading] = useState(true);
	const [doExercise, setDoExercise] = useState(false);
	const [confirmDoExercise, setConfirmDoExercise] = useState(false);
	const [selectedExercise, setSelectedExercise] = useState(null);
	const [confirmSubmitExercise, setConfirmSubmitExercise] = useState(false);
	const course = props.course;
	console.log(course);
	console.log("==========================================");
	console.log(exercise);

	useEffect(() => {
		(async () => {
			try{
				const exercises:[] = await API.get(Url.students.getAllExercises, {
					token: authState.token, 
					courseId: course.id,
				});
				setExercise(exercises);

				const studentDoExercise:[] = await API.get(Url.students.getStudentDoExercise, {
					token: authState.token, 
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
				{getCourseStatus(course) === CourseStatus.Opened &&
				now.getTime() >= openTime.getTime() && now.getTime() <= endTime.getTime() && 
					<td>
						<Text 
							align="center" 
							color={"blue"} 
							underline
							onClick={() => {
								
								if (times === element.maxTime){
									toast.info("Bận đã thực hiện hết số lần làm cho phép của bài tập này");
									return;
								}
								setSelectedExercise(element);
								setConfirmDoExercise(true);
							}}
						>
							Làm bài
						</Text>
					</td>
				}
				{(getCourseStatus(course) === CourseStatus.Closed ||
				 now.getTime() > endTime.getTime()) && 
					<td>
						<Text 
							align="center" 
							fw={500}
						>
							Hêt hạn làm bài
						</Text>
					</td>
				}
				{(getCourseStatus(course) === CourseStatus.NotOpen ||
				 now.getTime() < openTime.getTime()) && 
					<td>
						<Text 
							align="center" 
							fw={500}
						>
							Bài tập chưa mở
						</Text>
					</td>
				}
			</tr>
  	)
	});

	//============================================== Student Do Exercise ==============================================
	let answerForm = useForm({
		initialValues: {
			answers: [],
		},
	});

	const questionRows = useMemo(()=> selectedExercise === null ? null : selectedExercise.questions.map((element: any, idx: number) => {

		const answer = [{
			id: element.id,
			answer: element.answer,
		}];

		answerForm.insertListItem("answers", {questionId: element.id, answerId: null})

		element.wrongAnswers.forEach((wrongAnswer: any) => {
			answer.push({
				id: wrongAnswer.id,
				answer: wrongAnswer.answer,
			});
		});

		const shuffledAnswer = answer.sort((a, b) => 0.5 - Math.random());

		const question = {
			content: element.quesContent,
			imgSrc: element.imgSrc,
			audioSrc: element.audioSrc,
			tags: element.tags,
		};
		console.log(question);
		return (
			<Box key={element.id} mt={"lg"}>
				<Divider my="xl" size={"xl"} color={"violet"} />
				<Title order={4}>Câu hỏi {idx + 1}:</Title>
				<Title order={5} mt={"sm"}>{question.content}</Title>

				<Group mt={"sm"}>
					{
						question.tags.map((tag: any) => {
							return (
								<Badge key={tag.name}>{tag.name}</Badge>
							)
						})
					}
				</Group>
				{question.imgSrc === null &&
					<Box style={{ width: 240, marginLeft: 'auto', marginRight: 'auto' }} mt={"md"}>
						<Image
							withPlaceholder
							placeholder={
								<Container style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: "300px" }}>
									<Loader variant="dots" />
								</Container>
							}
							style={{ maxWidth: "300px" }}
							radius="md"
							src={getImageUrl(question.imgSrc)}
							alt="Hình minh họa cho câu hỏi"
						/>
					</Box>
				}

				<Radio.Group
					mt={"sm"}
					{...answerForm.getInputProps(`answers.${idx}.answerId`, { type: 'checkbox' })}
				>
					<Grid>
					{
						shuffledAnswer.map((element: any) => {

							return (
								<Grid.Col span={6} key={element.id}>
									<Radio 
										value={element.id.toString()} 
										label={element.answer} 
									/>
								</Grid.Col>
							)
						})
					}
					</Grid>
				</Radio.Group>
			</Box>
		);
	}), [selectedExercise]);

	const handleSubmitExercise = async (exercise: any) => {
		try{
			const studentDoExercise = await API.post(Url.students.submitExercise, {
				token: authState.token, 
				exerciseId: exercise.id,
				...answerForm.values,
			})
			setStudentDoExercise((current:any[]) => [...current, studentDoExercise]);
		}catch (error){
			console.log(error);
			toast.error("Hệ thống đang gặp sự cố, vui lòng thử lại sau!");
		}finally{
			answerForm.reset();
			setSelectedExercise(null);
			setDoExercise(false);
			
		}
	};

	return (
		<>
			{doExercise === false &&
				<>
					<Modal
						centered 
						opened={confirmDoExercise}
						onClose={() => setConfirmDoExercise(false)}
						withCloseButton={false}
					>
						<Group  position="center">
							<Text size="xl">Xác nhận thực hiện bài tập này?</Text>
						</Group>
						<Group position="center">
							<Button 
								type="submit" 
								color={"green"} 
								mt="md" 
								onClick={() => {
									setConfirmDoExercise(false);
									setDoExercise(true);
								}}
							>
								Xác nhận
							</Button>
							<Button 
								type="submit" 
								color={"red"}
								 mt="md" 
								 ml="sm" 
								 onClick={()=> {
									setSelectedExercise(null);
									setConfirmDoExercise(false);
								}}
								>
								Hủy bỏ  
							</Button>
						</Group>
					</Modal>
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
								<Table withBorder withColumnBorders highlightOnHover >
									<thead>
										<tr>
											<th><Text align="center">Tên bài tập</Text></th>
											<th><Text align="center">Thời gian mở</Text></th>
											<th><Text align="center">Thời gian kết thúc</Text></th>
											<th><Text align="center">Số lần thục hiện tối đa</Text></th>
											<th><Text align="center">Số lần đã thục hiện</Text></th>
											<th><Text align="center">Điểm cao nhất</Text></th>
											<th></th>
										</tr>
									</thead>
									<tbody>{exerciseRows}</tbody>
								</Table>
							</Group>
						</>
					}
				</>
			}

			{doExercise === true && setSelectedExercise !== null &&
				<>
					<Modal
						centered 
						opened={confirmSubmitExercise}
						onClose={() => setConfirmSubmitExercise(false)}
						withCloseButton={false}
					>
						<Group  position="center">
							<Text size="xl">Xác nhận nộp bài làm?</Text>
						</Group>
						<Group position="center">
							<Button 
								type="submit" 
								color={"green"} 
								mt="md" 
								onClick={() => {
									setConfirmSubmitExercise(false);
									handleSubmitExercise(selectedExercise);
								}}
							>
								Xác nhận
							</Button>
							<Button 
								type="submit" 
								color={"red"}
								 mt="md" 
								 ml="sm" 
								 onClick={()=> {
									setConfirmSubmitExercise(false);
								}}
								>
								Hủy bỏ  
							</Button>
						</Group>
					</Modal>

					<Title order={1} align="center" mt={"xl"}>{selectedExercise?.name}</Title>
					{questionRows}
					<Group position="center" mt={"xl"} mb={"xl"}>
						<Button 
							type="submit" 
							color={"blue"} 
							mt="md" 
							onClick={() => {
								console.log("****************************************");
								console.log(answerForm.values);
								setConfirmSubmitExercise(true);
							}}
						>
							Nộp bài
						</Button>
					</Group>
				</>
			}
		</>
	);
}

export default CourseExerciseTab;