import { useState, useEffect } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import User from "components/Headers/User.js";
import { useSelector } from "react-redux";
import userService from "../../servicers/admin/userService.js";

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [userBarData, setUserBarData] = useState(chartExample2.data);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }
  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  useEffect(() => {
    const fetchUserStats = async () => {
      const result = await userService.getUserCreatedStatsByMonth();
      if (!result.error && result.data) {
        // Map YYYY-MM to month name
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const labels = result.data.labels.map((label) => {
          const [year, month] = label.split("-");
          return monthNames[parseInt(month, 10) - 1] + " " + year;
        });
        setUserBarData({
          ...userBarData,
          labels,
          datasets: [
            {
              ...userBarData.datasets[0],
              data: result.data.counts,
              label: "Accounts Created",
            },
          ],
        });
      }
    };
    fetchUserStats();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <User />
        {/* Page content */}
        <Container className="mt-7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">
                        Overview
                      </h6>
                      <h2 className="text-white mb-0">Sales value</h2>
                    </div>
                    <div className="col">
                      <Nav className="justify-content-end" pills>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: activeNav === 1,
                            })}
                            href="#pablo"
                            onClick={(e) => toggleNavs(e, 1)}
                          >
                            <span className="d-none d-md-block">Month</span>
                            <span className="d-md-none">M</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: activeNav === 2,
                            })}
                            data-toggle="tab"
                            href="#pablo"
                            onClick={(e) => toggleNavs(e, 2)}
                          >
                            <span className="d-none d-md-block">Week</span>
                            <span className="d-md-none">W</span>
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Line
                      data={chartExample1[chartExample1Data]}
                      options={chartExample1.options}
                      getDatasetAtEvent={(e) => console.log(e)}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Growth
                      </h6>
                      <h2 className="mb-0">Patient per month</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Bar
                      data={userBarData}
                      options={{
                        ...chartExample2.options,
                        scales: {
                          ...chartExample2.options.scales,
                          yAxes: [
                            {
                              ...((
                                chartExample2.options.scales &&
                                chartExample2.options.scales.yAxes &&
                                chartExample2.options.scales.yAxes[0]
                              ) ||
                                {}),
                              ticks: {
                                min: 0,
                                max: 100,
                                stepSize: 10,
                                callback: function (value) {
                                  return value;
                                },
                              },
                            },
                          ],
                        },
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
    </>
  );
};

export default Index;
