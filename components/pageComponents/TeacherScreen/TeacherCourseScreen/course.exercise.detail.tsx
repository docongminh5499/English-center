import { Badge, Box, Button, Container, Divider, Grid, Group, Image, Loader, ScrollArea, Text, Title } from "@mantine/core";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { Url } from "../../../../helpers/constants";
import { getAudioUrl, getImageUrl } from "../../../../helpers/image.helper";
import { useAuth } from "../../../../stores/Auth";
import { CChart } from "@coreui/react-chartjs";
import CourseModifyExercise from "./course.exercise.modify";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowBackUp, IconEdit } from "@tabler/icons";

const CourseExerciseDetail = (props: any) => {
	const [authState] = useAuth();
	const [loading, setLoading] = useState(true);
	const [exercise, setExercise] = useState(null);
	const [studentDoExercise, setStudentDoExercise] = useState([]);
	const [modifyExercise, setModifyExercise] = useState(false);
	const [tags, setTags] = useState([]);

	console.log(exercise)

	useEffect(() => {
    // 👇️ scroll to top on page load
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }, [modifyExercise]);

	useEffect(() => {
    const didMountFunc = async () => {
      try {
        const exerciseResponse = await API.get(Url.teachers.getExerciseById, {
          token: authState.token,
					exerciseId: props.exerciseId,
        });
				
				const stdDoExeResponse = await API.get(Url.teachers.getStdExeResult, {
          token: authState.token,
					exerciseId: props.exerciseId,
        });

				//Set state
        setExercise(exerciseResponse);
				setStudentDoExercise(stdDoExeResponse);
      } catch (error) {
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
      }finally {
				setLoading(false);
			}
    };
    didMountFunc();
  }, []);
  	console.log("||||||||||||||||||||||||||||||||||||||||||||||||");
	if(exercise !== null)
		console.log((new Date(exercise.openTime)));
	console.log(studentDoExercise);
	const now = new Date();

	const chartData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	if (studentDoExercise.length !== 0){
		studentDoExercise.forEach((element: any) => {
			chartData[Math.round(element.score)] ++;
		})
	}
	return (
		<>
			{loading === true && 
				<Group position="center">
					<Loader size={"lg"}/>
				</Group>
			}

			{loading === false && 
				<>
					{exercise !== null && !modifyExercise &&
						<>
							<Group position="center">
								<Title order={1} mt={"md"}>Bài tập: {exercise.name}</Title>
							</Group>

							<Grid mt={"md"}>
								<Grid.Col span={6}>
									<Text weight={600} size={"lg"}> Ngày tạo: {moment(exercise.createAt).format("HH:mm - DD/MM/YYYY")} </Text>
								</Grid.Col>

								<Grid.Col span={6}>
									<Text weight={600} size={"lg"}> Số lần làm tối đa: {exercise.maxTime} </Text>
								</Grid.Col>

								<Grid.Col span={6}>
									<Text weight={600} size={"lg"}> Thời gian bắt đầu: {moment(exercise.openTime).format("HH:mm - DD/MM/YYYY")} </Text>
								</Grid.Col>

								<Grid.Col span={6}>
									<Text weight={600} size={"lg"}> Thời gian kết thúc: {moment(exercise.endTime).format("HH:mm - DD/MM/YYYY")} </Text>
								</Grid.Col>
							</Grid>

							<Title order={1} mt={"lg"}>Thống kê điểm bài tập:</Title>
							{
								<Box>
									<CChart
										type="bar"
										data={{
											labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
											datasets: [
												{
													label: 'Số lượng học viên',
													backgroundColor: '#f87979',
													data: chartData,
												},
											],
										}}
										labels="Số lượng: "
									/>
								</Box>
							}

							<Title order={1} mt={"lg"}>Danh sách bài làm:</Title>

							{studentDoExercise.length !== 0 &&
								<ScrollArea style={{ width: "100%", height: 500 }} type="scroll">
									<Grid>
									{studentDoExercise.map((element: any, idx: number) => {
										return (
											<Grid.Col span={6} key={element.student.user.id} >
												<Text size={"md"} weight={600} mt={"sm"}>Tên: {element.student.user.fullName === '' ? "Default Name" : element.student.user.fullName}</Text>
												<Text size={"md"} mt={"sm"}><Text weight={600} span>Ngày làm:</Text> {moment(element.endTime).format("hh:mm - DD/MM/YYYY")}</Text>
												<Text size={"md"} weight={600} mt={"sm"} style={{borderBottom: "3px solid red", width: "50%"}}> Điểm: <Text span color={"blue"}>{element.score}</Text></Text>
											</Grid.Col>
										);
									})}
									</Grid>
								</ScrollArea>
							}

							{studentDoExercise.length === 0 &&
								<Text color={"#444444"} size={"lg"} weight={600}>Hiện chưa có học viên làm bài tập này.</Text>
							}	
							<Title order={1} mt={"lg"}>Danh sách câu hỏi: {exercise?.questions.length} câu hỏi</Title>
							
							{
								exercise?.questions.map((question: any, idx: any) => {
									const rightAnswer = {
										id: question.id,
										answer: question.answer,
									};

									const wrongAnswer = question.wrongAnswers.map((wrongAnswer: any) => {
										return {
											id: wrongAnswer.id,
											answer: wrongAnswer.answer,
										};
									});
									return (
										<Box key={question.id} mt={"lg"}>
											<Divider my="xl" size={"xl"} color={"violet"} />
											<Title order={4}>Câu hỏi {idx + 1}:</Title>
											<Text size={"md"} mt={"sm"}>{question.quesContent}</Text>

											<Group mt={"sm"}>
												{
													question.tags.map((tag: any) => {
														return (
															<Badge key={tag.name}>{tag.name}</Badge>
														)
													})
												}
											</Group>
											{question.imgSrc !== null &&
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

											{question.audioSrc !== null &&
												<Group position="center" mt={"md"}>
													<audio controls>
														<source src={getAudioUrl(question.audioSrc)}/>
													</audio>
												</Group>
											}

											<Grid mt={"md"}>
												<Grid.Col span={6}>
													<Title order={4}>Đáp án đúng:</Title>
													<Text size={"md"}>{rightAnswer.answer}</Text>
												</Grid.Col>
											
											{
												wrongAnswer.map((element: any, idx: number) => {

													return (
														<Grid.Col span={6} key={element.id}>
															<Title order={4}>Đáp án sai {idx + 1}:</Title>
															<Text size={"md"}>{element.answer}</Text>
														</Grid.Col>
													)
												})
											}
											</Grid>
										</Box>
									)
								})
							}

							<Group position="center" mt={"xl"}>
								{ props.course.closingDate === null && (new Date(exercise.openTime)).getTime() > now.getTime() &&
									<Button style={{backgroundColor: "#FFC125"}} leftIcon={<IconEdit />} onClick={async () => {
										const tag:[] = await API.get(Url.teachers.getAllQuestionTag, {
											token: authState.token, 
										});
							
										const formTags: any[] = [];
										tag.forEach(element => {
											formTags.push({value: element.name, label: element.name})
										});
										console.log(formTags);
										setTags(formTags);
										setModifyExercise(true);
									}}>
										Chỉnh cửa
									</Button>
								}

								<Button leftIcon={<IconArrowBackUp />} onClick={() => props.setSeeExerciseDetail(false)}>
									Quay lại
								</Button>
							</Group>
						</>
					}

					{exercise !== null && modifyExercise &&
						<CourseModifyExercise {...props} setModifyExercise={setModifyExercise} setExercise={setExercise} exercise={exercise} tags={tags}/>
					}
				</>
			}
		</>
	);
}

export default CourseExerciseDetail;