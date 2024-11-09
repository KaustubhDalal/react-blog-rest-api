import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
import addCategoryValidator from "../../validators/addCategoryValidator";
const initialFormData = {
  title : "",
  desc : ""
}

const initialFormError = {
  title : ""
}

const UpdateCategory = () => {

  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const params = useParams();
  const category_id = params.id;

  useEffect(() =>{
    if(category_id){
      const getCategory = async () => {
        try{
          const response = await axios.get(`/category/${category_id}`);
          console.log(response);
          const data = response.data.data; 
          setFormData({title : data.category.title, desc : data.category.desc})
        }catch(error){
          toast.error(error.response.data.message, {
            // position : toast.POSITION.TOP_RIGHT,
            autoClose: true,
          });
        }
      }
      getCategory();
    }
  },[category_id]);

  const handleSubmit = async (event) =>{
    event.preventDefault();
    const errors = addCategoryValidator({title : formData.title});
    if(errors.title){
      setFormError(errors);
    }else{
      try {
        setLoading(true);
        //new category api request
        const requestBody = {
          title: formData.title,
          desc: formData.desc,
        };
        console.log(requestBody)
        const response = await axios.put(`/category/${category_id}`, requestBody);
        const data = response.data;
        console.log(data);
        //storing info in local storage
        // window.localStorage.setItem("blogData", JSON.stringify(data.data));

        toast.success(data.message, {
          // position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, // Automatically closes after 3 seconds
        });
        setFormData(initialFormData);
        setFormError(initialFormError);
        setLoading(false);
        navigate("/categories");
      } catch (error) {
        setLoading(false);
        // console.log(error.response.data.message)
        toast.error(error.response.data.message, {
          // position : toast.POSITION.TOP_RIGHT,
          autoClose: true,
        });
      }
    }
  }

  return (
    <div>
      <div>
      <button className="button button-block" onClick={() => navigate(-1)}>
        Go Back
      </button>
      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <h2 className="form-title">Update Category</h2>
          <div className="form-group">
            <label>Title</label>
            <input
              className="form-control"
              type="text"
              name="title"
              placeholder="Technology"
              value={formData.title}
              onChange={handleChange}
            />
            {formError.title && <p className="error">{formError.title}</p>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              name="desc"
              placeholder="Lorem ipsum"
              value={formData.desc}
              onChange={handleChange}
            ></textarea>
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
    </div>
  )
}

export default UpdateCategory;