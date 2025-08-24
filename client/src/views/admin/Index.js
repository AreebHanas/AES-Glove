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

import Header from "components/Headers/Header.js";
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
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col xl="12">
            <div
              style={{
                background: "linear-gradient(90deg, #5e72e4 0%, #825ee4 100%)",
                color: "#fff",
                borderRadius: "0.5rem",
                boxShadow: "0 0.5rem 1rem rgba(94,114,228,0.15)",
                padding: "2rem 2rem 1rem 2rem",
                marginBottom: "2rem",
                textAlign: "center"
              }}
            >
              <h2 style={{ fontWeight: 700, letterSpacing: "1px" }}>Welcome to the Dashboard</h2>
              <p style={{ fontSize: "1.2rem", marginTop: "1rem", maxWidth: "700px", margin: "0 auto" }}>
                This page provides an overview of patient statistics and growth trends. Use the chart below to explore how patient accounts have changed over time. The dashboard is designed to help you monitor, analyze, and manage patient data efficiently.
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xl="4" className="mx-auto">
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
