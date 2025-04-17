import { useEffect, useState } from "react";
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
import defaultUser from "../assets/img/defaultUser.png"
import { useNavigate } from "react-router-dom";
import AddModal from "variables/Modal";
import userService from "servicers/userService";
// dummy data
const Patient = () => {

  const navigate = useNavigate()
  const [modal, setModal] = useState(false);
  const [items, setItems] = useState([]);

  const fetchUser = async()=>{
    const result = await userService.fetchUser()
    setItems(result.data.patients);
  }
  useEffect(()=>{
    fetchUser()
  },[])

  const toggle = () => setModal(!modal);

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
                <h3 className="text-white mb-0">Patient Table</h3>
                <Button onClick={(e)=>{e.preventDefault(); return toggle()}}>Create Patient</Button>
              </CardHeader>
              <Table
                className="align-items-center table-dark table-flush"
                responsive
              >
                <thead>
                  <tr className="align-items-center">
                    <th scope="col">Patient ID</th>
                    <th scope="col">User email</th>
                    {/* <th scope="col">Status</th> */}
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                    {
                      items.map(
                        (item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <th scope="row">
                              <Media className="align-items-center">
                                <a
                                  className="avatar rounded-circle mr-3"
                                  href="#pablo"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <img alt='...' src={item.avatar ? item.avatar : defaultUser} />
                                </a>
                                <Media>
                                  <span className="mb-0 text-sm">{item.email}</span>
                                </Media>
                              </Media>
                            </th>
                            {/* <td>
                              <Badge color="" className="badge-dot mr-4">
                                <i className={item.status === "online" ? "bg-success" : "bg-danger"} />
                                {item.status}
                              </Badge>
                            </td> */}
                            <td className="text-right">
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  className="btn-icon-only text-light"
                                  href="#pablo"
                                  role="button"
                                  size="sm"
                                  color=""
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-arrow" right>
                                  <DropdownItem
                                    href="#pablo"
                                    disabled={item.status === "offline" ? true : false}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      navigate('/admin/live-chart')
                                    }}
                                  >
                                    Live graph
                                  </DropdownItem>
                                  <DropdownItem
                                    href="#pablo"
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      await userService.deleteUser(item.id)
                                      await fetchUser()
                                    }}
                                  >
                                    Delete
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </td>
                          </tr>
                        )
                      )
                    }
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
      {modal && <AddModal modal={modal} toggle={toggle} fetchUser={fetchUser} />}
    </>
  );
};

export default Patient;
