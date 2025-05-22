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
import toast from 'react-hot-toast';

function AddModal(props) {
  const { className, modal, toggle, fetchUser, editUser, isEdit } = props;
  const [formData, setFormData] = useState({
    email: editUser?.email || '',
    password: '',
    isEmailValid: false,
    isPasswordValid: false,
    emailError: "",
    passwordError: ""
  });

  React.useEffect(() => {
    if (isEdit && editUser) {
      setFormData((prev) => ({
        ...prev,
        email: editUser.email || '',
        password: '',
      }));
    }
  }, [isEdit, editUser]);

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
    
      // Only require password for create, not for edit
      if (!isEdit && (formData.password === "" || formData.password.length <= 8)) {
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
      const isValid = validateInputs();
      if (!isValid) return;
      const data = {
        email: formData.email,
        password: formData.password,
        ...(isEdit && editUser? { user_id: editUser._id } : {})
      };
      let result;
      if (isEdit) {
        result = await userService.editUser(data);
      } else {
        result = await userService.addUser(data);
      }
      if (result.error) {
        setFormData((prev) => ({
          ...prev,
          isPasswordValid: false,
          passwordError: result.message
        }));
        toast.error(result.message);
        return;
      }
      setFormData((prev) => ({
        ...prev,
        isPasswordValid: true,
        passwordError: ''
      }));
      toast.success(isEdit ? "User updated successfully" : "User created successfully");
      fetchUser();
      toggle();
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
        <ModalHeader toggle={toggle}>{isEdit ? 'Edit User' : 'Create User'}</ModalHeader>
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
              type="password"
              name="password"
              id="password"
              placeholder={isEdit ? 'Leave blank to keep current password' : 'Enter a password'}
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
            {isEdit ? 'Save Changes' : 'Create Account'}
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
  toggle: PropTypes.func,
  fetchUser: PropTypes.func,
  editUser: PropTypes.object,
  isEdit: PropTypes.bool,
};

export default AddModal;