import React, { useEffect, useState } from "react";
import styles from "./ListCourse.module.css";
import Head from "next/head";
import { Button, Container, Group, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useAuth } from "../../../stores/Auth";
import { IconCertificate, IconSend, IconBrandTelegram, IconPlayerPlay, IconScreenShare, IconMessageChatbot, IconSchool, IconRecharging, IconUsers, IconBrandZoom, IconQuote, IconMapPin } from "@tabler/icons";
import CourseSaleComponent from './components/CourseSale'
import { Carousel } from '@mantine/carousel';
import Sliders from '../../commons/Sliders'
import ModalWrapper from "./components/WrapModalVideo";
import { Course } from "../../../models/course.model";
import Tag from "../../../models/tag.model";
import Branch from "../../../models/branch.model";
import MaskedComment from "../../../models/maskedComment.model";
import { getAvatarImageUrl } from "../../../helpers/image.helper";
import Image from "next/image";


interface IProps {
  courses: Course[];
  studentCounts: number;
  courseCounts: number;
  curriculumTags: Tag[];
  branches: Branch[];
  comments: MaskedComment[];
}


const index = (props: IProps) => {
  const [authState] = useAuth();
  const router = useRouter();
  const [isOpenVideoModal, setOpenVideoModal] = useState(false);



  return (
    <>
      <Head>
        <title>English Center - Trung tâm Tiếng anh uy tín hàng đầu Việt Nam</title>
        <meta name="description" content="English Center webpages for looking center's information,
         registering new account and enrolling suitable courses. More than that,
         it helps students and parents tracking their own learning process,
         helps employees and teachers managing work as well."></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.wrapPage}>
        <div className={styles.banner}>
          <Carousel
            slideSize="100%"
            align="center"
            slidesToScroll={1}
            className={styles.fullHeightSlider}
            loop={true}
          >
            <Carousel.Slide>
              <div className={styles.slider}>
                <div className={styles.slideItem}>
                  <div className={styles.infoSlide}>
                    <p className={styles.desSlide}>
                      Học theo cách khác biệt
                    </p>
                    <h2 className={styles.titleSlide}>
                      Chúng tôi có cách tiếp cận
                      <br />
                      sáng tạo
                    </h2>
                  </div>
                  <div className={styles.overlay}></div>
                  <Image layout="fill" priority={true} className={styles.pictureBanner} src="/assets/images/listcourse_banner.jpg" alt="banner" />
                </div>
              </div>
            </Carousel.Slide>
            <Carousel.Slide>
              <div className={styles.slider}>
                <div className={styles.slideItem}>
                  <div className={styles.infoSlide}>
                    <p className={styles.desSlide}>
                      Phong cách chuyên nghiệp
                    </p>
                    <h2 className={styles.titleSlide}>
                      Đội ngũ giáo viên giàu
                      <br />
                      kinh nghiệm
                    </h2>
                  </div>
                  <div className={styles.overlay}></div>
                  <Image layout="fill" className={styles.pictureBanner} src="/assets/images/listcourse_banner_1.jpg" alt="banner" />
                </div>
              </div>
            </Carousel.Slide>
            <Carousel.Slide>
              <div className={styles.slider}>
                <div className={styles.slideItem}>
                  <div className={styles.infoSlide}>
                    <p className={styles.desSlide}>
                      Mỗi học sinh đều khác biệt
                    </p>
                    <h2 className={styles.titleSlide}>
                      Được tư vấn theo
                      <br />
                      cá nhân
                    </h2>
                  </div>
                  <div className={styles.overlay}></div>
                  <Image layout="fill" className={styles.pictureBanner} src="/assets/images/listcourse_banner_2.jpg" alt="banner" />
                </div>
              </div>
            </Carousel.Slide>
          </Carousel>
        </div>

        {/* LIST SERVICES */}
        <div className={styles.wrapService}>
          <Container size="xl" style={{ width: "100%" }}>
            <div className={styles.gridService}>
              <div className={styles.serviceItem}>
                <div className={styles.wrapIcon}>
                  <IconScreenShare size={'7rem'} />
                </div>
                <p className={styles.titleService}>
                  Khóa học đa dạng
                </p>
                <p className={styles.desService}>
                  Tập hợp nhiều chủ đề thường ngày.
                </p>
              </div>
              <div className={styles.serviceItem}>
                <div className={styles.wrapIcon}>
                  <IconMessageChatbot size={'7rem'} />
                </div>
                <p className={styles.titleService}>
                  Hỗ trợ 24/7
                </p>
                <p className={styles.desService}>
                  Hệ thống trò chuyện tích hợp.
                </p>
              </div>
              <div className={styles.serviceItem}>
                <div className={styles.wrapIcon}>
                  <IconSchool size={'7rem'} />
                </div>
                <p className={styles.titleService}>
                  Hỗ trợ phụ huynh
                </p>
                <p className={styles.desService}>
                  Phụ huynh có thể theo dõi học sinh.
                </p>
              </div>
              <div className={styles.serviceItem}>
                <div className={styles.wrapIcon}>
                  <IconRecharging size={'7rem'} />
                </div>
                <p className={styles.titleService}>
                  Linh hoạt
                </p>
                <p className={styles.desService}>
                  Học bù bất kỳ lúc nào.
                </p>
              </div>
            </div>
          </Container>
        </div>

        {/* LIST COURSE */}
        <div className={styles.wrapCourse}>
          <Container size="xl" style={{ width: "100%" }}>
            <p className={styles.desSection}>
              Khóa học
            </p>
            <h2 className={styles.titleSection}>
              Nâng cấp kỹ năng của bạn
            </h2>
            <div className={styles.gridCourse}>
              {props.courses.map((course, index) => (
                <CourseSaleComponent {...course} key={index} />
              ))}
            </div>
            <Container p={0} mt={40} style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <button className={styles.buttonCTA} onClick={() => router.push("/courses")} aria-label="see all courses">
                Xem tất cả
              </button>
            </Container>
          </Container>
        </div>

        {/* FORM SUBSCRIBE */}
        <div className={styles.wrapSubscribe}>
          <Container size="xl" style={{ width: "100%" }}>
            <div className={styles.wrapIconSection}>
              <IconSend size={'3rem'} />
            </div>

            <h2 className={styles.titleSection}>
              Nhận những blog hay nhất vào hộp thư của bạn!
            </h2>

            <form className={styles.wrapFormSubscribe}>
              <div className={styles.formSubscribe}>
                <input className={styles.txtInput} placeholder="Nhập địa chỉ email của bạn" type="email" required />
                <button type="submit" className={styles.buttonSubmit} aria-label="register">
                  <IconBrandTelegram size={'2rem'} />
                  Đăng ký
                </button>
              </div>
            </form>
          </Container>
        </div>

        {/* VIDEO */}
        <div className={styles.wrapVideoDemo}>
          <Container size="xl" style={{ width: "100%" }}>
            <div className={styles.videoDemo}>
              <div className={styles.ovlerlay}></div>
              <Image layout="fill" src="/assets/images/listcourse_bannerVideo.jpg" className={styles.thumbnail} alt="banner-video" />
              <button type="button" className={styles.buttonPlay} onClick={() => setOpenVideoModal(true)} aria-label="play video">
                <IconPlayerPlay size={'2.5rem'} />
              </button>
            </div>
          </Container>
        </div>
        <ModalWrapper isVisible={isOpenVideoModal} closeModal={setOpenVideoModal}>
          <div className={styles.videoModalContainer}>
            {isOpenVideoModal ? (
              <div className={styles.videoModalIframe}>
                <div className={styles.videoModalClose} onClick={() => setOpenVideoModal(false)}></div>
                <iframe
                  className={styles.video}
                  src="https://www.youtube.com/embed/tgbNymZ7vqY"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            ) : null}
          </div>
        </ModalWrapper>

        {/* ANALYSIS */}
        <div className={styles.wrapAnalysis}>
          <Container size="xl" style={{ width: "100%" }}>
            <div className={styles.analysis}>
              <div className={styles.analysisItem}>
                <p className={styles.subTitle}>
                  SỨ MỆNH
                </p>
                <p className={styles.title}>
                  Xây dựng môi trường tốt nhất.
                </p>
                <p className={styles.description}>
                  Chúng tôi luôn hướng đến chất lượng giáo dục để tạo nên một môi trường ngoại ngữ tốt nhất cho học viên, truyền cảm hứng cho các học viên trong hành trình chinh phục ngoại ngữ.
                </p>
              </div>

              <div className={styles.listAnalysisItem}>
                <div className={styles.contentAnalysisItem}>
                  <div className={styles.wrapInfo}>
                    <div className={styles.wrapIcon}>
                      <IconUsers />
                    </div>
                    <div className={styles.info}>
                      <p className={styles.title}>
                        Học viên
                      </p>
                      <p className={styles.description}>
                        Chúng tôi đang đào tạo rất nhiều học sinh trên khắp cả nước.
                      </p>
                    </div>
                  </div>
                  <p className={styles.number}>
                    {props.studentCounts}
                  </p>
                </div>
                <div className={styles.contentAnalysisItem}>
                  <div className={styles.wrapInfo}>
                    <div className={styles.wrapIcon}>
                      <IconCertificate />
                    </div>
                    <div className={styles.info}>
                      <p className={styles.title}>
                        Khóa học
                      </p>
                      <p className={styles.description}>
                        Với chiều dài lịch sử phát triển, chúng tôi đã cung cấp nhiều khóa học chất lượng cho học sinh.
                      </p>
                    </div>
                  </div>
                  <p className={styles.number}>
                    {props.courseCounts}
                  </p>
                </div>
                <div className={styles.contentAnalysisItem}>
                  <div className={styles.wrapInfo}>
                    <div className={styles.wrapIcon}>
                      <IconBrandZoom />
                    </div>
                    <div className={styles.info}>
                      <p className={styles.title}>
                        Chủ đề
                      </p>
                      <p className={styles.description}>
                        Với số lượng chủ đề đa dạng, trung tâm chúng tôi sẽ giúp học sinh làm quen với mọi tình huống thường gặp hằng ngày.
                      </p>
                    </div>
                  </div>
                  <p className={styles.number}>
                    {props.curriculumTags.length}
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </div>


        {/* PEOPLE SAY */}
        <div className={styles.wrapPeopleSay}>
          <Container size="xl" style={{ width: "100%" }}>
            <p className={styles.subTitle}>
              Nhận xét
            </p>
            <p className={styles.title}>
              Học viên nói gì về chúng tôi
            </p>
            <div className={styles.sliderPeople}>
              {props.comments.map((comment, index) => (
                <div className={styles.sliderPeopleItem} key={index}>
                  <span className={styles.iconQuote}>
                    <IconQuote />
                  </span>
                  <Text className={styles.contentQuote} lineClamp={6}>
                    {comment.comment}
                  </Text>
                  <div className={styles.authorQuote}>
                    <div className={styles.wrapAvatar}>
                      <img src={getAvatarImageUrl(comment.avatar)} alt="thumbnaill" />
                    </div>
                    <div className={styles.infoAuthor}>
                      <p className={styles.name}>
                        {comment.userFullName}
                      </p>
                      <p className={styles.job}>
                        Học viên
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div>

        {/* ARTICLE */}
        <div className={styles.wrapArticle}>
          <Container size="xl" style={{ width: "100%" }}>
            <p className={styles.subTitle}>
              Chi nhánh
            </p>
            <p className={styles.title}>
              Chúng tôi có mặt khắp cả nước
            </p>
            <div className={styles.listArticle}>
              {props.branches.map((branch, index) => (
                <Container key={index} p={0} style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "2rem"
                }}>
                  <Container className={styles.wrapIcon} p={0}>
                    <IconMapPin />
                  </Container>
                  <Container p={0} style={{ flexGrow: 1 }}>
                    <Text weight={700} style={{ fontSize: "1.6rem" }}>{branch.name}</Text>
                    <Text color="dimmed" style={{ fontSize: "1.2rem" }}>{branch.address}</Text>
                  </Container>
                </Container>
              ))}
            </div>
          </Container>
        </div>

        {/* BRAND */}
        <div className={styles.wrapBrand}>
          <Container size="xl" style={{ width: "100%" }}>
            <div className={styles.listBranch}>
              <div className={styles.wrapIcon}><img src="/assets/icons/ic_branch_1.webp" alt="icon" /></div>
              <div className={styles.wrapIcon}><img src="/assets/icons/ic_branch_2.png" alt="icon" /></div>
              <div className={styles.wrapIcon}><img src="/assets/icons/ic_branch_3.png" alt="icon" /></div>
              <div className={styles.wrapIcon}><img src="/assets/icons/ic_branch_4.png" alt="icon" /></div>
              <div className={styles.wrapIcon}><img src="/assets/icons/ic_branch_5.png" alt="icon" /></div>
              <div className={styles.wrapIcon}><img src="/assets/icons/ic_branch_6.png" alt="icon" /></div>
            </div>
          </Container>
        </div>
      </div>
    </>
  )
}

export default index