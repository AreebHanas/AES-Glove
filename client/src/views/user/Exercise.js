import { useEffect, useState } from "react";
// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import userService from "servicers/admin/userService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import User from "components/Headers/User.js";

const UserExercise = () => {
  const { currentUser } = useSelector(state => state.user);
  const [items, setItems] = useState([]);

  const fetchPatientExercise = async () => {
    const result = await userService.getPatientExercise(currentUser.id);
    if (result.error) {
      toast.error(result.message);
      return;
    } else {
        setItems(result.data);
    }
  };
  
  useEffect(() => {
    fetchPatientExercise();
  }, []);


  return (
    <>
      <User />
      {/* Page content */}
      <Container className="mt-7" fluid>
        {/* Dark table */}
        <Row className="mt-5">
          <div className="col">
            <Card className="bg-default shadow">
              <CardHeader className="d-flex bg-transparent border-0 justify-content-between">
                <h3 className="text-white mb-0">{currentUser.email} Exercise Table</h3>
              </CardHeader>
              <Table
                className="align-items-center table-dark table-flush"
                responsive
              >
                <thead>
                  <tr className="align-items-center">
                    <th scope="col">Exercise Name</th>
                    <th scope="col">Exercise Demo</th>
                    <th scope="col">Rounds</th>
                    {/* <th scope="col">Status</th> */}
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-white">No exercise assigned</td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.exerciseDetails._id}>
                        <td>{item.exerciseDetails.name}</td>
                        <td>{item.exerciseDetails.url}</td>
                        <td>{item.round}</td>
                        <td className="text-right">
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default UserExercise;
