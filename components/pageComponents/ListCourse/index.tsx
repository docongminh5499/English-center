import React, { useEffect, useState } from "react";
import styles from "./ListCourse.module.css";
import Head from "next/head";
import { Container } from "@mantine/core";
import { useRouter } from "next/router";
import { useAuth } from "../../../stores/Auth";
import { IconCertificate, IconSend, IconBrandTelegram, IconPlayerPlay, IconScreenShare, IconMessageChatbot, IconSchool, IconRecharging, IconUsers, IconBrandZoom, IconQuote } from "@tabler/icons";
import CourseSaleComponent from './components/CourseSale'
import { Carousel } from '@mantine/carousel';
import Sliders from '../../commons/Sliders'
import ModalWrapper from "./components/WrapModalVideo";

const index = (props : any) => {
    const [authState] = useAuth();
    const router = useRouter();
    const [didMount, setDidMount] = useState(false);
    const [isOpenVideoModal, setOpenVideoModal] = useState(false);

    useEffect(() => {
        setDidMount(true);
    }, []);

    return (
        <>
            <Head>
                <title>Danh sách khóa học</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {didMount && (
                <div className={styles.wrapPage}>
                 
                    <div className={styles.banner}>
                        <Carousel
                            slideSize="100%"
                            align="center"
                            slidesToScroll={1}
                            className={styles.fullHeightSlider}
                            >
                            <Carousel.Slide >
                                <div className={styles.slider}>
                                    <div className={styles.slideItem}>
                                        <div className={styles.infoSlide}>
                                            <p className={styles.desSlide}>
                                                Consectetur adipiscing elit
                                            </p>
                                            <h2 className={styles.titleSlide}>
                                                We Choose Creative 
                                                <br/>
                                                Approach
                                            </h2>
                                            <button type="button" className={styles.buttonSlide}>
                                                View more
                                            </button>
                                        </div>
                                        <div className={styles.overlay}></div>
                                        <img className={styles.pictureBanner} src="/assets/images/listcourse_banner.jpg" alt="banner" />
                                    </div>
                                </div>
                            </Carousel.Slide>
                            <Carousel.Slide>
                                <div className={styles.slider}>
                                    <div className={styles.slideItem}>
                                        <div className={styles.infoSlide}>
                                            <p className={styles.desSlide}>
                                                Consectetur adipiscing elit
                                            </p>
                                            <h2 className={styles.titleSlide}>
                                                We Choose Creative 
                                                <br/>
                                                Approach
                                            </h2>
                                            <button type="button" className={styles.buttonSlide}>
                                                View more
                                            </button>
                                        </div>
                                        <div className={styles.overlay}></div>
                                        <img className={styles.pictureBanner} src="/assets/images/listcourse_banner.jpg" alt="banner" />
                                    </div>
                                </div>
                            </Carousel.Slide>
                            <Carousel.Slide>
                                <div className={styles.slider}>
                                    <div className={styles.slideItem}>
                                        <div className={styles.infoSlide}>
                                            <p className={styles.desSlide}>
                                                Consectetur adipiscing elit
                                            </p>
                                            <h2 className={styles.titleSlide}>
                                                We Choose Creative 
                                                <br/>
                                                Approach
                                            </h2>
                                            <button type="button" className={styles.buttonSlide}>
                                                View more
                                            </button>
                                        </div>
                                        <div className={styles.overlay}></div>
                                        <img className={styles.pictureBanner} src="/assets/images/listcourse_banner.jpg" alt="banner" />
                                    </div>
                                </div>
                            </Carousel.Slide>
                        </Carousel>
                    </div>
                    {/* BANNER SLIDER */}
                    {/* <div className={styles.banner}>
                        <div className={styles.slider}>
                            <div className={styles.slideItem}>
                                <div className={styles.infoSlide}>
                                    <p className={styles.desSlide}>
                                        Consectetur adipiscing elit
                                    </p>
                                    <h2 className={styles.titleSlide}>
                                        We Choose Creative 
                                        <br/>
                                        Approach
                                    </h2>
                                    <button type="button" className={styles.buttonSlide}>
                                        View more
                                    </button>
                                </div>
                                <div className={styles.overlay}></div>
                                <img className={styles.pictureBanner} src="/assets/images/listcourse_banner.jpg" alt="banner" />
                            </div>
                        </div>
                    </div> */}

                    {/* LIST SERVICES */}
                    <div className={styles.wrapService}>
                        <Container size="xl" style={{ width: "100%" }}>
                            <div className={styles.gridService}>
                                <div className={styles.serviceItem}>
                                    <div className={styles.wrapIcon}>
                                        <IconScreenShare size={'7rem'} />
                                    </div>
                                    <p className={styles.titleService}>
                                        Online Courses 
                                    </p>
                                    <p className={styles.desService}>
                                        Consectetur adipiscing elit, sed do euismod tempo.
                                    </p>
                                </div>
                                <div className={styles.serviceItem}>
                                    <div className={styles.wrapIcon}>
                                        <IconMessageChatbot size={'7rem'} />
                                    </div>
                                    <p className={styles.titleService}>
                                        24/7 Support 
                                    </p>
                                    <p className={styles.desService}>
                                        Consectetur adipiscing elit, sed do euismod tempo.
                                    </p>
                                </div>
                                <div className={styles.serviceItem}>
                                    <div className={styles.wrapIcon}>
                                        <IconSchool size={'7rem'} />
                                    </div>
                                    <p className={styles.titleService}>
                                        Personal Teacher    
                                    </p>
                                    <p className={styles.desService}>
                                        Consectetur adipiscing elit, sed do euismod tempo.
                                    </p>
                                </div>
                                <div className={styles.serviceItem}>
                                    <div className={styles.wrapIcon}>
                                        <IconRecharging size={'7rem'} />
                                    </div>
                                    <p className={styles.titleService}>
                                        Powerful Program
                                    </p>
                                    <p className={styles.desService}>
                                        Consectetur adipiscing elit, sed do euismod tempo.
                                    </p>
                                </div>
                            </div>
                        </Container>
                    </div>

                    {/* LIST COURSE */}
                    <div className={styles.wrapCourse}>
                        <Container size="xl" style={{ width: "100%" }}>
                            <p className={styles.desSection}>
                                What we teach
                            </p>
                            <h2 className={styles.titleSection}>
                                Upgrade Your Skills
                            </h2>
                            <div className={styles.gridCourse}>
                                <CourseSaleComponent/>
                                <CourseSaleComponent/>
                                <CourseSaleComponent/>
                                <CourseSaleComponent/>
                                <CourseSaleComponent/>
                                <CourseSaleComponent/>
                            </div>
                        </Container>
                    </div>

                    {/* FORM SUBSCRIBE */}
                    <div className={styles.wrapSubscribe}>
                        <Container size="xl" style={{ width: "100%" }}>
                            <div className={styles.wrapIconSection}>
                                <IconSend size={'3rem'} />
                            </div>

                            <h2 className={styles.titleSection}>
                                Get the best blog stories into your inbox!
                            </h2>

                            <form className={styles.wrapFormSubscribe}>
                                <div className={styles.formSubscribe}>
                                    <input className={styles.txtInput} placeholder="Enter Your Email Address" type="email" required />
                                    <button type="submit" className={styles.buttonSubmit}>
                                        <IconBrandTelegram size={'2rem'} />
                                        Subscribe
                                    </button>
                                </div>

                                {/* <p className={styles.policy}>
                                    <input type="checkbox" />
                                </p> */}
                            </form>
                        </Container>
                    </div>

                    {/* VIDEO */}
                    <div className={styles.wrapVideoDemo}>
                        <Container size="xl" style={{ width: "100%" }}>
                            <div className={styles.videoDemo}>
                                <div className={styles.ovlerlay}></div>
                                <img src="/assets/images/listcourse_bannerVideo.jpg" className={styles.thumbnail} />
                                <button type="button" className={styles.buttonPlay} onClick={() => setOpenVideoModal(true)}>
                                    <IconPlayerPlay size={'2.5rem'}/>
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
                                        WHAT WE DO
                                    </p>
                                    <p className={styles.title}>
                                        We make sure it's easy to learn.
                                    </p>
                                    <p className={styles.description}>
                                        Adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
                                    </p>
                                    <button className={styles.buttonCTA}>
                                        About Us
                                    </button>
                                </div>

                                <div className={styles.listAnalysisItem}>
                                    <div className={styles.contentAnalysisItem}>
                                        <div className={styles.wrapInfo}>
                                            <div className={styles.wrapIcon}>
                                                <IconUsers/>
                                            </div>
                                            <div className={styles.info}>
                                                <p className={styles.title}>
                                                    Current Students
                                                </p>
                                                <p className={styles.description}>
                                                    Natus error sit voluptatem actium doloremque laudantium            
                                                </p>
                                            </div>
                                        </div>
                                        <p className={styles.number}>
                                            180
                                        </p>
                                    </div>
                                    <div className={styles.contentAnalysisItem}>
                                        <div className={styles.wrapInfo}>
                                            <div className={styles.wrapIcon}>
                                                <IconCertificate/>
                                            </div>
                                            <div className={styles.info}>
                                                <p className={styles.title}>
                                                    Courses Completed
                                                </p>
                                                <p className={styles.description}>
                                                    Adipiscing elit, sed do eiusmod tempor incididunt ut labore
                                                </p>
                                            </div>
                                        </div>
                                        <p className={styles.number}>
                                            254
                                        </p>
                                    </div>
                                    <div className={styles.contentAnalysisItem}>
                                        <div className={styles.wrapInfo}>
                                            <div className={styles.wrapIcon}>
                                                <IconBrandZoom/>
                                            </div>
                                            <div className={styles.info}>
                                                <p className={styles.title}>
                                                    Occupations Taken
                                                </p>
                                                <p className={styles.description}>
                                                    Et dolore magna aliqua ut enim ad minim veniam
                                                </p>
                                            </div>
                                        </div>
                                        <p className={styles.number}>
                                            391
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
                                GREAT WORDS ABOUT
                            </p>
                            <p className={styles.title}>
                                People say about us
                            </p>
                            <div className={styles.sliderPeople}>
                                <div className={styles.sliderPeopleItem}>
                                    <span className={styles.iconQuote}>
                                        <IconQuote/>
                                    </span>
                                    <p className={styles.contentQuote}>
                                    Incididunt ut labore et dolore magna aliqua adipiscing elit, sed do eiusmod tempor. Ut enim ad minim veniam. Adipiscing do eiusmod.
                                    </p>
                                    <div className={styles.authorQuote}>
                                        <div className={styles.wrapAvatar}>
                                            <img src="/assets/images/listcourse_courseItem.jpg" alt="thumbnaill" />
                                        </div>
                                        <div className={styles.infoAuthor}>
                                            <p className={styles.name}>
                                                John Weinstein
                                            </p>
                                            <p className={styles.job}>
                                                Photographer
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.sliderPeopleItem}>
                                    <span className={styles.iconQuote}>
                                        <IconQuote/>
                                    </span>
                                    <p className={styles.contentQuote}>
                                    Incididunt ut labore et dolore magna aliqua adipiscing elit, sed do eiusmod tempor. Ut enim ad minim veniam. Adipiscing do eiusmod.
                                    </p>
                                    <div className={styles.authorQuote}>
                                        <div className={styles.wrapAvatar}>
                                            <img src="/assets/images/listcourse_courseItem.jpg" alt="thumbnaill" />
                                        </div>
                                        <div className={styles.infoAuthor}>
                                            <p className={styles.name}>
                                                John Weinstein
                                            </p>
                                            <p className={styles.job}>
                                                Photographer
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.sliderPeopleItem}>
                                    <span className={styles.iconQuote}>
                                    <IconQuote/>
                                    </span>
                                    <p className={styles.contentQuote}>
                                        Adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. Adipiscing do eiusmod.
                                    </p>
                                    <div className={styles.authorQuote}>
                                        <div className={styles.wrapAvatar}>
                                            <img src="/assets/images/listcourse_courseItem.jpg" alt="thumbnaill" />
                                        </div>
                                        <div className={styles.infoAuthor}>
                                            <p className={styles.name}>
                                                John Weinstein
                                            </p>
                                            <p className={styles.job}>
                                                Photographer
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </div>

                    {/* ARTICLE */}
                    <div className={styles.wrapArticle}>
                        <Container size="xl" style={{ width: "100%" }}>
                            <p className={styles.subTitle}>
                                WHO WE ARE
                            </p>
                            <p className={styles.title}>
                                Latest Articles
                            </p>
                            <div className={styles.listArticle}>
                                <a href="#!" className={styles.cardArticle}>
                                    <div className={styles.wrapInfoCard}>
                                        <div className={styles.thumbnailCard}>
                                            <img src="/assets/images/listcourse_courseItem.jpg" alt="thumbnaill" />
                                        </div>
                                        <div className={styles.infoCard}>
                                            <p className={styles.categoryCard}>
                                                Tutoring
                                            </p>
                                            <p className={styles.nameCard}>
                                                Our students do not experience stress or anxiety
                                            </p>
                                            <div className={styles.moreInfoCard}>
                                                <p className={styles.moreInfoItem}>
                                                    Apr 22, 2020
                                                </p>
                                                <p className={styles.moreInfoItem}>
                                                    0 Comments
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                <a href="#!" className={styles.cardArticle}>
                                    <div className={styles.wrapInfoCard}>
                                        <div className={styles.thumbnailCard}>
                                            <img src="/assets/images/listcourse_courseItem.jpg" alt="thumbnaill" />
                                        </div>
                                        <div className={styles.infoCard}>
                                            <p className={styles.categoryCard}>
                                                Tutoring
                                            </p>
                                            <p className={styles.nameCard}>
                                                Our students do not experience stress or anxiety
                                            </p>
                                            <div className={styles.moreInfoCard}>
                                                <p className={styles.moreInfoItem}>
                                                    Apr 22, 2020
                                                </p>
                                                <p className={styles.moreInfoItem}>
                                                    0 Comments
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                <a href="#!" className={styles.cardArticle}>
                                    <div className={styles.wrapInfoCard}>
                                        <div className={styles.thumbnailCard}>
                                            <img src="/assets/images/listcourse_courseItem.jpg" alt="thumbnaill" />
                                        </div>
                                        <div className={styles.infoCard}>
                                            <p className={styles.categoryCard}>
                                                Tutoring
                                            </p>
                                            <p className={styles.nameCard}>
                                                Our students do not experience stress or anxiety
                                            </p>
                                            <div className={styles.moreInfoCard}>
                                                <p className={styles.moreInfoItem}>
                                                    Apr 22, 2020
                                                </p>
                                                <p className={styles.moreInfoItem}>
                                                    0 Comments
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </a>
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
            )}
        </>
    )
}

export default index