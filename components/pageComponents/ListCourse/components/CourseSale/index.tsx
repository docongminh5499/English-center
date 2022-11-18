import React from 'react'
import styles from './CourseSale.module.css'
import Link from "next/link";
import { IconNotebook, IconUser } from '@tabler/icons'

const CourseSale = () => {
  return (
    <div className={styles.wrapCourseSale}>
        <div className={styles.courseSale}>
            <Link href={'#!'}>
                <div className={styles.wrapThumbnail}>
                    <img src='/assets/images/listcourse_courseItem.jpg' className={styles.thumbnail} />
                </div>
            </Link>
            <div className={styles.infoCourse}>
                <div className={styles.wrapPrice}>
                    <div className={styles.price}>
                        $99.00
                    </div>
                </div>
                <Link href={'#!'}>
                    <p className={styles.nameCource}>
                        Data visualization course
                    </p>
                </Link>
                <Link href={'#!'}>
                    <p className={styles.authCourse}>
                        by Kelly Anderson
                    </p>
                </Link>
                <hr className={styles.line} />
                <div className={styles.moreInfo}>
                    <div className={styles.moreInfoItem}>
                        <IconNotebook/>
                        3 lessons
                    </div>

                    <div className={styles.moreInfoItem}>
                        <IconUser size={'2rem'} />
                        30 students
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CourseSale