import React, { useEffect, useState } from "react";
import styles from "./DetailsCourse.module.css";
import Head from "next/head";
import { Tabs, Accordion } from "@mantine/core";
import { Container } from "@mantine/core";
import { useRouter } from "next/router";
import { useAuth } from "../../../stores/Auth";
import { IconFileDescription , IconClockHour4, IconChartBar, IconBooks, IconZoomQuestion, IconUsers, IconBook
} from "@tabler/icons";

const index = (props : any) => {
    const [authState] = useAuth();
    const router = useRouter();
    const [didMount, setDidMount] = useState(false);

    useEffect(() => {
        setDidMount(true);
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
                                            <img src="/assets/images/listcourse_banner.jpg" alt="avatar" className={styles.avatarAuthor} />
                                        </div>
                                        <div className={styles.wrapNameAuthor}>
                                            <p className={styles.txtDes}>Instructor</p>
                                            <p className={styles.txtName}>Kelly Anderson</p>
                                        </div>
                                    </div>
                                    <div className={styles.wrapCategory}>
                                        <IconFileDescription/>
                                        <div className={styles.wrapNameCatergory}>
                                            <p className={styles.txtDes}>Category</p>
                                            <p className={styles.txtName}>Web Designer</p>
                                        </div>
                                    </div>
                                </div>

                                {/* INFO COURSE */}
                                <div className={styles.wrapInfoCourse}>
                                    <p className={styles.nameCourse}>
                                        Advanced UI/UX design course
                                    </p>
                                    <div className={styles.listInfo}>
                                        <div className={styles.infoItem}>
                                            <IconClockHour4/>
                                            <p className={styles.txtLabel}>
                                                11 weeks
                                            </p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <IconChartBar/>
                                            <p className={styles.txtLabel}>
                                                all levels
                                            </p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <IconBooks/>
                                            <p className={styles.txtLabel}>
                                               3 lessons
                                            </p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <IconZoomQuestion/>
                                            <p className={styles.txtLabel}>
                                                1 quiz
                                            </p>
                                        </div>

                                        <div className={styles.infoItem}>
                                            <IconUsers/>
                                            <p className={styles.txtLabel}>
                                                24 students
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* DESCRIPTION COURSE */}
                                <Tabs defaultValue="tab_overview" style={{margin: "20px 0px 0px"}}>
                                    <Tabs.List>
                                        <Tabs.Tab value="tab_overview">Overview</Tabs.Tab>
                                        <Tabs.Tab value="tab_curriculum">Curriculum</Tabs.Tab>
                                        <Tabs.Tab value="tab_instructor">Instructor</Tabs.Tab>
                                    </Tabs.List>
                                    <Tabs.Panel value="tab_overview" className={styles.wrapContentTab}>
                                        <div className={styles.contentRichtext} dangerouslySetInnerHTML={{ __html: `<p>Hello</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>` }} />
                                    </Tabs.Panel>
                                    <Tabs.Panel value="tab_curriculum" className={styles.wrapContentTab}>
                                        <div className={styles.contentTabCurriculum}>
                                            <p className={styles.title}>
                                                Lesson Title
                                            </p>
                                            <p className={styles.des}>
                                                Appellas Dicta Tanto Pollicentur Festo Difficultate Istud Dicamus Dogmata Autem Optime
                                            </p>
                                            <div className={styles.listCurriculum}>
                                                <Accordion variant="separated">
                                                    <Accordion.Item value="value_1">
                                                        <Accordion.Control>
                                                            <div className={styles.titleCurriculumItem}>
                                                                <IconBook/>
                                                                Sample course 5 – Lesson 1
                                                            </div>
                                                        </Accordion.Control>
                                                        <Accordion.Panel>
                                                            <div className={styles.contentRichtext} dangerouslySetInnerHTML={{ __html: `<p>Hello</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>` }} />
                                                        </Accordion.Panel>
                                                    </Accordion.Item>
                                                    <Accordion.Item value="value_2">
                                                        <Accordion.Control>
                                                            <div className={styles.titleCurriculumItem}>
                                                                <IconBook/>
                                                                Sample course 5 – Lesson 1
                                                            </div>
                                                        </Accordion.Control>
                                                        <Accordion.Panel>
                                                        <div className={styles.contentRichtext} dangerouslySetInnerHTML={{ __html: `<p>Hello</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>` }} />
                                                        </Accordion.Panel>
                                                    </Accordion.Item>
                                                </Accordion>
                                            </div>
                                        </div>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="tab_instructor" className={styles.wrapContentTab}>
                                        <div className={styles.tabInstructor}>
                                            <div className={styles.instructorItem}>
                                                <div className={styles.wrapThumbnail}>
                                                    <img src="/assets/images/listcourse_banner.jpg" alt="avatar" />
                                                </div>
                                                <div className={styles.infoInstructor}>
                                                    <p className={styles.name}>
                                                        Kelly Anderson
                                                    </p>
                                                    <p className={styles.des}>
                                                        Adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim elit.
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
                                        <img src="/assets/images/listcourse_banner.jpg" alt="banner" />
                                    </div>
                                    <div className={styles.infoPrice}>
                                        <p className={styles.txtPrice}>
                                            $79.00
                                        </p>
                                        <button type="button" className={styles.buttonBuy}>
                                            Buy Now
                                        </button>
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