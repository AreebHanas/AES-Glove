import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Form,
  FormGroup,
} from 'reactstrap';
import PropTypes from 'prop-types';
import userService from 'servicers/userService';

function AddModal(props) {
  const { className,modal,toggle,fetchUser } = props;
  const [formData,setFormData] = useState({
    email:'',
    password:'',
    isEmailValid:false,
    isPasswordValid:false,
    emailError:"",
    passwordError:""
  })

const handleChange = (e) => {
   const {value,name} = e.target
   setFormData((prev)=>({
    ...prev,
    [name]:value
   }))
}

const validateInputs = () => {
    let isValid = true;
  
    if (formData.email === "" || !formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      setFormData((prev) => ({
        ...prev,
        isEmailValid: false,
        emailError: "Please enter a valid email id",
      }));
      isValid = false;
    } else {
      setFormData((prev) => ({
        ...prev,
        isEmailValid: true,
        emailError: "",
      }));
    }
  
    if (formData.password === "" || formData.password.length <= 8) {
      setFormData((prev) => ({
        ...prev,
        isPasswordValid: false,
        passwordError: "Your password should be up to 8 characters",
      }));
      isValid = false;
    } else {
      setFormData((prev) => ({
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
        email: formData.email,
        password: formData.password,
      };
      // navigate("/admin/index")
      const {error,msg} = await userService.addUser(data)
      if (error) {
        setFormData((prev)=>({
          ...prev,
          isPasswordValid : false,
          passwordError : msg
      }))
      } else {
        setFormData((prev)=>({
          ...prev,
          isPasswordValid : true,
          passwordError : ''
      }))
      fetchUser()
      toggle()
      }
    }
  };

  return (
    <div>
      <Modal
        isOpen={modal}
        toggle={toggle}
        className={className}
        backdrop={true}
        keyboard={true}
      >
        <ModalHeader toggle={toggle}>Create User</ModalHeader>
        <ModalBody>
        <Form onSubmit={(e) => e.preventDefault()}>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="input"
              name="email"
              id="email"
              placeholder='Enter a valid email'
              onChange={handleChange}
              value={formData.email}
            >
            </Input>
            {!formData.isEmailValid && <small style={{ color: "red" }}>{formData.emailError}</small>}
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="input"
              name="password"
              id="password"
              placeholder='Enter a password'
              onChange={handleChange}
              value={formData.password}
            >
            </Input>
            {!formData.isPasswordValid && <small style={{ color: "red" }}>{formData.passwordError}</small>}
          </FormGroup>
      </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={submit}>
            Create Account
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

AddModal.propTypes = {
  className: PropTypes.string,
  modal: PropTypes.bool,
  toggle: PropTypes.func
};

export default AddModal;