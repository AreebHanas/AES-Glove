// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { useState, useEffect } from "react";
import userService from "../../servicers/admin/userService";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/user/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper to get full avatar URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return require("../../assets/img/defaultUser.png");
    if (typeof avatar === "string" && avatar.startsWith("/uploads/avatars")) {
      return "http://20.249.219.51:8080" + avatar;
    }
    return avatar;
  };

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setAvatarPreview(getAvatarUrl(user.avatar));
    }
  }, [user]);

  useEffect(() => {
    // On mount, if user is not set, fetch from localStorage
    if (!user || !user.email) {
      const stored = localStorage.getItem("user");
      if (stored) {
        dispatch(setUser(JSON.parse(stored)));
      }
    }
  }, [dispatch, user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);
    const result = await userService.updateProfile(formData);
    setLoading(false);
    if (result.error) {
      alert(result.message);
    } else {
      if (result.user) {
        dispatch(setUser(result.user));
        localStorage.setItem("user", JSON.stringify(result.user));
        setAvatarPreview(getAvatarUrl(result.user.avatar));
      }
      alert("Profile updated successfully");
    }
  };

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="bg-white border-0">
                <h3 className="mb-0">My Profile</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="text-center mb-4">
                    <img
                      alt="..."
                      className="rounded-circle"
                      src={avatarPreview}
                      style={{ width: 120, height: 120, objectFit: "cover" }}
                    />
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: "inline-block" }}
                      />
                    </div>
                  </div>
                  <FormGroup>
                    <label>Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>New Password</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                    />
                  </FormGroup>
                  <Button color="primary" type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
