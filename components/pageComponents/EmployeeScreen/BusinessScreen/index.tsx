import {
  Title,
  Box,
  Radio,
  Group,
  Grid,
  Text,
  Button,
  Container,
  NativeSelect,
  List,
} from "@mantine/core";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";
import { useAuth } from "../../../../stores/Auth";
import API from "../../../../helpers/api";
import { ReportType, Url } from "../../../../helpers/constants";
import { toast } from "react-toastify";
import ProfitReport from "../../../../models/profitReport.model";
import SalaryReport from "../../../../models/salaryReport.model";
import RevenueReport from "../../../../models/revenueReport.model";
import { IconCaretDown, IconCaretUp } from "@tabler/icons";
import StudentReport from "../../../../models/studentReport.model";
import CourseReport from "../../../../models/courseReport.model";

const formatMoney = (money: number) => {
  let suffix = "";
  let cofiDivide = 1;
  if (Math.abs(money) > 10 ** 9) {
    suffix = " tỷ";
    cofiDivide = 10 ** 9;
  } else if (Math.abs(money) > 10 ** 6) {
    suffix = " triệu";
    cofiDivide = 10 ** 6;
  }
  return (
    (money / cofiDivide).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,") + suffix
  );
};

const EmployeeBusinessScreen = (props: any) => {
  const now = new Date();
  const [reportType, setReportType] = useState(ReportType.REVENUE);
  const [chartTitle, setChartTitle] = useState("Báo cáo Doanh Thu");
  const [reportYear, setReportYear] = useState(now.getFullYear());
  const [authState] = useAuth();
  const [isDrawCircleChart, setIsDrawCircleChart] = useState(true);

  const amountRevenueMetaData = 4;
  const amountSalaryMetaData = 4;
  const amountStudentMetaData = 4;
  const amountProfitMetaData = 3;

  const [metaData, setMetaData] = useState(<></>);

  useEffect(() => {
    //Line Chart
    getReportData();
  }, []);

  //==================================REVENUE INTERFACE==============================================
  const updateRevenueInterface = (data: RevenueReport) => {
    setChartTitle("Báo Cáo Doanh Thu Năm " + reportYear);
    setIsDrawCircleChart(true);
    const totalShortTermRevenue = data.shortTermRevenue.reduce(
      (a: number, b: number) => a + b
    );
    const totalLongTermRevenue = data.longTermRevenue.reduce(
      (a: number, b: number) => a + b
    );
    const totalRevenue = totalShortTermRevenue + totalLongTermRevenue;
    let lineChartStatus = Chart.getChart("lineChart"); // <canvas> id
    if (lineChartStatus != undefined) {
      lineChartStatus.destroy();
    }
    let circleChartStatus = Chart.getChart("circleChart"); // <canvas> id
    if (circleChartStatus != undefined) {
      circleChartStatus.destroy();
    }
    var ctxLineChart = props.document
      .getElementById("lineChart")
      .getContext("2d");
    var myChart = new Chart(ctxLineChart, {
      type: "line",
      data: {
        labels: Array.from(
          { length: data.shortTermRevenue.length },
          (_, i) => i + 1
        ),
        datasets: [
          {
            data: data.shortTermRevenue,
            label: "Khóa ngắn hạn",
            borderColor: "#3cba9f",
            backgroundColor: "#71d1bd",
            fill: false,
          },
          {
            data: data.longTermRevenue,
            label: "Khóa dài hạn",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false,
          },
        ],
      },
    });

    //Circle Chart
    var ctxCircleChart = props.document
      .getElementById("circleChart")
      .getContext("2d");
    var circleChart = new Chart(ctxCircleChart, {
      type: "pie",
      data: {
        labels: ["Khóa ngắn hạn", "Khóa dài hạn"],
        datasets: [
          {
            data: [
              data.shortTermRevenue.reduce((a: number, b: number) => a + b),
              data.longTermRevenue.reduce((a: number, b: number) => a + b),
            ],
            borderColor: ["#3cba9f", "#ffa500"],
            backgroundColor: ["rgb(60,186,159,0.1)", "rgb(255,165,0,0.1)"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
      },
    });
    //MetaData
    setMetaData(
      <Grid pt={"sm"} justify="center">
        <Grid.Col span={12 / amountRevenueMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#5a76f2" }}>
            <Text color="white" size={20}>
              Tổng doanh thu
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <Text color="white" size={30}>
                  {formatMoney(totalRevenue)}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group position="center" h={"100%"}>
                  <List
                    icon={
                      totalRevenue > data.preYearRevenue ? (
                        <IconCaretUp
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      ) : (
                        <IconCaretDown
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      )
                    }
                    size="sm"
                    center
                  >
                    <List.Item>
                      <Text color="white" size={20}>
                        {totalRevenue > data.preYearRevenue
                          ? (Math.abs((totalRevenue - data.preYearRevenue) * 100 / data.preYearRevenue)).toFixed(2)
                          : (-Math.abs((totalRevenue - data.preYearRevenue) * 100 / data.preYearRevenue)).toFixed(2)
                        }
                        %
                      </Text>
                    </List.Item>
                  </List>
                </Group>
              </Grid.Col>
            </Grid>

            <Text color="white" size={18}>
              Năm trước: {formatMoney(data.preYearRevenue)}
            </Text>
          </Container>
        </Grid.Col>

        <Grid.Col span={12 / amountRevenueMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#5831ee" }}>
            <Text color="white" size={20}>
              Số học viên
            </Text>
            <Text color="white" size={30}>
              {data.totalStudent} học viên
            </Text>
            <Text color="#5831ee" size={18}>
              A
            </Text>
          </Container>
        </Grid.Col>

        <Grid.Col span={12 / amountRevenueMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#37c8a1" }}>
            <Text color="white" size={20}>
              Số khóa học ngắn hạn
            </Text>
            <Text color="white" size={30}>
              {data.amountShortTermCourse} khóa học
            </Text>
            <Text color="#37c8a1" size={18}>
              A
            </Text>
          </Container>
        </Grid.Col>

        <Grid.Col span={12 / amountRevenueMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#f28c5a" }}>
            <Text color="white" size={20}>
              Số khóa học dài hạn
            </Text>
            <Text color="white" size={30}>
              {data.amountLongTermCourse} khóa học
            </Text>
            <Text color="#f28c5a" size={18}>
              A
            </Text>
          </Container>
        </Grid.Col>
      </Grid>
    );
  };

  //==================================SALARY INTERFACE==============================================
  const updateSalaryInterface = (data: SalaryReport) => {
    setChartTitle("Báo Cáo Khoản Chi Năm " + reportYear);
    setIsDrawCircleChart(true);
    const totalEmployeeSalary = data.employeeSalary.reduce(
      (a: number, b: number) => a + b
    );
    const totalTeacherSalary = data.teacherSalary.reduce(
      (a: number, b: number) => a + b
    );
    const totalTutorSalary = data.tutorSalary.reduce(
      (a: number, b: number) => a + b
    );
    const totalSalary =
      totalEmployeeSalary + totalTeacherSalary + totalTutorSalary;
    let lineChartStatus = Chart.getChart("lineChart"); // <canvas> id
    if (lineChartStatus != undefined) {
      lineChartStatus.destroy();
    }
    let circleChartStatus = Chart.getChart("circleChart"); // <canvas> id
    if (circleChartStatus != undefined) {
      circleChartStatus.destroy();
    }
    var ctxLineChart = props.document
      .getElementById("lineChart")
      .getContext("2d");
    var lineChart = new Chart(ctxLineChart, {
      type: "line",
      data: {
        labels: Array.from(
          { length: data.employeeSalary.length },
          (_, i) => i + 1
        ),
        datasets: [
          {
            data: data.employeeSalary,
            label: "Lương nhân viên",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false,
          },
          {
            data: data.teacherSalary,
            label: "Lương giáo viên",
            borderColor: "#3cba9f",
            backgroundColor: "#71d1bd",
            fill: false,
          },
          {
            data: data.tutorSalary,
            label: "Lương trợ giảng",
            borderColor: "#c45850",
            backgroundColor: "#d78f89",
            fill: false,
          },
        ],
      },
    });

    //Circle Chart
    var ctxCircleChart = props.document
      .getElementById("circleChart")
      .getContext("2d");
    var circleChart = new Chart(ctxCircleChart, {
      type: "pie",
      data: {
        labels: ["Lương nhân viên", "Lương giáo viên", "Lương trợ giảng"],
        datasets: [
          {
            data: [totalEmployeeSalary, totalTeacherSalary, totalTutorSalary],
            borderColor: ["#3cba9f", "#ffa500", "#c45850"],
            backgroundColor: [
              "rgb(60,186,159,0.1)",
              "rgb(255,165,0,0.1)",
              "rgb(196,88,80,0.1)",
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
      },
    });
    //MetaData
    setMetaData(
      <Grid pt={"sm"} justify="center">
        <Grid.Col span={12 / amountSalaryMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#5a76f2" }}>
            <Text color="white" size={20}>
              Tổng khoản lương
            </Text>
            <Text color="white" size={30}>
              {formatMoney(totalSalary)}
            </Text>
            {/* <Text color="white" size={18}>
              Năm trước: {formatMoney(data.preYearRevenue)}
            </Text> */}
          </Container>
        </Grid.Col>

        <Grid.Col span={12 / amountSalaryMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#37c8a1" }}>
            <Text color="white" size={20}>
              Số nhân viên
            </Text>
            <Text color="white" size={30}>
              {data.amountEmployee} người
            </Text>
          </Container>
        </Grid.Col>

        <Grid.Col span={12 / amountSalaryMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#f28c5a" }}>
            <Text color="white" size={20}>
              Số giáo viên
            </Text>
            <Text color="white" size={30}>
              {data.amountTeacher} người
            </Text>
          </Container>
        </Grid.Col>

        <Grid.Col span={12 / amountSalaryMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#f28c5a" }}>
            <Text color="white" size={20}>
              Số trợ giảng
            </Text>
            <Text color="white" size={30}>
              {data.amountTutor} người
            </Text>
          </Container>
        </Grid.Col>
      </Grid>
    );
  };

  //==================================PROFIT INTERFACE==============================================
  const updateProfitInterface = (data: ProfitReport) => {
    setChartTitle("Báo Cáo Lợi Nhuận Năm " + reportYear);
    setIsDrawCircleChart(false);
    const revenue = data.revenue;
    const salary = data.salary;
    const profit = revenue.map((a, i) => a - salary[i]);
    const totalProfit = profit.reduce((a: number, b: number) => a + b);
    const totalRevenue = revenue.reduce((a: number, b: number) => a + b);
    const totalSalary = salary.reduce((a: number, b: number) => a + b);
    const preYearProfit = data.preYearRevenue - data.preYearSalary;

    let lineChartStatus = Chart.getChart("lineChart"); // <canvas> id
    if (lineChartStatus != undefined) {
      lineChartStatus.destroy();
    }
    let circleChartStatus = Chart.getChart("circleChart"); // <canvas> id
    if (circleChartStatus != undefined) {
      circleChartStatus.destroy();
    }
    var ctxLineChart = props.document
      .getElementById("lineChart")
      .getContext("2d");
    var lineChart = new Chart(ctxLineChart, {
      type: "line",
      data: {
        labels: Array.from({ length: profit.length }, (_, i) => i + 1),
        datasets: [
          {
            data: profit,
            label: "Lợi nhuận",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false,
          },
          // {
          //   data: data.teacherSalary,
          //   label: "Lương giáo viên",
          //   borderColor: "#3cba9f",
          //   backgroundColor: "#71d1bd",
          //   fill: false,
          // },
          // {
          //   data: data.tutorSalary,
          //   label: "Lương trợ giảng",
          //   borderColor: "#c45850",
          //   backgroundColor: "#d78f89",
          //   fill: false,
          // },
        ],
      },
    });

    setMetaData(
      <Grid pt={"sm"} justify="center">
        <Grid.Col span={12 / amountProfitMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#5a76f2" }}>
            <Text color="white" size={20}>
              Tổng lợi nhuận
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <Text color="white" size={30}>
                  {formatMoney(totalProfit)}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group position="center" h={"100%"}>
                  <List
                    icon={
                      totalProfit > preYearProfit ? (
                        <IconCaretUp
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      ) : (
                        <IconCaretDown
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      )
                    }
                    size="sm"
                    center
                  >
                    <List.Item>
                      <Text color="white" size={20}>
                        {totalProfit > preYearProfit
                          ? (Math.abs((totalProfit - preYearProfit) * 100 / preYearProfit)).toFixed(2)
                          : (-Math.abs((totalProfit - preYearProfit) * 100 / preYearProfit)).toFixed(2)
                        }
                        %
                      </Text>
                    </List.Item>
                  </List>
                </Group>
              </Grid.Col>
            </Grid>
            <Text color="white" size={18}>
              Năm trước: {formatMoney(preYearProfit)}
            </Text>
          </Container>
        </Grid.Col>

        <Grid.Col span={12 / amountProfitMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#37c8a1" }}>
            <Text color="white" size={20}>
              Tổng doanh thu
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <Text color="white" size={30}>
                  {formatMoney(totalRevenue)}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group position="center" h={"100%"}>
                  <List
                    icon={
                      totalRevenue > data.preYearRevenue ? (
                        <IconCaretUp
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      ) : (
                        <IconCaretDown
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      )
                    }
                    size="sm"
                    center
                  >
                    <List.Item>
                      <Text color="white" size={20}>
                        {totalRevenue > data.preYearRevenue
                          ? (Math.abs((totalRevenue - data.preYearRevenue) * 100 / data.preYearRevenue)).toFixed(2)
                          : (-Math.abs((totalRevenue - data.preYearRevenue) * 100 / data.preYearRevenue)).toFixed(2)
                        }
                        %
                      </Text>
                    </List.Item>
                  </List>
                </Group>
              </Grid.Col>
            </Grid>
            <Text color="white" size={18}>
              Năm trước: {formatMoney(data.preYearRevenue)}
            </Text>
          </Container>
        </Grid.Col>

        <Grid.Col span={12 / amountProfitMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#f28c5a" }}>
            <Text color="white" size={20}>
              Tổng khoản lương
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <Text color="white" size={30}>
                  {formatMoney(totalSalary)}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group position="center" h={"100%"}>
                  <List
                    icon={
                      totalSalary > data.preYearSalary ? (
                        <IconCaretUp
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      ) : (
                        <IconCaretDown
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      )
                    }
                    size="sm"
                    center
                  >
                    <List.Item>
                      <Text color="white" size={20}>
                        {totalSalary > data.preYearSalary
                          ? (Math.abs((totalSalary - data.preYearSalary) * 100 / data.preYearSalary)).toFixed(2)
                          : (-Math.abs((totalSalary - data.preYearSalary) * 100 / data.preYearSalary)).toFixed(2)
                        }
                        %
                      </Text>
                    </List.Item>
                  </List>
                </Group>
              </Grid.Col>
            </Grid>
            <Text color="white" size={18}>
              Năm trước: {formatMoney(data.preYearSalary)}
            </Text>
          </Container>
        </Grid.Col>

        {/* <Grid.Col span={12/amountSalaryMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#f28c5a" }}>
            <Text color="white" size={20}>
              Số trợ giảng
            </Text>
            <Text color="white" size={30}>
              {data.amountTutor} người
            </Text>
          </Container>
        </Grid.Col> */}
      </Grid>
    );
  };

  //===========================================STUDENT INTERFACE==================================
  const updateStudentInterface = async (data: StudentReport) => {
    setChartTitle("Báo Cáo Số Học Viên Năm " + reportYear);
    setIsDrawCircleChart(true);
    const newStudent = data.newStudent;
    const spc = data.stdParticipateCourse;
    const preYearNewStudent = data.preYearNewStudent;
    const queryYearStdParticipateCourse = data.queryYearStdParticipateCourse;
    const preYearStdParticipateCourse = data.preYearStdParticipateCourse;
    const totalStudentUntilQueryYear = data.totalStudentUntilQueryYear;
    const totalNewStudent = newStudent.reduce((a: number, b: number) => a+b);
    const totalStudentUntilPreQuerYear = totalStudentUntilQueryYear - totalNewStudent;

    let lineChartStatus = Chart.getChart("lineChart"); // <canvas> id
    if (lineChartStatus != undefined) {
      lineChartStatus.destroy();
    }
    let circleChartStatus = Chart.getChart("circleChart"); // <canvas> id
    if (circleChartStatus != undefined) {
      circleChartStatus.destroy();
    }
    var ctxLineChart = props.document
      .getElementById("lineChart")
      .getContext("2d");
    var lineChart = new Chart(ctxLineChart, {
      type: "line",
      data: {
        labels: Array.from({ length: newStudent.length }, (_, i) => i + 1),
        datasets: [
          {
            data: newStudent,
            label: "Học viên mới",
            borderColor: "#3cba9f",
            backgroundColor: "#71d1bd",
            fill: false,
          },
          {
            data: spc,
            label: "Học viên có tham gia học",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false,
          },
          // {
          //   data: data.tutorSalary,
          //   label: "Lương trợ giảng",
          //   borderColor: "#c45850",
          //   backgroundColor: "#d78f89",
          //   fill: false,
          // },
        ],
      },
    });

    //Circle Chart
    var ctxCircleChart = props.document
      .getElementById("circleChart")
      .getContext("2d");
    var circleChart = new Chart(ctxCircleChart, {
      type: "pie",
      data: {
        labels: ["Học viên có tham gia học", "Học viên không tham gia học"],
        datasets: [
          {
            data: [queryYearStdParticipateCourse, totalStudentUntilQueryYear - queryYearStdParticipateCourse],
            borderColor: ["#3cba9f", "#ffa500"],
            backgroundColor: [
              "rgb(60,186,159,0.1)",
              "rgb(255,165,0,0.1)",
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
      },
    });

    setMetaData(
      <Grid pt={"sm"} justify="center">
        <Grid.Col span={12 / amountStudentMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#5a76f2" }}>
            <Text color="white" size={20}>
              Tổng số học viên
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <Text color="white" size={30}>
                  {totalStudentUntilQueryYear}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group position="center" h={"100%"}>
                  <List
                    icon={
                      totalStudentUntilQueryYear > totalStudentUntilPreQuerYear ? (
                        <IconCaretUp
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      ) : (
                        <IconCaretDown
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      )
                    }
                    size="sm"
                    center
                  >
                    <List.Item>
                      <Text color="white" size={20}>
                        {totalStudentUntilQueryYear > totalStudentUntilPreQuerYear
                          ? (Math.abs((totalStudentUntilQueryYear - totalStudentUntilPreQuerYear) * 100 / totalStudentUntilPreQuerYear)).toFixed(2)
                          : (-Math.abs((totalStudentUntilQueryYear - totalStudentUntilPreQuerYear) * 100 / totalStudentUntilPreQuerYear)).toFixed(2)
                        }
                        %
                      </Text>
                    </List.Item>
                  </List>
                </Group>
              </Grid.Col>
            </Grid>
            <Text color="white" size={18}>
              Năm trước: {totalStudentUntilPreQuerYear}
            </Text>
          </Container>
        </Grid.Col>

        <Grid.Col span={12 / amountStudentMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#37c8a1" }}>
            <Text color="white" size={20}>
              Học viên mới
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <Text color="white" size={30}>
                  {totalNewStudent}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group position="center" h={"100%"}>
                  <List
                    icon={
                      totalNewStudent > preYearNewStudent ? (
                        <IconCaretUp
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      ) : (
                        <IconCaretDown
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      )
                    }
                    size="sm"
                    center
                  >
                    <List.Item>
                      <Text color="white" size={20}>
                        {totalNewStudent > preYearNewStudent
                          ? (Math.abs((totalNewStudent - preYearNewStudent) * 100 / preYearNewStudent)).toFixed(2)
                          : (-Math.abs((totalNewStudent - preYearNewStudent) * 100 / preYearNewStudent)).toFixed(2)
                        }
                        %
                      </Text>
                    </List.Item>
                  </List>
                </Group>
              </Grid.Col>
            </Grid>
            <Text color="white" size={18}>
              Năm trước: {preYearNewStudent}
            </Text>
          </Container>
        </Grid.Col>

        <Grid.Col span={12 / amountStudentMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#f28c5a" }}>
            <Text color="white" size={20}>
              Số học viên tham gia học
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <Text color="white" size={30}>
                  {queryYearStdParticipateCourse}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group position="center" h={"100%"}>
                  <List
                    icon={
                      queryYearStdParticipateCourse > preYearStdParticipateCourse ? (
                        <IconCaretUp
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      ) : (
                        <IconCaretDown
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      )
                    }
                    size="sm"
                    center
                  >
                    <List.Item>
                      <Text color="white" size={20}>
                        {queryYearStdParticipateCourse > preYearStdParticipateCourse
                          ? (Math.abs((queryYearStdParticipateCourse - preYearStdParticipateCourse) * 100 / preYearStdParticipateCourse)).toFixed(2)
                          : (-Math.abs((queryYearStdParticipateCourse - preYearStdParticipateCourse) * 100 / preYearStdParticipateCourse)).toFixed(2)
                        }
                        %
                      </Text>
                    </List.Item>
                  </List>
                </Group>
              </Grid.Col>
            </Grid>
            <Text color="white" size={18}>
              Năm trước: {preYearStdParticipateCourse}
            </Text>
          </Container>
        </Grid.Col>

        {/* <Grid.Col span={12/amountSalaryMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#f28c5a" }}>
            <Text color="white" size={20}>
              Số trợ giảng
            </Text>
            <Text color="white" size={30}>
              {data.amountTutor} người
            </Text>
          </Container>
        </Grid.Col> */}
      </Grid>
    );
  }

  //===========================================COURSE INTERFACE==================================
  const updateCourseInterface = async (data: CourseReport) => {
    setChartTitle("Báo Cáo Khóa Học Năm " + reportYear);
    setIsDrawCircleChart(true);
    const shortTermCourse = data.shortTermCourse;
    const totalShortTermCourse = data.totalQueryYearShortTermCourse;
    const longTermCourse = data.longTermCourse;
    const totalLongTermCourse = data.totalQueryYearLongTermCourse;
    const totalPreShortTermCourse = data.totalPreYearShortTermCourse;
    const totalPreLongTermCourse = data.totalPreYearLongTermCourse;
    
    const totalCourseInYear = totalShortTermCourse + totalLongTermCourse;
    const totalCourseInPreYear = totalPreShortTermCourse + totalPreLongTermCourse;

    let lineChartStatus = Chart.getChart("lineChart"); // <canvas> id
    if (lineChartStatus != undefined) {
      lineChartStatus.destroy();
    }
    let circleChartStatus = Chart.getChart("circleChart"); // <canvas> id
    if (circleChartStatus != undefined) {
      circleChartStatus.destroy();
    }
    var ctxLineChart = props.document
      .getElementById("lineChart")
      .getContext("2d");
    var lineChart = new Chart(ctxLineChart, {
      type: "line",
      data: {
        labels: Array.from({ length: shortTermCourse.length }, (_, i) => i + 1),
        datasets: [
          {
            data: shortTermCourse,
            label: "Khóa học ngắn hạn",
            borderColor: "#3cba9f",
            backgroundColor: "#71d1bd",
            fill: false,
          },
          {
            data: longTermCourse,
            label: "Khóa học dài hạn",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false,
          },
          // {
          //   data: data.tutorSalary,
          //   label: "Lương trợ giảng",
          //   borderColor: "#c45850",
          //   backgroundColor: "#d78f89",
          //   fill: false,
          // },
        ],
      },
    });

    //Circle Chart
    var ctxCircleChart = props.document
      .getElementById("circleChart")
      .getContext("2d");
    var circleChart = new Chart(ctxCircleChart, {
      type: "pie",
      data: {
        labels: ["Khóa học ngắn hạn", "Khóa học dài hạn"],
        datasets: [
          {
            data: [totalShortTermCourse, totalLongTermCourse],
            borderColor: ["#3cba9f", "#ffa500"],
            backgroundColor: [
              "rgb(60,186,159,0.1)",
              "rgb(255,165,0,0.1)",
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
      },
    });

    setMetaData(
      <Grid pt={"sm"} justify="center">
        <Grid.Col span={12 / amountStudentMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#5a76f2" }}>
            <Text color="white" size={20}>
              Tổng số khóa học
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <Text color="white" size={30}>
                  {totalCourseInYear}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group position="center" h={"100%"}>
                  <List
                    icon={
                      totalCourseInYear > totalCourseInPreYear ? (
                        <IconCaretUp
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      ) : (
                        <IconCaretDown
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      )
                    }
                    size="sm"
                    center
                  >
                    <List.Item>
                      <Text color="white" size={20}>
                        {totalCourseInYear > totalCourseInPreYear
                          ? (Math.abs((totalCourseInYear - totalCourseInPreYear) * 100 / totalCourseInPreYear)).toFixed(2)
                          : (-Math.abs((totalCourseInYear - totalCourseInPreYear) * 100 / totalCourseInPreYear)).toFixed(2)
                        }
                        %
                      </Text>
                    </List.Item>
                  </List>
                </Group>
              </Grid.Col>
            </Grid>
            <Text color="white" size={18}>
              Năm trước: {totalCourseInPreYear}
            </Text>
          </Container>
        </Grid.Col>

        <Grid.Col span={12 / amountStudentMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#37c8a1" }}>
            <Text color="white" size={20}>
              Khóa học ngắn hạn
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <Text color="white" size={30}>
                  {totalShortTermCourse}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group position="center" h={"100%"}>
                  <List
                    icon={
                      totalShortTermCourse > totalPreShortTermCourse ? (
                        <IconCaretUp
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      ) : (
                        <IconCaretDown
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      )
                    }
                    size="sm"
                    center
                  >
                    <List.Item>
                      <Text color="white" size={20}>
                        {totalShortTermCourse > totalPreShortTermCourse
                          ? (Math.abs((totalShortTermCourse - totalPreShortTermCourse) * 100 / totalPreShortTermCourse)).toFixed(2)
                          : (-Math.abs((totalShortTermCourse - totalPreShortTermCourse) * 100 / totalPreShortTermCourse)).toFixed(2)
                        }
                        %
                      </Text>
                    </List.Item>
                  </List>
                </Group>
              </Grid.Col>
            </Grid>
            <Text color="white" size={18}>
              Năm trước: {totalPreShortTermCourse}
            </Text>
          </Container>
        </Grid.Col>

        <Grid.Col span={12 / amountStudentMetaData} p={"sm"}>
          <Container style={{ backgroundColor: "#f28c5a" }}>
            <Text color="white" size={20}>
              Khóa học dài hạn
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <Text color="white" size={30}>
                  {totalLongTermCourse}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group position="center" h={"100%"}>
                  <List
                    icon={
                      totalLongTermCourse > totalPreLongTermCourse ? (
                        <IconCaretUp
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      ) : (
                        <IconCaretDown
                          fill="white"
                          color="white"
                          alignmentBaseline="central"
                        />
                      )
                    }
                    size="sm"
                    center
                  >
                    <List.Item>
                      <Text color="white" size={20}>
                        {totalLongTermCourse > totalPreLongTermCourse
                          ? (Math.abs((totalLongTermCourse - totalPreLongTermCourse) * 100 / totalPreLongTermCourse)).toFixed(2)
                          : (-Math.abs((totalLongTermCourse - totalPreLongTermCourse) * 100 / totalPreLongTermCourse)).toFixed(2)
                        }
                        %
                      </Text>
                    </List.Item>
                  </List>
                </Group>
              </Grid.Col>
            </Grid>
            <Text color="white" size={18}>
              Năm trước: {totalPreLongTermCourse}
            </Text>
          </Container>
        </Grid.Col>
      </Grid>
    );
  }

  const getReportData = async () => {
    console.log(reportType);
    console.log(reportYear);
    try {
      //REVENUE
      if (reportType === ReportType.REVENUE) {
        const response = await API.get(Url.employees.getRevenueReport, {
          token: authState.token,
          reportType: reportType,
          reportYear: reportYear,
        });
        console.log(response);
        updateRevenueInterface(response);
      }
      //SALARY
      else if (reportType === ReportType.SALARY) {
        const response = await API.get(Url.employees.getSalaryReport, {
          token: authState.token,
          reportType: reportType,
          reportYear: reportYear,
        });
        console.log(response);
        updateSalaryInterface(response);
      }
      //STUDENT
      else if (reportType === ReportType.STUDENT) {
        const response = await API.get(Url.employees.getStudentReport, {
          token: authState.token,
          reportType: reportType,
          reportYear: reportYear,
        });
        console.log(response);
        updateStudentInterface(response);
      }
      //PROFIT
      else if (reportType === ReportType.PROFIT) {
        const response = await API.get(Url.employees.getProfitReport, {
          token: authState.token,
          reportType: reportType,
          reportYear: reportYear,
        });
        console.log(response);
        updateProfitInterface(response);
      }
      //COURSE
      else if (reportType === ReportType.COURSE) {
        const response = await API.get(Url.employees.getCourseReport, {
          token: authState.token,
          reportType: reportType,
          reportYear: reportYear,
        });
        console.log(response);
        updateCourseInterface(response);
      }
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống đang gặp sự cố, vui lòng thử lại sau!");
    }
  };

  return (
    <>
      <Head>
        <title>Tình Hình Kinh Doanh</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box style={{ width: "100%" }} ml={"sm"}>
        <Title align="center" order={1} pt={"sm"}>
          Tình Hình Kinh Doanh
        </Title>
        <Container style={{ width: "100%" }} pt={"sm"}>
          <Grid pt={"sm"}>
            <Grid.Col span={4} p={"sm"}>
              <NativeSelect
                onChange={(event) => setReportType(event.currentTarget.value)}
                data={[
                  { value: ReportType.REVENUE, label: "Doanh Thu" },
                  // { value: ReportType.SALARY, label: "Khoản Chi" },
                  { value: ReportType.STUDENT, label: "Học Viên" },
                  // { value: ReportType.PROFIT, label: "Lợi Nhuận" },
                  { value: ReportType.COURSE, label: "Khóa Học" },
                ]}
                pt={"sm"}
              />
            </Grid.Col>
            <Grid.Col span={4} p={"sm"}>
              <NativeSelect
                value={reportYear}
                onChange={(event) => setReportYear(event.currentTarget.value)}
                data={Array.from(Array(20), (_, i) =>
                  (now.getFullYear() - i).toString()
                )}
                pt={"sm"}
              />
            </Grid.Col>
            <Grid.Col span={4} p={"sm"}>
              <Group position="center" pt={"sm"}>
                <Button onClick={getReportData}>Lọc báo cáo</Button>
              </Group>
            </Grid.Col>
          </Grid>
        </Container>

        <Title align="center" order={1} pt={"sm"}>
          {chartTitle}
        </Title>

        {metaData}

        <Container pt={"sm"}>
          <Grid>
            <Grid.Col span={isDrawCircleChart? 9:12}>
              <div id="lineChartContainer">
                <canvas id="lineChart"></canvas>
              </div>
            </Grid.Col>
            <Grid.Col span={isDrawCircleChart? 3:0}>
              <div id="circleChartContainer">
                <canvas id="circleChart"></canvas>
              </div>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default EmployeeBusinessScreen;
