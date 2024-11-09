import { useState } from "react";
import { toast } from "react-toastify";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/context/AuthContex";

const VerifyUser = () => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [loading2, setLoading2] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  const handleSendVerificationCode = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const requestBody = {
        email: auth.email
      };
      const response = await axios.post("/auth/send-verification-email", requestBody);
      const data = response.data;
      toast.success(data.message, {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, // Automatically closes after 3 seconds
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message, {
        // position : toast.POSITION.TOP_RIGHT,
        autoClose: true,
      });
    }
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(code){
      try {
        setLoading2(true);
        const requestBody = {
          email: auth.email,
          code : code
        };
        const response = await axios.post("/auth/verify-user", requestBody);
        const data = response.data;
        setCode("");
        setCodeError("");

        window.localStorage.removeItem("blogData");
        navigate("/login");
        toast.success(data.message, {
          // position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, // Automatically closes after 3 seconds
        });
        setLoading2(false);
      } catch (error) {
        setCode("");
        setCodeError("");
        setLoading2(false);
        toast.error(error.response.data.message, {
          // position : toast.POSITION.TOP_RIGHT,
          autoClose: true,
        });
      }
    }else{
      setCodeError("Code is required");
    }
  }
  return (
    <div>
      <button className="button button-block" onClick={() => navigate(-1)}>
        Go Back
      </button>
      <button
        className="button button-block"
        onClick={handleSendVerificationCode}
      >{`${loading ? "Sending..." : "Send verification code"}`}</button>

      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <h2 className="form-title">Verify User</h2>
          <div className="form-group">
            <label>Confirmation code</label>
            <input
              className="form-control"
              type="text"
              name="code"
              placeholder="789654"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {codeError && <p className="error">{codeError}</p>}
          </div>

          <div className="form-group">
            <input
              className="button"
              type="submit"
              value={`${loading2 ? "Verifing..." : "Verify"}`}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyUser;