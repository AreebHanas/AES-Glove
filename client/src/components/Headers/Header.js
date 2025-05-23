import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import userService from '../../servicers/admin/userService.js'
import exerciseService from "../../servicers/admin/exerciseService.js";
import { useEffect, useState } from "react";

const Header = ({ refresh }) => {

  const [totalPatient,setTotalPatient] = useState(0);
  const [totalExercise,setExercise] = useState(0);
  const [currentlyOnlinePatient,setCurrentlyOnlinePatient] = useState(0);
  const [activatedPatient, setActivatedPatient] = useState(0);

  const totalCount = async ()=>{
    try {
      const patientCount = await userService.getPatientCount();
      setTotalPatient(patientCount.count?.totalPatient || 0);
      const exerciseCount = await exerciseService.getExerciseCount();
      setExercise(exerciseCount?.count || 0);
      const onlineCount = await userService.getOnlinePatientCount();
      setCurrentlyOnlinePatient(onlineCount.count?.onlinePatient || 0);
      const activatedCount = await userService.getActivatedPatientCount();
      setActivatedPatient(activatedCount.count || 0);
    } catch (err) {
      setTotalPatient(0);
      setExercise(0);
      setCurrentlyOnlinePatient(0);
      setActivatedPatient(0);
      console.error('Error fetching counts:', err);
    }
  }

  useEffect(() => {
    totalCount();
  }, [refresh]); // re-run when refresh changes

  // Expose totalCount for external refresh
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total Patients
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {totalPatient}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-user-injured" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total Exercises
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{totalExercise}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                          <i className="fas fa-dumbbell" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Active Patients
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{activatedPatient}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-user-check" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Online Patients
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{currentlyOnlinePatient}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                          <i className="fas fa-user-clock" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;