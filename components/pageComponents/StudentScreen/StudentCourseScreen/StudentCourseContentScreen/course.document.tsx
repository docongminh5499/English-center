import { Box, Button, Grid, Group, Loader, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../../helpers/api";
import { Url } from "../../../../../helpers/constants";
import { getDocumentUrl } from "../../../../../helpers/image.helper";
import { useAuth } from "../../../../../stores/Auth";

const CourseDocumentTab = (props: any) => {
  const [authState] = useAuth();
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState([]);
  const course = props.course;
  useEffect(() => {
    const didMountFunc = async () => {
      try {
        setLoading(true);
        const responses = await API.get(Url.students.getAllDocument, {
          token: authState.token,
          courseId: course.id,
        });
        setDocument(responses);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
      }
    };
    didMountFunc();
  }, []);
  console.log("********************************");
  console.log(document);
  return (
    <>
      <Group position="center" mt={"md"}>
        <Title order={1}> Danh sách tài liệu </Title>
      </Group>

      {loading === true && <Loader variant="dots" />}

      {loading === false && (
        <>
          {document.length === 0 && (
            <Group position="center">
              <Title order={2}> Hiện không có tài liệu nào. </Title>
            </Group>
          )}

          {document.length !== 0 &&
            document.map((element: any, idx: number) => {
              return (
                <Grid key={idx} mt="md">
                  <Grid.Col span={9}>
                    <Text weight={600} color="#444" p={8}>
                      {element.name.toLocaleUpperCase()}{" "}
                      {element.author && "- Tác giả: " + element.author}
                      {element.pubYear && ", " + element.pubYear}
                    </Text>
                  </Grid.Col>

                  <Grid.Col span={3}>
                    {element.src && (
                      <a
                        href={getDocumentUrl(element.src)}
                        target="_blank"
                        style={{ color: "white", width: "100%" }}
                      >
                        <Button fullWidth variant="light">
                          Xem tài liệu
                        </Button>
                      </a>
                    )}
                  </Grid.Col>
                </Grid>
              );
            })}
        </>
      )}
    </>
  );
};

export default CourseDocumentTab;
