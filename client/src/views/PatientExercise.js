import { act, useEffect, useState } from "react";
// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  Button,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
// import { useNavigate } from "react-router-dom";
import AssignExercise from "variables/AssignExercise";
import userService from "servicers/userService";
import ConformationModal from "variables/ConformationModal.js";
import toast from "react-hot-toast";
// import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const PatientExercise = () => {
  const { currentUser } = useSelector(state => state.user);
//   const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [items, setItems] = useState([]);
//   const dispatch = useDispatch()
  const [conformationModalOpen, setConfomationModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    action: () => {},
    conformationMsg: "",
  });

  const confermDelete = (title, action, conformationMsg) => {
    setModalData({
      title,
      action,
      conformationMsg,
    });
    setConfomationModalOpen(true);
  };

  const deleteAction = async (exercise_id, user_id) => {
    const data = {
        user_id: user_id,
        exercise_id: exercise_id,
    };
    const result = await userService.removePatientExercise(data);
    await fetchPatientExercise();
    result.error ? toast.error(result.message) : toast.success(result.message);

  };

  const fetchPatientExercise = async () => {
    const result = await userService.getPatientExercise(currentUser.id);
    // Add isEditing and editRound fields for UI editing
    const exercises = (result.data || []).map(item => ({
      ...item,
      isEditing: false,
      editRound: item.round
    }));
    setItems(exercises);
  };
  
  useEffect(() => {
    fetchPatientExercise();
  }, []);

  const toggle = () => setModal(!modal);

  const enableRoundEdit = idx => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, isEditing: true, editRound: item.round } : { ...item, isEditing: false }));
  };

  const handleRoundChange = (idx, value) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, editRound: value } : item));
  };

  const saveRoundEdit = async (idx, exerciseId, newRound) => {
    const data = { user_id: currentUser.id, exercise_id: exerciseId, rounds: Number(newRound) };
    const result = await userService.editPatientExercise(data);
    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success('Rounds updated');
      fetchPatientExercise();
    }
  };

  const cancelRoundEdit = idx => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, isEditing: false, editRound: item.round } : item));
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Dark table */}
        <Row className="mt-5">
          <div className="col">
            <Card className="bg-default shadow">
              <CardHeader className="d-flex bg-transparent border-0 justify-content-between">
                <h3 className="text-white mb-0">{currentUser.name} Exercise Table</h3>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    return toggle();
                  }}
                >
                  Assigned Exercise
                </Button>
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
                    items.map((item, idx) => (
                      <tr key={item.exerciseDetails._id}>
                        <td>{item.exerciseDetails.name}</td>
                        <td>{item.exerciseDetails.url}</td>
                        <td>
                          {item.isEditing ? (
                            <>
                              <input
                                type="number"
                                min={1}
                                value={item.editRound}
                                onChange={e => handleRoundChange(idx, e.target.value)}
                                style={{ width: 60, textAlign: 'center', marginRight: 8 }}
                              />
                              <Button color="success" size="sm" onClick={() => saveRoundEdit(idx, item.exerciseDetails._id, item.editRound)} style={{ marginRight: 4 }}>Save</Button>
                              <Button color="secondary" size="sm" onClick={() => cancelRoundEdit(idx)}>Cancel</Button>
                            </>
                          ) : (
                            <>
                              {item.round}
                              <Button color="link" size="sm" style={{ padding: '0 0 0 8px' }} onClick={() => enableRoundEdit(idx)}>
                                <i className="fas fa-edit" />
                              </Button>
                            </>
                          )}
                        </td>
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              href="#pablo"
                              role="button"
                              size="sm"
                              color=""
                              onClick={e => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem
                                href="#pablo"
                                onClick={e => {
                                  e.preventDefault();
                                  confermDelete(
                                    "Delete Assigned Exercise",
                                    async () => await deleteAction(item.exerciseDetails._id, currentUser.id),
                                    "Are you sure you want to delete this Excersise ?"
                                  );
                                }}
                              >
                                Delete
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
        {conformationModalOpen && (
          <ConformationModal
            setOpen={setConfomationModalOpen}
            open={conformationModalOpen}
            title={modalData.title}
            conformationMsg={modalData.conformationMsg}
            action={modalData.action}
          />
        )}
      </Container>
      {modal && (
        <AssignExercise modal={modal} toggle={toggle} fetchExercise={fetchPatientExercise} />
      )}
    </>
  );
};

export default PatientExercise;
