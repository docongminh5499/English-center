import React, { useEffect, useState } from "react";
import styles from "./DetailsCourse.module.css";
import Head from "next/head";
import { Tabs, Accordion } from "@mantine/core";
import { Container, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useAuth } from "../../../stores/Auth";
import {
  IconFileDescription, IconClockHour4, IconChartBar, IconBooks, IconZoomQuestion, IconUsers, IconBook, IconCurrentLocation
} from "@tabler/icons";
import { Course } from "../../../models/course.model";
import { getAvatarImageUrl, getImageUrl } from "../../../helpers/image.helper";
import { getLevelName } from "../../../helpers/getLevelName";
import moment from "moment";
import { formatCurrency } from "../../../helpers/formatCurrency";
import { UserRole } from "../../../helpers/constants";



const diffDays = (date1: Date, date2: Date) => {
  const diffTime: number = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}



interface IProps {
  course: Course | null;
}


const index = (props: IProps) => {
  const [authState, authAction] = useAuth();
  const router = useRouter();
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    if (props.course === null)
      router.replace("/not-found");
    else {
      authAction.turnOnGuestUI();
      setDidMount(true);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Chi tiết khóa học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {didMount && (
        <div className={styles.wrapPage}>
          <Container size="xl" style={{ width: "100%" }}>
            <div className={styles.contentPage}>
              <div className={styles.contentLeft}>

                {/* INFO AUTHOR */}
                <div className={styles.wrapInfoAuthor}>
                  <div className={styles.infoAuthor}>
                    <div className={styles.wrapAvatar}>
                      <img src={getAvatarImageUrl(props.course?.teacher.worker.user.avatar)} alt="avatar" className={styles.avatarAuthor} />
                    </div>
                    <div className={styles.wrapNameAuthor}>
                      <p className={styles.txtDes}>Giáo viên</p>
                      <p className={styles.txtName}>{props.course?.teacher.worker.user.fullName}</p>
                    </div>
                  </div>
                  <div className={styles.wrapCategory}>
                    <IconChartBar />
                    <div className={styles.wrapNameCatergory}>
                      <p className={styles.txtDes}>Trình độ</p>
                      <p className={styles.txtName}>{getLevelName(props.course?.curriculum.level)}</p>
                    </div>
                  </div>
                </div>

                {/* INFO COURSE */}
                <div className={styles.wrapInfoCourse}>
                  <p className={styles.nameCourse}>
                    {props.course?.name}
                  </p>
                  <div className={styles.listInfo}>
                    <div className={styles.infoItem}>
                      <IconBooks />
                      <p className={styles.txtLabel}>
                        {props.course?.curriculum.lectures.length} bài học
                      </p>
                    </div>
                    <div className={styles.infoItem}>
                      <IconClockHour4 />
                      <p className={styles.txtLabel}>
                        {Math.ceil(diffDays(
                          new Date(props.course?.openingDate || new Date()),
                          new Date(props.course?.expectedClosingDate || new Date())) / 7)} tuần ({moment(props.course?.openingDate).format("DD/MM/YYYY") + " - " + moment(props.course?.expectedClosingDate).format("DD/MM/YYYY")})
                      </p>
                    </div>
                    <div className={styles.infoItem}>
                      <IconUsers />
                      <p className={styles.txtLabel}>
                        {props.course?.maxNumberOfStudent} học sinh
                      </p>
                    </div>
                    <div className={styles.infoItem}>
                      <IconCurrentLocation />
                      <p className={styles.txtLabel}>
                        {props.course?.branch.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION COURSE */}
                <Tabs defaultValue="tab_curriculum" style={{ margin: "20px 0px 0px" }}>
                  <Tabs.List>
                    <Tabs.Tab value="tab_curriculum">Chương trình học</Tabs.Tab>
                    <Tabs.Tab value="tab_instructor">Giáo viên</Tabs.Tab>
                  </Tabs.List>
                  <Tabs.Panel value="tab_curriculum" className={styles.wrapContentTab}>
                    <div className={styles.contentTabCurriculum}>
                      <p className={styles.title}>
                        {props.course?.curriculum.name}
                      </p>
                      <p className={styles.des}>
                        {props.course?.curriculum.desc}
                      </p>
                      <div className={styles.listCurriculum}>
                        <Accordion variant="separated">
                          {props.course?.curriculum.lectures.map((lecture, index) => (
                            <Accordion.Item value={"value_" + (index + 1)}>
                              <Accordion.Control>
                                <div className={styles.titleCurriculumItem}>
                                  <IconBook />
                                  {lecture.name}
                                </div>
                              </Accordion.Control>
                              <Accordion.Panel>
                                <div className={styles.contentRichtext} dangerouslySetInnerHTML={{ __html: lecture.desc || "" }} />
                              </Accordion.Panel>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                      </div>
                    </div>
                  </Tabs.Panel>
                  <Tabs.Panel value="tab_instructor" className={styles.wrapContentTab}>
                    <div className={styles.tabInstructor}>
                      <div className={styles.instructorItem}>
                        <div className={styles.wrapThumbnail}>
                          <img src={getAvatarImageUrl(props.course?.teacher.worker.user.avatar)} alt="avatar" />
                        </div>
                        <div className={styles.infoInstructor}>
                          <p className={styles.name}>
                            {props.course?.teacher.worker.user.fullName}
                          </p>
                          <Text className={styles.des} weight={600}>Mô tả ngắn</Text>
                          <p className={styles.des}>
                            {props.course?.teacher.shortDesc}
                          </p>
                          <Text className={styles.des} weight={600}>Kinh nghiệm giảng dạy</Text>
                          <p className={styles.des}>
                            {props.course?.teacher.experience}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Tabs.Panel>
                </Tabs>

              </div>
              <div className={styles.contentRight}>
                {/* BOX PRICE */}
                <div className={styles.wrapPice}>
                  <div className={styles.wrapThumbnail}>
                    <img src={getImageUrl(props.course?.image)} alt="banner" />
                  </div>
                  <div className={styles.infoPrice}>
                    <p className={styles.txtPrice}>
                      {formatCurrency(props.course?.price)}
                    </p>
                    {authState.role === UserRole.GUEST && (
                      <button type="button" className={styles.buttonBuy}
                        onClick={() => router.push({
                          pathname: "/register",
                          query: { returnUrl: router.asPath },
                        })}>
                        Đăng ký ngay
                      </button>
                    )}
                    {(authState.role === UserRole.STUDENT) && (
                      <button type="button" className={styles.buttonBuy}>
                        Tham gia khóa học
                      </button>
                    )}
                    {(authState.role === UserRole.PARENT) && (
                      <button type="button" className={styles.buttonBuy}>
                        Tham gia khóa học
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}
    </>
  )
}

export default index