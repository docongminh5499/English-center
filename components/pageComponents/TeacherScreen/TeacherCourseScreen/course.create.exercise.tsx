import { Box, Button, Container, Divider, FileButton, Grid, Group, Input, Loader, Modal, MultiSelect, PasswordInput, Popover, Progress, Text, Textarea, TextInput, Title } from "@mantine/core";
import { DatePicker, DateRangePicker, DateRangePickerValue, TimeInput, TimeRangeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { IconChevronDown, IconPlus, IconTrash } from "@tabler/icons";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { Url } from "../../../../helpers/constants";
import { useAuth } from "../../../../stores/Auth";

const CourseCreateExercise = (props: any) => {
  console.log(props);
  const now = new Date();
  const [addQuestion, setAddQuestion] = useState(false);
  const [authState,] = useAuth();
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
      startDate: now,
      startTime: now,
      endDate: now,
      endTime: now,
    },

    validate: {
      nameExercise: value => value.trim().length === 0 ? "Vui lòng nhập tên bài tập." : null,
      maxTime: value => (value > 0 && value <= 5) ? null : "Vui lòng nhập số lần thực hiện tối đa trong khoảng 1-5.",
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
  console.log(questionForm);

  const fields = questionForm.values.questions.map((item, index) => (
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
            {item.imgSrc && (
              <Text size="sm" mt="sm">
                Tệp đã chọn: {item.imgSrc.name}
              </Text>
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
              onClick={() => {questionForm.values.questions[index].imgSrc = null; resetRef.current?.();}}
            >
              Bỏ chọn
            </Button>
          </Grid.Col>

          <Grid.Col span={6}>
            <Title order={5} mt="md">Âm thanh:</Title>
            {item.audioSrc && (
              <Text size="sm" mt="md">
                Tệp đã chọn: {item.audioSrc.name}
              </Text>
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
              onClick={() => {questionForm.values.questions[index].audioSrc = null; resetRef.current?.();}}
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
                addTagHandler(query, index)
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
  ));

  //Handle Form Submit

  const handleCreateExercise = async () =>{
    try {
      console.log(basicInfo.values);
      console.log(questionForm.values);
      setConfirmCreateExercise(false);
      //Validate Input
      basicInfo.validate();
      questionForm.validate();

      if (!basicInfo.isValid() || !questionForm.isValid())
        return;
      const response = await API.post(Url.teachers.createExercise, {
        token: authState.token, 
        courseId: props.courseId, 
        basicInfo: basicInfo.values,
        ...questionForm.values,
      });
      console.log(response);

      props.setListExercises((current: any) => [...current, {
        id: response.id,
        name: response.name,
        openTime: response.openTime,
        endTime: response.endTime,
        maxTime: response.maxTime,
      }])
      toast.success("Tạo bài tập thành công!");
      props.createExerState(false);
    }catch(error){
      console.log(error);
      toast.error("Hệ thống gặp sự cố, vui lòng thử lại sau!");
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
      setTags((current) => [...current, item]);
      toast.success(`Thêm tag "${query}" thành công!`);
      return item;
    }catch(error){
      console.log(error);
      toast.error("Hệ thống gặp sự cố, vui lòng thử lại sau!");
    }finally {
      setAddTagLoading(false);
    }
  };
  const [openTimePopoverOpened, setOpenTimePopoverOpened] = useState(false);
  const [endTimePopoverOpened, setEndTimePopoverOpened] = useState(false);
  const [openTime, setOpenTime] = useState(now);
  const [endTime, setEndTime] = useState(now);
  console.log("==================================================")
  console.log(basicInfo.values)
  return (
    <>
      <Title order={1} align="center">
        Tạo bài tập mới
      </Title>

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

            <Title order={4} mt="md">Số làn làm tối đa</Title>
            <TextInput
             mt="md"
              withAsterisk
              placeholder="1"
              {...basicInfo.getInputProps("maxTime")}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Title order={4} mt="md">Thời gian mở</Title>
            <Group mt="md" grow>
              <Popover opened={openTimePopoverOpened} position="bottom" width="target" transition="pop">
                <Popover.Target>
                  <div
                    onFocusCapture={() => setOpenTimePopoverOpened(true)}
                  >
                    <Input
                      placeholder="Thời gian bắt đầu"
                      value={moment(openTime).format("HH:mm - DD/MM/YYYY")}
                      onChange={() => {}}
                    />
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <TimeInput
                    mt="sm"
                    defaultValue={new Date()}
                    label="Chọn giờ"
                    withSeconds 
                    {...basicInfo.getInputProps("startTime")}
                  />
                  <DatePicker
                    mt="sm"
                    locale="vi"
                    label="Chọn ngày"
                    defaultValue={new Date()}
                    {...basicInfo.getInputProps("startDate")}
                  />

                <Button 
                  mt="sm" 
                  onClick={() => {
                    setOpenTimePopoverOpened(false);
                    const startDate = basicInfo.values.startDate;
                    const startTime = basicInfo.values.startTime;
                    setOpenTime(new Date(
                      startDate.getFullYear(), 
                      startDate.getMonth(), 
                      startDate.getDate(), 
                      startTime.getHours(),
                      startTime.getMinutes(),
                      startTime.getSeconds(),
                    ));
                  }}>
                  Chọn
                </Button>
                </Popover.Dropdown>
              </Popover>
            </Group>

            <Title order={4} mt="md">Thời gian đóng</Title>
            <Group mt="md" grow>
              <Popover opened={endTimePopoverOpened} position="bottom" width="target" transition="pop">
                <Popover.Target>
                  <div
                    onFocusCapture={() => setEndTimePopoverOpened(true)}
                  >
                    <Input
                      placeholder="Thời gian kết thúc"
                      value={moment(endTime).format("HH:mm - DD/MM/YYYY")}
                      onChange={() => {}}
                    />
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <TimeInput
                    mt="sm"
                    defaultValue={new Date()}
                    label="Chọn giờ"
                    withSeconds 
                    {...basicInfo.getInputProps("endTime")}
                  />
                  <DatePicker
                    mt="sm"
                    locale="vi"
                    label="Chọn ngày"
                    defaultValue={new Date()}
                    {...basicInfo.getInputProps("endDate")}
                  />

                <Button 
                  mt="sm" 
                  onClick={() => {
                    setEndTimePopoverOpened(false);
                    const endDate = basicInfo.values.endDate;
                    const endTime = basicInfo.values.endTime;
                    setEndTime(new Date(
                      endDate.getFullYear(), 
                      endDate.getMonth(), 
                      endDate.getDate(), 
                      endTime.getHours(),
                      endTime.getMinutes(),
                      endTime.getSeconds(),
                    ));
                  }}>
                  Chọn
                </Button>
                </Popover.Dropdown>
              </Popover>
            </Group>
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

      {fields}

      <Container style={{ display: "flex", justifyContent: "center" }}>
        <Button mt="xl" onClick={() => setConfirmCreateExercise(true)}>Tạo bài tập</Button>
        <Button mt="xl" ml="md" color={"red"} onClick={() => setCancelCreateExercise(true)}>Hủy bỏ</Button>
      </Container>
    </>
  );
};

export default CourseCreateExercise;
