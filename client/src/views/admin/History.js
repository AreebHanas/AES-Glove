import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import classnames from 'classnames';
import { Line } from 'react-chartjs-2';
import historyService from 'servicers/admin/historyService.js';
import { useSelector } from 'react-redux';
import Header from 'components/Headers/Header';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  classifyFlexValue01,
  classifyFlexValue02,
  classifyFlexValue03,
  classifyFlexValue04,
  classifyFlexValue05,
  classifyFlexValue06,
  classifyFlexValue07
} from '../../utils/flexClassifier';

const FLEX_FIELDS = [
  'EF_Flex', 'IF_Flex', 'MF_Flex', 'PF_Flex', 'RF_Flex', 'TF_Flex', 'WF_Flex'
];
const SENSOR_FIELDS = ['HR', 'SPO2', 'EMG', 'Pressure'];
const ALL_FIELDS = [...FLEX_FIELDS, ...SENSOR_FIELDS];

const FIELD_LABELS = {
  EF_Flex: 'EF Flex',
  IF_Flex: 'IF Flex',
  MF_Flex: 'MF Flex',
  PF_Flex: 'PF Flex',
  RF_Flex: 'RF Flex',
  TF_Flex: 'TF Flex',
  WF_Flex: 'WF Flex',
  HR: 'Heart Rate',
  SPO2: 'SPO2',
  EMG: 'EMG',
  Pressure: 'Pressure',
};

// Flex classification logic (reuse from flexClassifier.js)
const classifyFlex = [
  classifyFlexValue01,
  classifyFlexValue02,
  classifyFlexValue03,
  classifyFlexValue04,
  classifyFlexValue05,
  classifyFlexValue06,
  classifyFlexValue07,
];
const categoryMapping = {
  "No Bend": 1,
  "Almost No Bend": 2,
  "Almost Full Bend": 3,
  "Full Bend": 4
};
const flexSensorKeys = [
  "EF_Flex", "IF_Flex", "MF_Flex", "PF_Flex", "RF_Flex", "TF_Flex", "WF_Flex"
];
const flexSensorNames = [
  "1st Finger", "2nd Finger", "3rd Finger", "4th Finger",
  "5th Finger", "6th Finger", "7th Finger"
];

