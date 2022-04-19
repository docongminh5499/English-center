import { useCallback } from "react";
import styles from "./pagination.module.css";

interface IProps {
  maxPage: number;
  currentPage: number;
  onClick: (page: number) => void;
}

const Pagination = ({ maxPage, currentPage, onClick }: IProps) => {
  const max = maxPage > 0 ? maxPage : 1;
  const current = currentPage > max ? max : currentPage > 0 ? currentPage : 1;

  const getPaginationPageList = useCallback(() => {
    let returnList = [];
    if (current > 1) returnList.push("prev");
    if (max <= 10) {
      returnList = returnList.concat(
        Array.from({ length: max }, (_, i) => (i + 1).toString())
      );
    } else {
      returnList = returnList.concat(["1", "2"]);
      if (current > 2 && current < 5) {
        for (let index = 3; index <= current + 1; index++)
          returnList.push(index.toString());
        returnList.push("etc");
      } else if (current < max - 1 && current > max - 4) {
        returnList.push("etc");
        for (let index = current - 1; index < max - 1; index++)
          returnList.push(index.toString());
      } else if (current >= 5 && current <= max - 4) {
        returnList.push("etc");
        returnList = returnList.concat([
          (current - 1).toString(),
          current.toString(),
          (current + 1).toString(),
        ]);
        returnList.push("etc");
      } else {
        returnList = returnList.concat(["3", "4"]);
        returnList.push("etc");
        returnList = returnList.concat([
          (max - 3).toString(),
          (max - 2).toString(),
        ]);
      }
      returnList = returnList.concat([(max - 1).toString(), max.toString()]);
    }

    if (current < max) returnList.push("next");
    return returnList;
  }, [current, max]);

  const onPrevClick = () => current > 1 && onClick(current - 1);
  const onNextClick = () => current < max && onClick(current + 1);

  return (
    <div className={styles.paginationContainer}>
      {getPaginationPageList().map((page, index) => {
        if (page == "prev")
          return (
            <div className={styles.page} key={index} onClick={onPrevClick}>
              <img src="/assets/icons/ic_arrow_left.png" alt="icon" />
            </div>
          );

        if (page == "next")
          return (
            <div className={styles.page} key={index} onClick={onNextClick}>
              <img src="/assets/icons/ic_arrow_right.png" alt="icon" />
            </div>
          );

        if (page == "etc") return <div key={index}>...</div>;

        return (
          <div
            key={index}
            onClick={() => onClick(Number(page))}
            className={`${styles.page} ${
              current.toString() == page ? styles.actived : ""
            }`}
          >
            {page}
          </div>
        );
      })}
    </div>
  );
};

export default Pagination;
