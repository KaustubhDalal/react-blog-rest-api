import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContex";
const PrivateNavbar = () =>{

  const navigate = useNavigate();
  const auth = useAuth();
  const handleLogout = () => {
    window.localStorage.removeItem('blogData');
    toast.success("Logout Successfull", {
      // position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000 // Automatically closes after 3 seconds
    });
    navigate('/login');
  }

  return (
    <>
      <nav className="primary-link">
        <NavLink to="/">Home</NavLink>
        {/*only user with role 1 and 2 will be able to see categories module*/}
        {(auth.role === 1 || auth.role === 2) && (<NavLink to="/categories">Categories</NavLink>)}
        <NavLink to="/posts">Posts</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/setting">Setting</NavLink>
        <NavLink to="/login" onClick={handleLogout}>Logout</NavLink>
      </nav>
    </>
  )
}

export default PrivateNavbar;