import Pagination from "../../commons/Pagination";

const TeacherHome = () => {
  return (
    <div>
      <Pagination
        currentPage={2}
        maxPage={6}
        onClick={(page) => console.log(page)}
      />
    </div>
  );
};

export default TeacherHome;
