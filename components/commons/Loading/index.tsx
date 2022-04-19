import styles from './loading.module.css';

const Loading = () => {
  return (
    <div className={styles.ldsRing}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loading;
