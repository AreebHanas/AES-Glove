import Index from "views/Index.js";
import Profile from "views/Profile.js";
import Login from "views/Login.js";
import Patient from "views/Patient.js";
import Exercise from "views/Exercise.js";
import LiveChart from "views/LiveChart.js";
import PatientExercise from "views/PatientExercise.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
    menuBar: true
  },
  {
    path: "/exercise",
    name: "Exercise",
    icon: "ni ni-user-run text-blue",
    component: <Exercise />,
    layout: "/admin",
    menuBar: true
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
    menuBar: false
  },
  {
    path: "/patient",
    name: "Patients",
    icon: "ni ni-single-02 text-red",
    component: <Patient />,
    layout: "/admin",
    menuBar: true
  },
  {
    path: "/live-chart",
    name: "Live Chart",
    icon: "ni ni-single-02 text-yellow",
    component: <LiveChart />,
    layout: "/admin",
    menuBar: false
  },
  {
    path: "/patient-exercise",
    name: "Patient Exercise",
    icon: "ni ni-single-02 text-yellow",
    component: <PatientExercise />,
    layout: "/admin",
    menuBar: false
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
    menuBar: false
  },
];
export default routes;