const History = () => {
  const {currentUser} = useSelector((state) => state.user);
  // 1 = month, 2 = week, 3 = day
  const [activeNav, setActiveNav] = useState(1);
  const [chartData, setChartData] = useState({});
  const [userId, setUserId] = useState(currentUser.id);
  const [selectedFields, setSelectedFields] = useState(['HR']); // Default to HR only
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDate, setEndDate] = useState(new Date());
  const [currentPeriod, setCurrentPeriod] = useState('month'); // Track current period
  const [flexChartData, setFlexChartData] = useState({ labels: [], datasets: [] });

  const handleFieldToggle = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field]
    );
  };

  const fetchHistory = async (period, fields = selectedFields, sDate = startDate, eDate = endDate) => {
    try {
      const data = await historyService.fetchHistory(userId, period, fields, sDate, eDate);
      const labels = [];
      const datasets = [];

      // Only include sensor fields in the main chart
      const mainChartFields = fields.filter(f => SENSOR_FIELDS.includes(f));

      if (period === 'month') {
        mainChartFields.forEach((field) => {
          const dataArr = data?.data.map((entry) => {
            const key = `avg${field}`;
            return entry[key]?.toFixed(2) || 0;
          });
          const color = getColorForField(field);
          datasets.push({
            label: FIELD_LABELS[field],
            data: dataArr,
            fill: false,
            backgroundColor: '#fff',
            borderColor: color,
            pointRadius: 4,
            pointBackgroundColor: color,
          });
        });
        data?.data.forEach((entry) => {
          const { year, month } = entry._id;
          labels.push(`${month}/${year}`);
        });
      } else if (period === 'week') {
        mainChartFields.forEach((field) => {
          const dataArr = data?.data.map((entry) => {
            const key = `avg${field}`;
            return entry[key]?.toFixed(2) || 0;
          });
          const color = getColorForField(field);
          datasets.push({
            label: FIELD_LABELS[field],
            data: dataArr,
            fill: false,
            backgroundColor: '#fff',
            borderColor: color,
            pointRadius: 4,
            pointBackgroundColor: color,
          });
        });
        data?.data.forEach((entry) => {
          const { year, week } = entry._id;
          labels.push(`W${week} ${year}`);
        });
      } else if (period === 'day') {
        mainChartFields.forEach((field) => {
          const key = `avg${field}`;
          const dataArr = data?.data.map((entry) => entry[key]?.toFixed(2) || 0);
          datasets.push({
            label: FIELD_LABELS[field],
            data: dataArr,
            fill: false,
            backgroundColor: '#fff',
            borderColor: getColorForField(field),
            pointRadius: 4,
            pointBackgroundColor: getColorForField(field),
          });
        });
        data?.data.forEach((entry) => {
          const { year, month, day } = entry._id;
          labels.push(`${day}/${month}`);
        });
      } else {
        // fallback for raw/session data (should not be used with new backend)
        mainChartFields.forEach((field) => {
          const dataArr = data?.data.map((entry) => entry.sensors?.[field] || 0);
          datasets.push({
            label: FIELD_LABELS[field],
            data: dataArr,
            fill: false,
            backgroundColor: '#fff',
            borderColor: getColorForField(field),
            pointRadius: 4,
            pointBackgroundColor: getColorForField(field),
          });
        });
        data?.data.forEach((entry) => {
          const date = new Date(entry.createdAt);
          labels.push(date.toLocaleString());
        });
      }

      setChartData({ labels, datasets, _rawData: data?.data || [] });
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const getColorForField = (field) => {
    // Assign a unique color for each field
    const colorMap = {
      EF_Flex: '#e6194b',
      IF_Flex: '#3cb44b',
      MF_Flex: '#ffe119',
      PF_Flex: '#4363d8',
      RF_Flex: '#f58231',
      TF_Flex: '#911eb4',
      WF_Flex: '#46f0f0',
      HR: '#2dce89',
      SPO2: '#ff1493',
      EMG: '#ffa500',
      Pressure: '#008080',
    };
    return colorMap[field] || '#fff';
  };

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    let period = 'month';
    if (index === 2) period = 'week';
    else if (index === 3) period = 'day';
    setCurrentPeriod(period); // update current period
    fetchHistory(period, selectedFields, startDate, endDate);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handlePeriodChange = (period, navIndex) => {
    setActiveNav(navIndex);
    setCurrentPeriod(period);
    fetchHistory(period, selectedFields, startDate, endDate);
  };

  useEffect(() => {
    fetchHistory(currentPeriod, selectedFields, startDate, endDate);
    // eslint-disable-next-line
  }, [selectedFields, currentPeriod, startDate, endDate]);

  useEffect(() => {
    // Only update flex chart if flex fields are selected
    if (!selectedFields.some(f => flexSensorKeys.includes(f))) {
      setFlexChartData({ labels: [], datasets: [] });
      return;
    }
    // Build flex chart data from backend data, not from main chart's datasets
    let flexLabels = [];
    let flexDatasets = [];
    if (chartData && chartData._rawData && chartData.labels && chartData.labels.length > 0) {
      const rawData = chartData._rawData;
      flexLabels = chartData.labels;
      flexDatasets = flexSensorKeys.map((key, idx) => {
        if (!selectedFields.includes(key)) return null;
        const classifier = classifyFlex[idx];
        const color = getColorForField(key);
        const dataArr = rawData.map((entry) => {
          const avgKey = `avg_${key}`;
          let val = entry[avgKey];
          if (val === undefined) val = entry.flex?.[key];
          if (val === undefined) val = 0;
          const category = classifier(Number(val));
          return categoryMapping[category] || 0;
        });
        return {
          label: flexSensorNames[idx],
          data: dataArr,
          fill: false,
          backgroundColor: '#fff',
          borderColor: color,
          pointRadius: 4,
          pointBackgroundColor: color,
        };
      }).filter(Boolean);
    }
    setFlexChartData({ labels: flexLabels, datasets: flexDatasets });
  }, [chartData, selectedFields]);

  return (
    <>
    <Header />
      <Container className="mt--7 d-flex justify-content-center align-items-center" fluid style={{ minHeight: '80vh' }}>
        <Row className="w-100 justify-content-center">
          <Col className="mb-5 mb-xl-0 d-flex justify-content-center" xl="10" lg="12">
            <Card className="bg-gradient-default shadow w-100" style={{ maxWidth: '900px', margin: '0 auto' }}>
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">Overview</h6>
                    <h2 className="text-white mb-0">Sensor Data</h2>
                  </div>
                  <div className="col-auto" style={{ marginTop: 24 }}>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {ALL_FIELDS.map((field) => (
                        <button
                          key={field}
                          onClick={() => handleFieldToggle(field)}
                          style={{
                            minWidth: 90,
                            margin: 2,
                            padding: '6px 10px',
                            borderRadius: 8,
                            border: selectedFields.includes(field) ? '2px solid #2dce89' : '1px solid #fff',
                            background: selectedFields.includes(field) ? getColorForField(field) : 'rgba(255,255,255,0.1)',
                            color: selectedFields.includes(field) ? '#fff' : '#fff',
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: 'pointer',
                            outline: 'none',
                          }}
                        >
                          {FIELD_LABELS[field]}
                        </button>
                      ))}
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-white mr-2" style={{fontWeight:600}}>Date Range:</span>
                      <DatePicker
                        selected={startDate}
                        onChange={handleDateChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        maxDate={new Date()}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                      />
                    </div>
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames('py-2 px-3', {
                            active: activeNav === 1
                          })}
                          style={{ minWidth: 100, textAlign: 'center', fontWeight: 600, fontSize: 16, color: '#fff', background: activeNav === 1 ? '#2dce89' : 'rgba(255,255,255,0.1)', borderRadius: 8, marginRight: 8, border: 'none' }}
                          href="#pablo"
                          onClick={(e) => { e.preventDefault(); handlePeriodChange('month', 1); }}
                        >
                          <span className="d-none d-md-block">Monthly Avg</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames('py-2 px-3', {
                            active: activeNav === 2
                          })}
                          style={{ minWidth: 100, textAlign: 'center', fontWeight: 600, fontSize: 16, color: '#fff', background: activeNav === 2 ? '#2dce89' : 'rgba(255,255,255,0.1)', borderRadius: 8, marginRight: 8, border: 'none' }}
                          href="#pablo"
                          onClick={(e) => { e.preventDefault(); handlePeriodChange('week', 2); }}
                        >
                          <span className="d-none d-md-block">Weekly Avg</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames('py-2 px-3', {
                            active: activeNav === 3
                          })}
                          style={{ minWidth: 100, textAlign: 'center', fontWeight: 600, fontSize: 16, color: '#fff', background: activeNav === 3 ? '#2dce89' : 'rgba(255,255,255,0.1)', borderRadius: 8, border: 'none' }}
                          href="#pablo"
                          onClick={(e) => { e.preventDefault(); handlePeriodChange('day', 3); }}
                        >
                          <span className="d-none d-md-block">Daily Avg</span>
                          <span className="d-md-none">D</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart d-flex justify-content-center align-items-center" style={{ minHeight: '450px' }}>
                  {chartData.labels ? (
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: true, position: 'top', labels: { color: '#fff', font: { size: 16 } } },
                          title: {
                            display: false
                          },
                          tooltip: {
                            enabled: true,
                            backgroundColor: '#222',
                            titleColor: '#2dce89',
                            bodyColor: '#fff',
                          }
                        },
                        scales: {
                          x: {
                            ticks: { color: '#fff', font: { size: 14 } },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                          },
                          y: {
                            beginAtZero: true,
                            ticks: { color: '#fff', font: { size: 14 } },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                          }
                        }
                      }}
                      height={420}
                    />
                  ) : (
                    <p className="text-white">Loading chart...</p>
                  )}
                </div>
                {/* Main chart: Only show HR if selected and only HR, never EMG or Pressure */}
                {chartData.labels && selectedFields.length > 0 && selectedFields.includes('HR') && (
                  <div className="chart d-flex justify-content-center align-items-center mt-4" style={{ minHeight: '250px' }}>
                    <Line
                      data={{
                        labels: chartData.labels,
                        datasets: [chartData.datasets.find(ds => ds.label === FIELD_LABELS.HR)].filter(Boolean)
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: true, position: 'top', labels: { color: '#fff', font: { size: 16 } } },
                          title: { display: true, text: 'Heart Rate', color: '#fff', font: { size: 18 } },
                          tooltip: {
                            enabled: true,
                            backgroundColor: '#222',
                            titleColor: '#2dce89',
                            bodyColor: '#fff',
                          }
                        },
                        scales: {
                          x: {
                            ticks: { color: '#fff', font: { size: 14 } },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                          },
                          y: {
                            beginAtZero: true,
                            ticks: { color: '#fff', font: { size: 14 } },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                          }
                        }
                      }}
                      height={250}
                    />
                  </div>
                )}

                {/* Flex classification chart */}
                {chartData.labels && selectedFields.length > 0 && selectedFields.some(f => flexSensorKeys.includes(f)) && flexChartData.labels && flexChartData.datasets.length > 0 && (
                  <div className="chart d-flex justify-content-center align-items-center mt-4" style={{ minHeight: '350px' }}>
                    <Line
                      data={flexChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: true, position: 'top', labels: { color: '#fff', font: { size: 16 } } },
                          title: { display: true, text: 'Flex Classification', color: '#fff', font: { size: 18 } },
                          tooltip: {
                            enabled: true,
                            backgroundColor: '#222',
                            titleColor: '#2dce89',
                            bodyColor: '#fff',
                          }
                        },
                        scales: {
                          x: {
                            ticks: { color: '#fff', font: { size: 14 } },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                          },
                          y: {
                            min: 1,
                            max: 4,
                            ticks: {
                              color: '#fff',
                              font: { size: 14 },
                              stepSize: 1,
                              callback: function(value) {
                                const reverseMapping = {
                                  1: 'No Bend',
                                  2: 'Almost No Bend',
                                  3: 'Almost Full Bend',
                                  4: 'Full Bend',
                                };
                                return reverseMapping[value] || '';
                              }
                            },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                          }
                        }
                      }}
                      height={320}
                    />
                  </div>
                )}

                {/* EMG chart */}
                {chartData.labels && selectedFields.length > 0 && selectedFields.includes('EMG') && (
                  <div className="chart d-flex justify-content-center align-items-center mt-4" style={{ minHeight: '250px' }}>
                    <Line
                      data={{
                        labels: chartData.labels,
                        datasets: [chartData.datasets.find(ds => ds.label === FIELD_LABELS.EMG)].filter(Boolean)
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: true, position: 'top', labels: { color: '#fff', font: { size: 16 } } },
                          title: { display: true, text: 'EMG', color: '#fff', font: { size: 18 } },
                          tooltip: {
                            enabled: true,
                            backgroundColor: '#222',
                            titleColor: '#2dce89',
                            bodyColor: '#fff',
                          }
                        },
                        scales: {
                          x: {
                            ticks: { color: '#fff', font: { size: 14 } },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                          },
                          y: {
                            beginAtZero: true,
                            ticks: { color: '#fff', font: { size: 14 } },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                          }
                        }
                      }}
                      height={180}
                    />
                  </div>
                )}

                {/* Pressure chart */}
                {chartData.labels && selectedFields.length > 0 && selectedFields.includes('Pressure') && (
                  <div className="chart d-flex justify-content-center align-items-center mt-4" style={{ minHeight: '250px' }}>
                    <Line
                      data={{
                        labels: chartData.labels,
                        datasets: [chartData.datasets.find(ds => ds.label === FIELD_LABELS.Pressure)].filter(Boolean)
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: true, position: 'top', labels: { color: '#fff', font: { size: 16 } } },
                          title: { display: true, text: 'Pressure', color: '#fff', font: { size: 18 } },
                          tooltip: {
                            enabled: true,
                            backgroundColor: '#222',
                            titleColor: '#2dce89',
                            bodyColor: '#fff',
                          }
                        },
                        scales: {
                          x: {
                            ticks: { color: '#fff', font: { size: 14 } },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                          },
                          y: {
                            beginAtZero: true,
                            ticks: { color: '#fff', font: { size: 14 } },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                          }
                        }
                      }}
                      height={180}
                    />
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default History;
