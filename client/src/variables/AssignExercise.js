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
import toast from 'react-hot-toast';
import userService from '../servicers/admin/userService';
import { useSelector } from "react-redux";

function AssignExercise(props) {
  const { className,modal,toggle,fetchExercise } = props;
  const [formData,setFormData] = useState({
    _id:'',
    name:'',
    url:'',
    rounds:0,
    isnameValid:false,
    isurlValid:false,
    isroundsValid:false,
    nameError:"",
    urlError:"",
    roundsError:""
  })
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { currentUser } = useSelector(state => state.user);

const handleChange = async (e) => {
    const { value, name } = e.target;
    if (name === "name") {
      const exercise = await userService.autoCompleteExercise(value);
      setSuggestions(exercise.data || []);
      setShowSuggestions(true);
      setFormData((prev) => ({
        ...prev,
        name: value,
      }));
    } else if (name === "rounds") {
      setFormData((prev) => ({
        ...prev,
        rounds: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      name: suggestion.name,
      url: suggestion.url || '',
     _id: suggestion._id,
    }));
    setShowSuggestions(false);
  };

  const validateInputs = () => {
    let isValid = true;
  
    if (formData.name === "") {
      setFormData((prev) => ({
        ...prev,
        isnameValid: false,
        nameError: "Please choose an available exercise",
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
    
    if (formData.rounds === 0) {
      setFormData((prev) => ({
        ...prev,
        isroundsValid: false,
        roundsError: "Please set rounds",
      }));
      isValid = false;
    } else {
      setFormData((prev) => ({
        ...prev,
        isurlValid: true,
        roundsError: "",
      }));
    }

    return isValid;
  };
  
  const submit = async (e) => {
    // e.preventDefault();
    const isValid = validateInputs();
  
    if (isValid) {
      const data = {
        exercise_id: formData._id,
        rounds: formData.rounds,
        user_id: currentUser.id
      };
      // navigate("/admin/index")
      const {error,message} = await userService.addPatientExercise(data)
      if (error) {
        setFormData((prev)=>({
          ...prev,
          isroundsValid : false,
          roundsError : message
      }))
        toast.error(message)
      } else {
        setFormData((prev)=>({
          ...prev,
          isroundsValid : true,
          roundsError : ''
      }))
       toast.success("exercise assigned successfully")
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
          <FormGroup style={{ position: 'relative' }}>
            <Label for="name">Exercise Name</Label>
            <Input
              type="input"
              name="name"
              id="name"
              autoComplete="off"
              placeholder='Enter a valid name'
              onChange={handleChange}
              value={formData.name}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul style={{
                position: 'absolute',
                zIndex: 1000,
                background: 'white',
                width: '100%',
                border: '1px solid #ccc',
                maxHeight: '150px',
                overflowY: 'auto',
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {suggestions.map((s, idx) => (
                  <li
                    key={s._id || idx}
                    style={{ padding: '8px', cursor: 'pointer' }}
                    onMouseDown={() => handleSuggestionClick(s)}
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            )}
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
            <Label for="rounds">Rounds</Label>
            <Input
              type="number"
              name="rounds"
              id="rounds"
              min={1}
              placeholder='Enter number of rounds'
              onChange={handleChange}
              value={formData.rounds}
            />
            {!formData.isroundsValid && <small style={{ color: "red" }}>{formData.roundsError}</small>}
          </FormGroup>
      </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={submit}>
            Add Exercise
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

AssignExercise.propTypes = {
  className: PropTypes.string,
  modal: PropTypes.bool,
  toggle: PropTypes.func
};

export default AssignExercise;