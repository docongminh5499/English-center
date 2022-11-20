import React from 'react'
import styles from './CourseSale.module.css'
import Link from "next/link";
import { IconNotebook, IconUser } from '@tabler/icons'
import { Course } from '../../../../../models/course.model';
import { getImageUrl } from '../../../../../helpers/image.helper';
import { formatCurrency } from '../../../../../helpers/formatCurrency';
import moment from 'moment';

const CourseSale = (props: Course) => {
  return (
    <div className={styles.wrapCourseSale}>
      <div className={styles.courseSale}>
        <Link href={"/courses/" + props.slug}>
          <div className={styles.wrapThumbnail}>
            <img src={getImageUrl(props.image)} className={styles.thumbnail} />
          </div>
        </Link>
        <div className={styles.infoCourse}>
          <div className={styles.wrapPrice}>
            <div className={styles.price}>
              <p>
                {props.price / 1000000}
              </p>
              <p>
                triệu đồng
              </p>
            </div>
          </div>
          <Link href={"/courses/" + props.slug}>
            <p className={styles.nameCource}>
              {props.name}
            </p>
          </Link>
          <p className={styles.authCourse}>
            Giáo viên: {props.teacher.worker.user.fullName}
          </p>
          <p className={styles.date}>
            Thời gian: {moment(props.openingDate).format("DD/MM/YYYY") + " - " + moment(props.expectedClosingDate).format("DD/MM/YYYY")}
          </p>
          <hr className={styles.line} />
          <div className={styles.moreInfo}>
            <div className={styles.moreInfoItem}>
              <IconNotebook />
              {props.curriculum.lectures.length} bài học
            </div>

            <div className={styles.moreInfoItem}>
              <IconUser size={'2rem'} />
              {props.maxNumberOfStudent} học sinh
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseSale