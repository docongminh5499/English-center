import { Box, Button, Container, Divider, FileButton, Grid, Group, Image, Input, Loader, Modal, MultiSelect, NativeSelect, NumberInput, Popover, Text, Textarea, TextInput, Title } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { Url } from "../../../../helpers/constants";
import { useAuth } from "../../../../stores/Auth";
import Lecture from "../../../../models/lecture.model";

const CurriculumCreateExercise = (props: any) => {
  console.log(props);
  const now = new Date();
  const [addQuestion, setAddQuestion] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [authState,] = useAuth();
  const lecture: Lecture = props.lecture; 
  const [loader, setLoader] = useState(false);
  //Tags
  const [tags, setTags] = useState([]);
  const [addTagLoading, setAddTagLoading] = useState(false);
  const [confirmCreateExercise, setConfirmCreateExercise] = useState(false);
  const [cancelCreateExercise, setCancelCreateExercise] = useState(false);

  const resetRef = useRef<() => void>(null);

  //Get all question Tag.
  useEffect(() => {
    (async () => {
      const tag:[] = await API.get(Url.teachers.getAllQuestionTag, {
        token: authState.token, 
      });

      const formTags: any[] = [];
      tag.forEach(element => {
        formTags.push({value: element.name, label: element.name})
      });
      console.log(formTags);
      setTags(formTags);
    })();
  }, []);

  const basicInfo = useForm({
    initialValues: {
      nameExercise: "",
      maxTime: 1,
      startWeek: 1,
    },

    validate: {
      nameExercise: value => value.trim().length === 0 ? "Vui lòng nhập tên bài tập." : null,
      maxTime: value => (value > 0 && value <= 10) ? null : "Vui lòng nhập số lần thực hiện tối đa trong khoảng 1-5.",
    },
  });

  const addQuesForm = useForm({
    initialValues: {
      numQues: 1,
    },

    validate: {
      numQues: value => value >= 50 ? "Vui lòng nhập số câu hỏi muốn thêm trong khoảng 1-50." : null,
    },
  });

  const questionForm = useForm({
    initialValues: {
      questions: [{
        quesContent: "",
        imgSrc: null,
        audioSrc: null,
        tags: null,
        rightAnswer: "",
        wrongAnswer1: "",
        wrongAnswer2: "",
        wrongAnswer3: "",
        key: randomId(),
      }]
    },

    validate: {
      questions: {
        quesContent: (value) => value.trim().length === 0  ? 'Vui lòng nhập nội dung câu hỏi' : null,
        rightAnswer: (value) => value.trim().length === 0  ? 'Vui lòng nhập đáp án đúng' : null,
        wrongAnswer1: (value) => value.trim().length === 0  ? 'Vui lòng nhập đáp án sai' : null,
      },
    },
  });
  console.log("*************************************************");
  console.log(questionForm.values);

  const fields = questionForm.values.questions.map((item, index) => {
    
    return (
    <div key={item.key}>
      <Divider my="xl" size={"xl"} color={"violet"} />
        <Grid>
          <Grid.Col span={6}>
            <Title order={3} mt="md">Câu hỏi {index + 1}</Title>
          </Grid.Col>

          <Grid.Col span={6}>
            <Button 
              color={"red"} 
              leftIcon={<IconTrash size={14}/>} 
              mt="md" 
              style={{float: "right"}}
              onClick={() => questionForm.removeListItem('questions', index)}
            > 
              Xóa 
            </Button>
          </Grid.Col>
        </Grid>
        <Title order={5} mt="md">Nội dung câu hỏi:</Title>
        <Textarea mt="md" {...questionForm.getInputProps(`questions.${index}.quesContent`)} maxLength={300}/>

        <Grid>
          <Grid.Col span={6}>
            <Title order={5} mt="md">Hình ảnh:</Title>
            {item.imgSrc !== null && (
              <Box>
                <Image
                  mt={"sm"}
                  mb="sm"
                  withPlaceholder
                  placeholder={
                    <Container
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        maxWidth: "300px",
                      }}
                    >
                      <Loader variant="dots" />
                    </Container>
                  }
                  style={{ maxWidth: "300px" }}
                  radius="md"
                  src={URL.createObjectURL(item.imgSrc)}
                  alt="Hình đại diện"
                />
              </Box>
            )}
            <FileButton 
              resetRef={resetRef}
              accept="image/*" 
              {...questionForm.getInputProps(`questions.${index}.imgSrc`)}
            >
              {(props: any) => <Button {...props}>Thêm ảnh</Button>}
            </FileButton>
            <Button 
              ml={"sm"} 
              disabled={!item.imgSrc} 
              color="red" 
              onClick={() => {
                questionForm.values.questions[index].imgSrc = null;
                resetRef.current?.();
                setRerender(!rerender); 
              }}
            >
              Bỏ chọn
            </Button>
          </Grid.Col>

          <Grid.Col span={6}>
            <Title order={5} mt="md">Âm thanh:</Title>
            {item.audioSrc && (
              <Group 
                position="center" 
                mt={"sm"}
                mb="sm"
              >
                <audio controls>
                  <source src={URL.createObjectURL(item.audioSrc)}/>
                </audio>
              </Group>
            )}
            <FileButton
              accept="audio/*"
              {...questionForm.getInputProps(`questions.${index}.audioSrc`)}
            >
              {(props: any) => <Button {...props}>Thêm tệp</Button>}
            </FileButton>

            <Button 
              ml={"sm"} 
              disabled={!item.audioSrc} 
              color="red" 
              onClick={() => {
                questionForm.values.questions[index].audioSrc = null;
                resetRef.current?.();
                setRerender(!rerender); 
              }}
            >
              Bỏ chọn
            </Button>
          </Grid.Col>

          <Grid.Col span={12}>
            <Title order={5} mt="md">Tag</Title>
            <MultiSelect
              mt="md"
              data={tags}
              placeholder="Thêm tag cho câu hỏi"
              searchable
              clearable
              creatable
              rightSection={addTagLoading === true ? <Loader size={14}/> : null}
              getCreateLabel={(query) => `+ Thêm tag: ${query}`}
              onCreate={query => {
                addTagHandler(query)
                return { value: query, label: query };
              }}
              {...questionForm.getInputProps(`questions.${index}.tags`)}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Title order={5} mt="md">Đáp án:</Title>
          </Grid.Col>

          <Grid.Col span={6}>
            <Text mt="sm">Đáp án đúng.</Text>
            <Textarea mt="sm" {...questionForm.getInputProps(`questions.${index}.rightAnswer`)} maxLength={300}/>
          </Grid.Col>

          <Grid.Col span={6}>
            <Text mt="sm">Đáp án sai 1.</Text>
            <Textarea mt="sm" {...questionForm.getInputProps(`questions.${index}.wrongAnswer1`)} maxLength={300}/>
          </Grid.Col>

          <Grid.Col span={6}>
            <Text mt="sm">Đáp án sai 2.</Text>
            <Textarea mt="sm" {...questionForm.getInputProps(`questions.${index}.wrongAnswer2`)} maxLength={300}/>
          </Grid.Col>

          <Grid.Col span={6}>
            <Text mt="sm">Đáp án sai 3.</Text>
            <Textarea mt="sm" {...questionForm.getInputProps(`questions.${index}.wrongAnswer3`)} maxLength={300}/>
          </Grid.Col>

        </Grid>
    </div>
  )});

  //Handle Form Submit

  const handleCreateExercise = async () =>{
    try {
      console.log(basicInfo.values);
      console.log(questionForm.values);
      setConfirmCreateExercise(false);
      setLoader(true);
      //Validate Input
      basicInfo.validate();
      questionForm.validate();

      if (!basicInfo.isValid() || !questionForm.isValid())
        return;
      const arrImage = [];
      for(const question of questionForm.values.questions){
        arrImage.push(question.imgSrc);
      }
      const response = await API.post(Url.teachers.createCurriculumExercise, {
        token: authState.token, 
        curriculumId: props.curriculum.id,
				lectureId: lecture.id,
        basicInfo: basicInfo.values,
        ...questionForm.values,
      });
      console.log(response);

      //Send Image
      for(const question of questionForm.values.questions){
        if(question.imgSrc === null){
          continue;
        }
        const formData = new FormData();
        formData.append("temporaryKey", question.key);
        formData.append("image", question.imgSrc!);
        const result = await API.post(Url.teachers.sendQuesitonStoreImage, formData, {
          headers: {
            'x-access-token': authState.token || "",
            'content-type': 'multipart/form-data'
          },
        });
        if(result === false){
          toast.error("Gặp sự cố trong quá trình tải ảnh, vui lòng chỉnh sửa trong chi tiết bài tập.")
        }
      }

      //Send Audio
      for(const question of questionForm.values.questions){
        if(question.audioSrc === null){
          continue;
        }
        const formData = new FormData();
        formData.append("temporaryKey", question.key);
        formData.append("audio", question.audioSrc!);
        const result = await API.post(Url.teachers.sendQuesitonStoreAudio, formData, {
          headers: {
            'x-access-token': authState.token || "",
            'content-type': 'multipart/form-data'
          },
        });
        if(result === false){
          toast.error("Gặp sự cố trong quá trình tải tệp, vui lòng chỉnh sửa trong chi tiết bài tập.")
        }
      }

      //Delete TemporaryKey
      await API.post(Url.teachers.deleteQuestionStoreTemporaryKey, {
        token: authState.token, 
        exerciseId: response.id,
      });

			props.setListExercises((current: any) => [...current, {
        id: response.id,
        name: response.name,
        maxTime: response.maxTime,
        lecture: response.lecture,
				curriculum: response.curriculum,
      }])
      toast.success("Tạo bài tập thành công!");
      props.createExerState(false);
    }catch(error){
      console.log(error);
      toast.error("Hệ thống gặp sự cố, vui lòng thử lại sau!");
    }finally {
      setLoader(false);
    }
  };

  const addQuestionHandle = (values: any) =>{
    console.log(values);
    for(let idx = 0; idx < values.numQues; idx++)
      questionForm.insertListItem('questions', 
      {
        quesContent: "",
        imgSrc: null,
        audioSrc: null,
        tags: null,
        rightAnswer: "",
        wrongAnswer1: "",
        wrongAnswer2: "",
        wrongAnswer3: "",
        key: randomId(),
      });
    setAddQuestion(false);
  };

  const addTagHandler = async (query: string) => {
    try{
      setAddTagLoading(true);
      // await new Promise(r => setTimeout(r, 2000));
      const response = await API.post(Url.teachers.addNewQuestionTag, {
        token: authState.token, 
        tagName: query,
      });
      const item = { value: response.name, label: response.name };
      setTags((current: any) => [...current, item]);
      toast.success(`Thêm tag "${query}" thành công!`);
      return item;
    }catch(error){
      console.log(error);
      toast.error("Hệ thống gặp sự cố, vui lòng thử lại sau!");
    }finally {
      setAddTagLoading(false);
    }
  };
  
  console.log("==================================================")
  console.log(basicInfo.values)
  return (
    <Box ml={"md"} mt={"md"}>

      <Modal
        opened={loader}
        onClose={() => setLoader(false)}
        centered
        // closeOnClickOutside={true}
        withCloseButton={false}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Group>
          <Loader />
          <Text size={15}>Đang tạo...</Text>
        </Group>
      </Modal>

      <Title order={1} align="center">
        Tạo bài tập mới
      </Title>

			<Grid mt={"md"}>
          <Grid.Col span={6}>
            <Title order={3} mt="md">Chương trình học: {props.curriculum.name}</Title>
          </Grid.Col>
					<Grid.Col span={6}>
            <Title order={3} mt="md">Bài học: {lecture.name}</Title>
          </Grid.Col>
        </Grid>
      {/* Confirm to Create Exercise*/}
      <Modal
        centered
        opened={confirmCreateExercise}
        onClose={() => setConfirmCreateExercise(false)}
        withCloseButton={false}
      >
        <Group  position="center">
          <Text size="xl">Xác nhận tạo bài tập?</Text>
        </Group>
        <Group position="center">
          <Button type="submit" color={"green"} mt="md" onClick={handleCreateExercise}>
            Xác nhận
          </Button>
          <Button type="submit" color={"red"} mt="md" ml="sm" onClick={()=>setConfirmCreateExercise(false)}>
            Hủy bỏ  
          </Button>
        </Group>
      </Modal>

      {/* Confirm to Create Exercise*/}
      <Modal
        centered 
        opened={cancelCreateExercise}
        onClose={() => setCancelCreateExercise(false)}
        withCloseButton={false}
      >
        <Group  position="center">
          <Text size="xl">Xác nhận hủy tạo bài tập?</Text>
        </Group>
        <Group position="center">
          <Button type="submit" color={"green"} mt="md" onClick={()=>props.createExerState(false)}>
            Xác nhận
          </Button>
          <Button type="submit" color={"red"} mt="md" ml="sm" onClick={()=>setCancelCreateExercise(false)}>
            Hủy bỏ  
          </Button>
        </Group>
      </Modal>

      <form onSubmit={basicInfo.onSubmit((values) => console.log(values))}>
        <Grid>
          <Grid.Col span={6}>
            <Title order={4} mt="md">Tên bài tập</Title>
            <TextInput
              mt="md"
              withAsterisk
              placeholder="Tên bài tập"
              {...basicInfo.getInputProps("nameExercise")}
            />
          </Grid.Col>
					<Grid.Col span={6}>
            <Title order={4} mt="md">Số làn làm tối đa</Title>
            <TextInput
             mt="md"
              withAsterisk
              placeholder="1"
              {...basicInfo.getInputProps("maxTime")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
              <Title order={4} mt="md">
                Tuần bắt đầu
              </Title>

              <NumberInput
                mt="md"
                placeholder="1"
                max={120}
                min={1}
                {...basicInfo.getInputProps("startWeek")}
              />
            </Grid.Col>
        </Grid>
      </form>

      {/* Get Number of Question User Add */}
      <Modal
        centered 
        opened={addQuestion}
        onClose={() => setAddQuestion(false)}
      >
        <form onSubmit={addQuesForm.onSubmit((values) => addQuestionHandle(values))}>
          <TextInput
            mt="md"
            withAsterisk
            placeholder="1-50"
            label="Nhập số câu hỏi muốn thêm"
            {...addQuesForm.getInputProps("numQues")}
          />
          <Button type="submit" color={"green"} mt="md" leftIcon={<IconPlus size={14} />}>
            Thêm
          </Button>
        </form>
      </Modal>

      <Title order={4} mt="md">Tổng số câu hỏi: {questionForm.values.questions.length}</Title>

      <Button 
        color={"green"} 
        mt="md" 
        leftIcon={<IconPlus size={14} />} 
        onClick={() =>{setAddQuestion(true)}}
      >
        Thêm câu hỏi
      </Button>
      <form encType='multipart/form-data'>
        {fields}
      </form>

      <Container style={{ display: "flex", justifyContent: "center" }} mb={"xl"}>
        <Button mt="xl" onClick={() => setConfirmCreateExercise(true)}>Tạo bài tập</Button>
        <Button mt="xl" ml="md" color={"red"} onClick={() => setCancelCreateExercise(true)}>Hủy bỏ</Button>
      </Container>
    </Box>
  );
};

export default CurriculumCreateExercise;
