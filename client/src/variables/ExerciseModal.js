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
import exerciseService from 'servicers/admin/exerciseService.js';
import toast from 'react-hot-toast';

function AddModal(props) {
  const { className,modal,toggle,fetchExercise } = props;
  const flexSensorKeys = [
    "EF_Flex", "IF_Flex", "MF_Flex", "PF_Flex", "RF_Flex",
    "TF_Flex", "WF_Flex"
  ];
  const [formData,setFormData] = useState({
    name:'',
    url:'',
    sensor: '',
    isnameValid:false,
    isurlValid:false,
    nameError:"",
    urlError:""
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
  
    if (formData.name === "") {
      setFormData((prev) => ({
        ...prev,
        isnameValid: false,
        nameError: "Please enter a exercise name",
      }));
      isValid = false;
    } else {
      setFormData((prev) => ({
        ...prev,
        isnameValid: true,
        nameError: "",
      }));
    }
  
    if (formData.url === "") {
      setFormData((prev) => ({
        ...prev,
        isurlValid: false,
        urlError: "Please enter a url",
      }));
      isValid = false;
    } else {
      setFormData((prev) => ({
        ...prev,
        isurlValid: true,
        urlError: "",
      }));
    }
  
    return isValid;
  };
  
  const submit = async (e) => {
    // e.preventDefault();
    const isValid = validateInputs();
  
    if (isValid) {
      const data = {
        name: formData.name,
        url: formData.url,
        sensor: formData.sensor,
      };
      // navigate("/admin/index")
      const {error,message} = await exerciseService.addExercise(data)
      if (error) {
        setFormData((prev)=>({
          ...prev,
          isurlValid : false,
          urlError : message
      }))
        toast.error(message)
      } else {
        setFormData((prev)=>({
          ...prev,
          isurlValid : true,
          urlError : ''
      }))
       toast.success("exercise created successfully")
      fetchExercise()
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
        <ModalHeader toggle={toggle}>Create exercise</ModalHeader>
        <ModalBody>
        <Form onSubmit={(e) => e.preventDefault()}>
          <FormGroup>
            <Label for="name">name</Label>
            <Input
              type="input"
              name="name"
              id="name"
              placeholder='Enter a valid name'
              onChange={handleChange}
              value={formData.name}
            />
            {!formData.isnameValid && <small style={{ color: "red" }}>{formData.nameError}</small>}
          </FormGroup>
          <FormGroup>
            <Label for="url">url</Label>
            <Input
              type="url"
              name="url"
              id="url"
              placeholder='Enter a url'
              onChange={handleChange}
              value={formData.url}
            />
            {!formData.isurlValid && <small style={{ color: "red" }}>{formData.urlError}</small>}
          </FormGroup>
          <FormGroup>
            <Label for="sensor">Select which sensor need to use for tracking rounds</Label>
            <Input
              type="select"
              name="sensor"
              id="sensor"
              value={formData.sensor}
              onChange={handleChange}
            >
              <option value="">-- None --</option>
              {flexSensorKeys.map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </Input>
          </FormGroup>
      </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={submit}>
            Create Exercise
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