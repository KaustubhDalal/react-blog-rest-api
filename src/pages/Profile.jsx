import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import profileValidator from "../validators/profileValidator";

const initialFormData = {
  name: "",
  email: "",
};

const initialFormError = {
  name: "",
  email: "",
};

const Profile = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);
  const [oldEmail, setOldEmail] = useState(null);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        // setLoading(true);
        const response = await axios.get(
          `/auth/current-user`
        );
        console.log(response)
        const data = response.data.data;
        setFormData({name : data.user.name,email : data.user.email});
        setOldEmail(data.user.email);
      } catch (error) {
        setLoading(false);
        toast.error(error.response.data.message, {
          // position : toast.POSITION.TOP_RIGHT,
          autoClose: true,
        });
      }
    };
    getUser();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = profileValidator({
      name: formData.name,
      email: formData.email
    });

    if (
      errors.name ||
      errors.email
    ) {
      setFormError(errors);
    }else{
      try{
        setLoading(true);
        //signup api request
        const response = await axios.put("auth/update-profile",formData);
        const data = response.data;
        toast.success(data.message, {
          // position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000 // Automatically closes after 3 seconds
        });
        setFormError(initialFormError);
        setLoading(false);

        if(oldEmail !== formData.email){
          window.localStorage.removeItem("blogData");
          navigate('/login');
        }
      }catch(error){
        setLoading(false);
        toast.error(error.message,{
          // position : toast.POSITION.TOP_RIGHT,
          autoClose : true
        })
      }
      setFormError(initialFormError);
    }
  };

  return (
    <div>
      <button className="button button-block" onClick={() => navigate(-1)}>
        Go Back
      </button>

      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <h2 className="form-title">Update profile</h2>
          <div className="form-group">
            <label>Name</label>
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder="Jhon Doe"
              value={formData.name}
              onChange={handleChange}
            />
            {formError.name && <p className="error">{formError.name}</p>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="doe@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
            {formError.email && <p className="error">{formError.email}</p>}
          </div>

          <div className="form-group">
            <input
              className="button"
              type="submit"
              value={`${loading ? "Updating..." : "Update"}`}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;