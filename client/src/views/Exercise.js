import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Table,
  Container,
  Row,
  Button,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import AddModal from "variables/ExerciseModal.js";
import exerciseService from "servicers/exerciseService"; // make sure the file is named correctly!
import ConformationModal from "variables/ConformationModal.js";
import toast from "react-hot-toast";

const Exercise = () => {
  const [modal, setModal] = useState(false);
  const [items, setItems] = useState([]);
  const [conformationModalOpen, setConfomationModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    action: () => {},
    conformationMsg: "",
  });

  const confermDelete = (title, action, conformationMsg) => {
    setModalData({ title, action, conformationMsg });
    setConfomationModalOpen(true);
  };

  const deleteAction = async (id) => {
    const result = await exerciseService.deleteExercise(id);
    await fetchExercise();
    result.error ? toast.error(result.message) : toast.success(result.message);
  };

  const fetchExercise = async () => {
    const result = await exerciseService.fetchExercise();
    if (!result.error) {
      setItems(result.data.exercises || []);
    }
  };

  useEffect(() => {
    fetchExercise();
  }, []);

  const toggle = () => setModal(!modal);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <div className="col">
            <Card className="bg-default shadow">
              <CardHeader className="d-flex bg-transparent border-0 justify-content-between">
                <h3 className="text-white mb-0">Exercise Table</h3>
                <Button onClick={(e) => { e.preventDefault(); toggle(); }}>
                  Create Exercise
                </Button>
              </CardHeader>
              <Table className="align-items-center table-dark table-flush" responsive>
                <thead>
                  <tr className="align-items-center">
                    <th scope="col">Exercise Name</th>
                    <th scope="col">URL</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id}>
                      <th scope="row">
                        <span className="mb-0 text-sm">{item.name}</span>
                      </th>
                      <td>
                        <a className="mb-0 text-sm" href={item.url} target="_blank" rel="noopener noreferrer">
                          {item.url}
                        </a>
                      </td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle className="btn-icon-only text-light" href="#pablo" role="button" size="sm" color="" onClick={(e) => e.preventDefault()}>
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => {
                                e.preventDefault();
                                confermDelete(
                                  "Delete Exercise",
                                  async () => await deleteAction(item._id),
                                  "Are you sure you want to delete this exercise?"
                                );
                              }}
                            >
                              Delete
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
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
        <AddModal modal={modal} toggle={toggle} fetchExercise={fetchExercise} />
      )}
    </>
  );
};

export default Exercise;
