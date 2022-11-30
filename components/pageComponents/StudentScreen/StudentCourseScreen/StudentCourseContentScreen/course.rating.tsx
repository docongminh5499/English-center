import { Button, Checkbox, Group, Loader, Textarea, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconStar, IconMoodSmileBeam } from '@tabler/icons';
import { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../../helpers/api";
import { Url } from "../../../../../helpers/constants";
import { useAuth } from "../../../../../stores/Auth";



const CourseRatingTab = (props: any) => {
  const [authState,] = useAuth();
  const [loading, setLoading] = useState(false);
  const [assessSuccess, setAssessSuccess] = useState(() =>{
    const studentParticipateCourse = props.studentPaticipateCourses;
    if (studentParticipateCourse.filter((value: any) => value.student.user.id === authState.userId && value.starPoint !== null).length !== 0)
      return true;
    return false;
  });
  const [starPoint, setStarPoint] = useState(4);
  const maxStar = 5;
  console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
  console.log(props.expectedClosingDate)
  const expectedClosingDate = new Date(props.expectedClosingDate);
  const now = new Date();
  let isAssessTime = Math.abs(expectedClosingDate.getTime() - now.getTime()) < 14 * 24 * 60 * 60 * 1000;

  const form = useForm({
    initialValues: {
      comment: '',
      isIncognito: false,
    },

    validate: {
    },
  });

  const handleSubmit = async (values: any) => {
    console.log("==============================");
    console.log(props);
    console.log(values);
    console.log(starPoint);
    try {
      setLoading(true);
      const result = await API.post(Url.students.sendAssessCourse, {token: authState.token, courseId: props.id, starPoint: starPoint, ...values});
      setAssessSuccess(result);
    }catch(err){
      console.log(err);
      toast.error("Hệ thống gặp sự cố, vui lòng thử lại sau!");
    }finally{
      setLoading(false);
    }
  }
  
  return (
    <>
      <Title order={1} align="center" style={{ margin: "20px 0px" }}>
        Đánh giá khóa học
      </Title>
      {assessSuccess && 
        <>
          <Group position="center" m="md">
            <IconMoodSmileBeam size={200}/>
          </Group>
          <Group position="center" m="md">
            <Title order={1} align="center" style={{ margin: "20px 0px" }}>
              Cảm ơn bạn đã thực hiện đánh giá khóa học!
            </Title>
          </Group>
        </>
      }
      {!loading && !assessSuccess && isAssessTime &&
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>

        <Group position="center">
          {Array(maxStar).fill(0).map((_, index) => {
            if (index < starPoint)
              return <IconStar 
                      key={index} 
                      fill="#F29D38" 
                      color="#F29D38" 
                      onClick={()=>setStarPoint(index + 1)}
                    />
            return <IconStar 
                      key={index} 
                      color="#F29D38" 
                      onClick={()=>setStarPoint(index + 1)} />
          })}
        </Group>

          <Title order={5} align="left" style={{ margin: "20px 0px" }}>
              Nhận xét
          </Title>

          <Textarea
            size="xl"
            maxLength={200}
            h="sm"
            placeholder="Nhập nhận xét của bạn"
            {...form.getInputProps('comment')}
          >

          </Textarea>

          <Group position="right" m="md">
            <Checkbox
              mt="md"
              label="Ẩn danh"
              radius="xl"
              {...form.getInputProps('isIncognito', { type: 'checkbox' })}
              style={{paddingRight: "0px"}}
            />
          </Group>

          <Group position="right" m="md">
            <Button type="submit">Xác nhận</Button>
          </Group>
          
        </form>
      }
      {!loading && !assessSuccess && !isAssessTime &&
        <Group position="center" mt={50}>
          <Title order={3} color={"gray"}>Đánh giá sẽ mở trước và sau ngày kết thúc khóa học 2 tuần.</Title>
        </Group>
      }
      {loading && !assessSuccess &&
        <Group position="center" mt={50}>
          <Loader/>
        </Group>
      }
    </>
  );
};

export default CourseRatingTab;
