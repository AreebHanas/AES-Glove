import { useEffect, useState } from "react";
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from "reactstrap";
import authService from "servicers/authService";
import { useNavigate , useLocation} from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "store/user/userSlice.js";

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation();
  const [loginData,setLoginData] = useState({
    email:"",
    password:"",
    isEmailValid:false,
    isPasswordValid:false,
    emailError:"",
    passwordError:""
  })

  const validateInputs = () => {
    let isValid = true;
  
    if (loginData.email === "" || !loginData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      setLoginData((prev) => ({
        ...prev,
        isEmailValid: false,
        emailError: "Please enter a valid email id",
      }));
      isValid = false;
    } else {
      setLoginData((prev) => ({
        ...prev,
        isEmailValid: true,
        emailError: "",
      }));
    }
  
    if (loginData.password === "" || loginData.password.length <= 8) {
      setLoginData((prev) => ({
        ...prev,
        isPasswordValid: false,
        passwordError: "Your password should be up to 8 characters",
      }));
      isValid = false;
    } else {
      setLoginData((prev) => ({
        ...prev,
        isPasswordValid: true,
        passwordError: "",
      }));
    }
  
    return isValid;
  };
  
  const submit = async (e) => {
    // e.preventDefault();
    const isValid = validateInputs();
  
    if (isValid) {
      const data = {
        email: loginData.email,
        password: loginData.password,
      };
      const {error,msg,resData} = await authService.loginUser(data)
      if (error) {
        setLoginData((prev)=>({
          ...prev,
          isPasswordValid : false,
          passwordError : msg
        }))
      } else {
        setLoginData((prev)=>({
          ...prev,
          isPasswordValid : true,
          passwordError : ''
        }))
        const token = resData.token.token
        localStorage.setItem('token',token)
        // Store all user details except password
        if (resData.user) {
          dispatch(setUser(resData.user));
          localStorage.setItem('user', JSON.stringify(resData.user));
        }
        navigate("/admin/index")
      }
    }
  };

const handleChange = (e)=>{
    const { name, value } = e.target;
    setLoginData((prev)=>({
        ...prev,
        [name]:value
    }))
}

useEffect( ()=>{
  const seeder = async() => {
    await authService.seeder()
  }
  seeder()
},[])

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign in with</small>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    autoComplete="new-email"
                    onChange={handleChange}
                    value={loginData.email} 
                    required={true}
                  />
                </InputGroup>
                {!loginData.isEmailValid && <small style={{ color: "red" }}>{loginData.emailError}</small>}
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    name="password"
                    onChange={handleChange} 
                    value={loginData.password} 
                    required={true}
                  />
                </InputGroup>
                {!loginData.isPasswordValid && <small style={{ color: "red" }}>{loginData.passwordError}</small>}
              </FormGroup>
              <div className="text-center">
                <Button className="my-4" color="primary" type="button" onClick={(e)=>{e.preventDefault(); return submit()}}>
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>       
        </Card>
      </Col>
    </>
  );
};

export default Login;
