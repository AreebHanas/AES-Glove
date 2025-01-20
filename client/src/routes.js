import Index from "views/Index.js";
import Profile from "views/Profile.js";
import Login from "views/Login.js";
import Patient from "views/Patient.js";
import Exercise from "views/Exercise.js";
import LiveChart from "views/LiveChart";

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
    icon: "ni ni-planet text-blue",
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
    icon: "ni ni-bullet-list-67 text-red",
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
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
    menuBar: false
  },
];
export default routes;
