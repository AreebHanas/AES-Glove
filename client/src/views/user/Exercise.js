import { useEffect, useRef, useState } from "react";
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
import { setProcessingExerciseId, setIsTimerComplete, setTimerId, setIsStarted } from "store/processingExercise/processingExercise.js";
import { useWebSocket } from "customHooks/webShocketHook";


const UserExercise = () => {
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const { processingExerciseId, isStarted, isTimerComplete, timerId } = useSelector(state => state.processingExercise);
  const [items, setItems] = useState([]);
  // const [isStarted, setIsStarted] = useState(false);
  // const [isTimerComplete,setIsTimerComplete] = useState(false)
  // const [timerId,setTimerId] = useState(null)
  const TIMER_DURATION = 20000;
  
  const {wsRef}  = useWebSocket();
  const navigate = useNavigate();

  const fetchPatientExercise = async () => {
    const result = await userService.getPatientExercise(user.id);
    if (result.error) {
      toast.error(result.message);
      return;
    } else {
        setItems(result.data);
    }
  };
  

  
  const processHandler = (isStart,exerciseId) => {
    dispatch(setIsStarted(isStart));
    if (isStart) {
      dispatch(setProcessingExerciseId(exerciseId));   
    } else {
      dispatch(setProcessingExerciseId(null));
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
          // console.log(isStarted, timerId)
          // console.log("isTimeComplete",isTimerComplete)
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
    dispatch(setIsStarted(false));
    dispatch(setIsTimerComplete(false));
    if (timerId) {
      clearTimeout(timerId);
      toast.dismiss('timer-toast');
    }
  }

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
                    <th scope="col">Rounds</th>
                    {/* <th scope="col">Status</th> */}
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-white">No exercise assigned</td>
                    </tr>
                  ) : (
                    items.filter((active)=>active.status === true).map((item) => (
                      <tr key={item.exerciseDetails._id}>
                        <td>{item.exerciseDetails.name}</td>
                        <td><a className="mb-0 text-sm" href={item.exerciseDetails.url} target="_blank" rel="noopener noreferrer">{item.exerciseDetails.url}</a></td>
                        <td>{item.round}</td>
                        <td className="text-center">
                          <Button color="success" disabled={isStarted || !isTimerComplete} onClick={(e) => processHandler(true,item.exerciseDetails._id)}>Start</Button>
                          <Button color="danger" disabled={!isStarted} onClick={(e) => processHandler(false,item.exerciseDetails._id)}>End</Button>
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
