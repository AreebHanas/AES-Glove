import Index from "views/admin/Index.js";
import Profile from "views/admin/Profile.js";
import Login from "views/admin/Login.js";
import Patient from "views/admin/Patient.js";
import Exercise from "views/admin/Exercise.js";
import LiveChart from "views/admin/LiveChart.js";
import PatientExercise from "views/admin/PatientExercise.js";
import History from "views/admin/History.js";

// user components
import UserIndex from "views/user/Index.js";
import UserExercise from "views/user/Exercise.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
    menuBar: true,
    role:"admin"
  },
  {
    path: "/exercise",
    name: "Exercise",
    icon: "ni ni-user-run text-blue",
    component: <Exercise />,
    layout: "/admin",
    menuBar: true,
    role:"admin"
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
    menuBar: false,
    role:"admin"
  },
  {
    path: "/patient",
    name: "Patients",
    icon: "ni ni-single-02 text-red",
    component: <Patient />,
    layout: "/admin",
    menuBar: true,
    role:"admin"
  },
  {
    path: "/live-chart",
    name: "Live Chart",
    icon: "ni ni-single-02 text-yellow",
    component: <LiveChart />,
    layout: "/admin",
    menuBar: false,
    role:"admin"
  },
  {
    path: "/history",
    name: "History",
    icon: "ni ni-single-02 text-yellow",
    component: <History />,
    layout: "/admin",
    menuBar: false,
    role:"admin"
  },
  {
    path: "/patient-exercise",
    name: "Patient Exercise",
    icon: "ni ni-single-02 text-yellow",
    component: <PatientExercise />,
    layout: "/admin",
    menuBar: false,
    role:"admin"
  },
  // user routes
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <UserIndex />,
    layout: "/user",
    menuBar: true,
    role:"user"
  },
  {
    path: "/user-exercise",
    name: "Assigned Exercise",
    icon: "ni ni-bullet-list-67 text-blue",
    component: <UserExercise />,
    layout: "/user",
    menuBar: true,
    role:"user"
  },
  {
    path: "/live-chart",
    name: "Live Chart",
    icon: "ni ni-chart-bar-32 text-orange",
    component: <LiveChart />,
    layout: "/user",
    menuBar: false,
    role:"user"
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-info",
    component: <Profile />,
    layout: "/user",
    menuBar: false,
    role:"user"
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
