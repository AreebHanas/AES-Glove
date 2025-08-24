import { Link, useNavigate } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../store/user/userSlice";

const getAvatarUrl = (avatar) => {
  if (!avatar) return require("../../assets/img/defaultUser.png");
  if (typeof avatar === "string" && avatar.startsWith("/uploads/avatars")) {
    return "http://20.249.219.51/:8080" + avatar;
  }
  return avatar;
};

const AdminNavbar = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const avatar = getAvatarUrl(user.avatar);

  const handleLogout = () => {
    // Call backend to set online=false
    const userId = user.id;
    if (userId) {
      fetch("http://20.249.219.51:8080/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
    }
    // Clear user state and localStorage
    dispatch(setUser({}));
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("persist:root");
    navigate("/auth/login");
  };

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <small
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
          >
            {props.brandText}
          </small>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={avatar}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {user.name || user.email}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to={user.userRole === "admin" ? "/admin/profile" : "/user/profile"} tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={handleLogout}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
