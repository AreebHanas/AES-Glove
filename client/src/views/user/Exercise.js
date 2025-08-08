import { use, useEffect, useRef, useState } from "react";
// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Button,
} from "reactstrap";
// core components
import userService from "servicers/admin/userService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import User from "components/Headers/User.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSensor, setProcessingExerciseId, setIsTimerComplete, setTimerId, setIsStarted } from "store/processingExercise/processingExercise.js";
import { useWebSocket } from "customHooks/webShocketHook";

const UserExercise = () => {
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const { processingExerciseId, isStarted, isTimerComplete, timerId } = useSelector(state => state.processingExercise);
  const [items, setItems] = useState([]);
  const TIMER_DURATION = 20000;
  const [completedRounds,setCompleteRounds] = useState({})

  useEffect(() => {
    // Always initialize completedRounds for all items
    if (items.length > 0) {
      const initialVariable = {};
      for (let i = 0; i < items.length; i++) {
        initialVariable[`exercise${i}`] = 0;
      }
      setCompleteRounds(initialVariable);
    }
  }, [items]);
  
  const {wsRef}  = useWebSocket();
  let {rounds} = useWebSocket()
  const navigate = useNavigate();

  const calculateCompletedRounds = () => {
    console.log("Calculating completed rounds...");
    const index = items.findIndex(item => item.exerciseDetails._id === processingExerciseId && item.status === true);
    if (index > 0) {
      const completedRounds = rounds? rounds : 0;
      setCompleteRounds(prev => ({...prev, [`exercise${index}`]: completedRounds}));
      if (completedRounds === items[index].round) {
        toast.success(`Exercise ${items[index].exerciseDetails.name} completed!`);
        dispatch(setProcessingExerciseId(null));
        dispatch(setIsStarted(false));
      }
    }
  };




  const fetchPatientExercise = async () => {
    const result = await userService.getPatientExercise(user.id);
    if (result.error) {
      toast.error(result.message);
      return;
    } else {
        setItems(result.data);
    }
  };

  
  const processHandler = (isStart,exerciseId, sensor) => {
    dispatch(setIsStarted(isStart));
    rounds = 0
    if (isStart) {
      dispatch(setProcessingExerciseId(exerciseId));
      dispatch(setSensor(sensor));   
    } else {
      dispatch(setProcessingExerciseId(null));
      dispatch(setSensor(null));
    }
  }

  const startTimer = () => {
    if(items && items.length > 0){
      const restPosition = items.filter(deactive => deactive.status === false)
      if(restPosition && restPosition.length > 0){
        dispatch(setProcessingExerciseId(restPosition[0].exerciseDetails._id))
        dispatch(setIsTimerComplete(false));
        let seconds = TIMER_DURATION / 1000;
      toast.dismiss();
      const toastId = toast(
        (t) => (
          <span>
            Timer: <b>{seconds}</b> seconds
          </span>
        ),
        { duration: TIMER_DURATION + 1000, id: 'timer-toast' }
      );
      const interval = setInterval(() => {
        seconds--;
        toast.dismiss('timer-toast');
        if (seconds > 0) {
          toast(
            (t) => (
              <span>
                Timer: <b>{seconds}</b> seconds
              </span>
            ),
            { duration: 1100, id: 'timer-toast' }
          );
        }
      }, 1000);
        const id = setTimeout(() => {
          clearInterval(interval);
          dispatch(setProcessingExerciseId(null));
          dispatch(setIsTimerComplete(true));
          toast.dismiss('timer-toast');
          toast.success('Timer completed!');
        }, TIMER_DURATION);
        setTimerId(id);
      } else {
        toast.error("Cant start the timer")
      }
    }
  }

  const reset = ()=>{
    dispatch(setProcessingExerciseId(null));
    dispatch(setSensor(null));
    dispatch(setIsStarted(false));
    dispatch(setIsTimerComplete(false));
    if (timerId) {
      clearTimeout(timerId);
      toast.dismiss('timer-toast');
    }
  }

  console.log(completedRounds)

  useEffect(() => {
    calculateCompletedRounds();
  },[rounds])

  // Real-time update of completedRounds from WebSocket
  useEffect(() => {
    if (!wsRef.current?.data) return;
    const { rounds } = wsRef.current.data;
    const index = items.findIndex(item => item.exerciseDetails._id === processingExerciseId && item.status === true);
    if (index >= 0) {
      setCompleteRounds(prev => ({ ...prev, [`exercise${index}`]: rounds }));
      if (rounds === items[index].exerciseDetails.round) {
        toast.success(`Exercise ${items[index].exerciseDetails.name} completed!`);
        dispatch(setProcessingExerciseId(null));
        dispatch(setIsStarted(false));
      }
    }
  }, [ items, processingExerciseId]);

  useEffect(() => {
    fetchPatientExercise();
  }, []);

  return (
    <>
      <User />
      <Container className="mt-7" fluid>
        <Row className="mt-5">
          <div className="col">
            <div className="d-flex justify-content-end mb-3">
              <Button color="primary" onClick={() => navigate("/user/live-chart")}>Go to Live Graph</Button>
            </div>
            <Card className="bg-default shadow">
              <CardHeader className="d-flex bg-transparent border-0 justify-content-between">
                <h3 className="text-white mb-0">Exercise Table</h3>
                <div>
                  <Button disabled={isTimerComplete} onClick={()=>{startTimer()}} color="success" className="mr-2">
                    <i className="ni ni-watch-time mr-1" />
                    Timer
                  </Button>
                  <Button disabled={!isTimerComplete} onClick={()=>{reset()}} color="danger" className="mr-2">
                    <i className="ni ni-watch-time mr-1" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <Table
                className="align-items-center table-dark table-flush"
                responsive
              >
                <thead>
                  <tr className="align-items-center">
                    <th scope="col">Exercise Name</th>
                    <th scope="col">Exercise Demo</th>
                    <th scope="col" className="text-center">Rounds</th>
                    <th scope="col" className="text-center">Completed Rounds</th> 
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-white">No exercise assigned</td>
                    </tr>
                  ) : (
                    items.filter((active)=>active.status === true).map((item,index) => (
                      <tr key={item.exerciseDetails._id}>
                        <td>{item.exerciseDetails.name}</td>
                        <td><a className="mb-0 text-sm" href={item.exerciseDetails.url} target="_blank" rel="noopener noreferrer">{item.exerciseDetails.url}</a></td>
                        <td className="text-center">{item.round}</td>
                        <td className="text-center">{completedRounds[`exercise${index + 1}`]}</td>
                        <td className="text-center">
                          <Button color="success" disabled={isStarted || !isTimerComplete} onClick={(e) => processHandler(true,item.exerciseDetails._id, item.exerciseDetails.sensor)}>Start</Button>
                          <Button color="danger" disabled={!isStarted} onClick={(e) => processHandler(false,item.exerciseDetails._id, item.exerciseDetails.sensor)}>End</Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default UserExercise;
