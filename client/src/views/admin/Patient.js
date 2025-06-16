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
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  CustomInput
} from "reactstrap";
import Header from "../../components/Headers/Header";
import defaultUser from "../../assets/img/defaultUser.png";
import { useNavigate } from "react-router-dom";
import AddModal from "variables/Modal";
import userService from "servicers/admin/userService";
import ConformationModal from "variables/ConformationModal.js";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../store/user/userSlice.js";
const Patient = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch()
  const [conformationModalOpen, setConfomationModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    action: () => {},
    conformationMsg: "",
  });
  const [editModal, setEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [headerRefresh, setHeaderRefresh] = useState(0);

  const confermDelete = (title, action, conformationMsg) => {
    setModalData({
      title,
      action,
      conformationMsg,
    });
    setConfomationModalOpen(true);
  };

  const deleteAction = async (id) => {
    const result = await userService.deleteUser(id);
    await fetchUser();
    setHeaderRefresh(prev => prev + 1);
    result.error ? toast.error(result.message) : toast.success(result.message);

  };

  const fetchUser = async () => {
    const result = await userService.fetchUser();
    setItems(result.data.users);
    setHeaderRefresh(prev => prev + 1);
  };
  
  useEffect(() => {
    fetchUser();
  }, []);

  const toggle = () => setModal(!modal);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim() === "") {
      fetchUser();
      return;
    }
    const result = await userService.searchUserByName(value);
    if (!result.error) {
      setItems(result.data);
    } else {
      setItems([]);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditModal(true);
  };

  const handleToggleStatus = async (user) => {
    const newStatus = !user.status;
    const result = await userService.toggleUserStatus(user._id, newStatus);
    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
      fetchUser();
      setHeaderRefresh(prev => prev + 1); // trigger header refresh
    }
  };

  return (
    <>
      <Header refresh={headerRefresh} />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Dark table */}
        <Row className="mt-5">
          <div className="col">
            <Card className="bg-default shadow">
              <CardHeader className="d-flex bg-transparent border-0 justify-content-between align-items-center">
                <h3 className="text-white mb-0">Patient Table</h3>
                <div style={{ position: 'relative', maxWidth: 300, width: '100%' }}>
                  <Input
                    style={{ border: 'none', background: 'white', borderRadius: 20, paddingLeft: 16, paddingRight: 36, height: 38, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    placeholder="Search by user email..."
                    value={search}
                    onChange={handleSearch}
                  />
                  {search && (
                    <span
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        zIndex: 10,
                        color: '#888',
                        fontSize: 18
                      }}
                      onClick={() => { setSearch(""); fetchUser(); }}
                      tabIndex={0}
                      role="button"
                      aria-label="Clear search"
                    >
                      <i className="fas fa-times" />
                    </span>
                  )}
                </div>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    return toggle();
                  }}
                >
                  Create Patient
                </Button>
              </CardHeader>
              <Table
                className="align-items-center table-dark table-flush text-center"
                responsive
              >
                <thead>
                  <tr className="align-items-center text-center">
                    {/* <th scope="col">Patient ID</th> */}
                    <th scope="col" className="text-center">User email</th>
                    <th scope="col" className="text-center">Status</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center text-white">No patient account</td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item._id} className="text-center">
                        {/* <td>{item._id}</td> */}
                        <td className="align-middle text-center">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 12 }}>
                            <a
                              className="avatar rounded-circle mr-3"
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                              style={{ display: 'inline-block' }}
                            >
                              <img
                                alt="..."
                                src={item.avatar ? item.avatar : defaultUser}
                              />
                            </a>
                            <span className="mb-0 text-sm" style={{ display: 'inline-block', verticalAlign: 'middle', textAlign: 'left' }}>{item.email}</span>
                          </div>
                        </td>
                        <td className="align-middle text-center">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                            <CustomInput
                              type="switch"
                              id={`status-switch-${item._id}`}
                              name="statusSwitch"
                              checked={!!item.status}
                              onChange={() => handleToggleStatus(item)}
                            />
                            <Badge color={item.status ? 'success' : 'danger'} className="ml-2">
                              {item.status ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </td>
                        <td className="text-right align-middle text-center">
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
                                disabled={
                                  item.status === "offline" ? true : false
                                }
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(setCurrentUser({
                                    name: item.name,
                                    email: item.email,
                                    id: item._id,
                                    userRole: item.userRole,
                                  }))
                                  navigate("/admin/live-chart");
                                }}
                              >
                                Live graph
                              </DropdownItem>
                              <DropdownItem
                                href="#pablo"
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(setCurrentUser({
                                    name: item.name,
                                    email: item.email,
                                    id: item._id,
                                    userRole: item.userRole,
                                  }))
                                  navigate("/admin/patient-exercise");
                                }}>
                                  Assigned Exercise
                              </DropdownItem>
                              <DropdownItem
                                href="#pablo"
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(setCurrentUser({
                                    name: item.name,
                                    email: item.email,
                                    id: item._id,
                                    userRole: item.userRole,
                                  }))
                                  navigate("/admin/history");
                                }}
                              >
                                History
                              </DropdownItem>
                              <DropdownItem
                                href="#pablo"
                                onClick={(e) => {
                                  e.preventDefault();
                                  confermDelete(
                                    "Delete Patient",
                                    async () => await deleteAction(item._id),
                                    "Are you sure you want to delete this patient account ?"
                                  );
                                }}
                              >
                                Delete
                              </DropdownItem>
                              <DropdownItem
                                href="#pablo"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleEdit({
                                    _id: item._id,
                                    email: item.email,
                                    userRole: item.userRole,
                                  });
                                }}
                              >
                                Edit
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
        <AddModal modal={modal} toggle={toggle} fetchUser={fetchUser} />
      )}
      {editModal && (
        <AddModal
          modal={editModal}
          toggle={() => setEditModal(false)}
          fetchUser={fetchUser}
          editUser={editUser}
          isEdit={true}
        />
      )}
    </>
  );
};

export default Patient;
