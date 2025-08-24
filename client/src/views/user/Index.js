import { useEffect } from "react";
import User from "components/Headers/User.js";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../store/user/userSlice";
import './UserDashboard.css';

const Index = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  // Hardcoded doctor details
  const doctor = {
    name: 'Dr. Sarah Williams',
    email: 'sarah.williams@hospital.com',
    phone: '+1 555-123-4567',
    specialization: 'Physical Therapy',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  };

  const dispatch = useDispatch();
  useEffect(() => {
    // Set description in Redux if available on login (from props or localStorage)
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.description) {
      dispatch(setCurrentUser({
        ...userData,
        description: userData.description
      }));
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <User />
      <div className="user-dashboard-container" style={{ minHeight: '80vh', background: 'linear-gradient(135deg, #2dce89 0%, #4363d8 100%)', paddingTop: 40 }}>
        <div className="doctor-profile-card">
          <div className="doctor-image-animated">
            <img src={doctor.image} alt="Doctor" className="doctor-img" />
            <span className="doctor-img-circle"></span>
          </div>
          <div className="doctor-details">
            <h2 className="doctor-name">{doctor.name}</h2>
            <p className="doctor-specialization">{doctor.specialization}</p>
            <p className="doctor-email">Email: {doctor.email}</p>
            <p className="doctor-phone">Phone: {doctor.phone}</p>
          </div>
        </div>
        <div className="doctor-note-card">
          <h3 className="doctor-note-title">Doctor's Note</h3>
          <div className="doctor-note-content">
            {currentUser.description ? (
              <span>{currentUser.description}</span>
            ) : (
              <span style={{ color: '#888' }}>No note available.</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
