/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useEffect,useState } from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  CardFooter,
} from "reactstrap";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate()
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
  
    if (loginData.email === "" || !loginData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
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
  
  const submit = () => {
    const isValid = validateInputs();
  
    if (isValid) {
      const data = {
        email: loginData.email,
        password: loginData.password,
      };
      navigate("/admin/index");
      // const {error,msg} = seederService.loginUser(data)
      // if (error) {
      //   setLoginData((prev)=>({
      //     ...prev,
      //     isPasswordValid : true,
      //     passwordError : msg
      // }))
      // } else {
      //   navigate("/admin/index")
      // }
    }
  };

const handleChange = (e)=>{
    const { name, value } = e.target;
    setLoginData((prev)=>({
        ...prev,
        [name]:value
    }))
}

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Or sign in with</small>
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
                <Button className="my-4" color="primary" type="button" onClick={()=>submit()}>
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
          <CardFooter className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <small>Sign in with credentials</small>
            </div>
            <div className="btn-wrapper text-center">
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("../../assets/img/icons/common/google.svg")
                        .default
                    }
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardFooter>          
        </Card>
      </Col>
    </>
  );
};

export default Login;
