import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import addPostValidator from "../../validators/addPostValidator";

const initialFormData = {
  title: "",
  desc: "",
  category: "",
};

const initialFormError = {
  title: "",
  category: "",
};

const NewPost = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading,setLoading] = useState(false);
  const [categories,setCategories] = useState([]);
  const [extensionError,setExtensionError] = useState(null);
  const [fileId,setFileId] = useState(null);
  const [isDisable,setIsDisable] = useState(false);
  const navigate = useNavigate()
  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        // setLoading(true);
        const response = await axios.get(
          `/category?size=1000`
        );
        const data = response.data.data;
        // console.log(data.categories)
        setCategories(data.categories);
        // setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error.response.data.message, {
          // position : toast.POSITION.TOP_RIGHT,
          autoClose: true,
        });
      }
    };
    getCategories();
  }, []);

  const handleSubmit = async (event) =>{
    event.preventDefault();
    const errors = addPostValidator({title : formData.title,category : formData.category  });
    if(errors.title || errors.category){
      setFormError(errors);
    }else{
      try {
        setLoading(true);

        let input = formData;
        if(fileId){
          console.log("fileId:"+fileId)
          input = {...input,file:fileId}
        }
        console.log("input"+input);
        // new post api request
        const response = await axios.post("/posts", input);
        const data = response.data;
        console.log(data);
        
        toast.success(data.message, {
          // position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, // Automatically closes after 3 seconds
        });
        setFormData(initialFormData);
        setFormError(initialFormError);
        setLoading(false);
        navigate("/posts");
      } catch (error) {
        setLoading(false);
        toast.error(error.response.data.message, {
          // position : toast.POSITION.TOP_RIGHT,
          autoClose: true,
        });
      }
    }
  }

  const handleFileChange = async (e) => {
    console.log(e.target.files);

    //creating form instance here
    const formInput = new FormData();
    // here image is taken from http://localhost:8000/api/v1/file/upload api body
    formInput.append('image',e.target.files[0]);

    const type = e.target.files[0].type;
    if(type === 'image/png' || type === 'image/jpg' || type === 'image/jpeg'){
      setExtensionError(null);

      try {
        setIsDisable(true);
        const response = await axios.post("/file/upload", formInput);
        const data = response.data;
        console.log(data)
        // const data = JSON.stringify(response);
        // console.log("file data:"+ response.data.data.id);
        setFileId(data.data._id);
        toast.success(data.message, {
          // position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, // Automatically closes after 3 seconds
        });
        setIsDisable(false);
      } catch (error) {
        // setLoading(false);
        setIsDisable(false);
        // console.log(error.response.data.message)
        toast.error(error.response.data.message, {
          // position : toast.POSITION.TOP_RIGHT,
          autoClose: true,
        });
      }
    }else{
      setExtensionError("Only .png or .jpg or .jpeg file allowed.");
    }
  }

  return (
    <div>
      <button className="button button-block" onClick={() => navigate(-1)}>
        Go Back
      </button>
      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <h2 className="form-title">New Post</h2>
          <div className="form-group">
            <label>Title</label>
            <input
              className="form-control"
              type="text"
              name="title"
              placeholder="React blog post"
              value={formData.title}
              onChange={handleChange}
            />
            {formError.title && <p className="error">{formError.title}</p>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              type="text"
              name="desc"
              placeholder="Lorem ipsum"
              value={formData.desc}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Select an image</label>
            <input
              className="form-control"
              type="file"
              name="file"
              placeholder="Lorem ipsum"
              onChange={handleFileChange}
            />
            {extensionError && <p className="error">{extensionError}</p>}
          </div>

          <div className="form-group">
            <label>Select a category</label>
            <select
              className="form-control"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
            {formError.category && (
              <p className="error">{formError.category}</p>
            )}
          </div>

          <div className="form-group">
            <input
              className="button"
              type="submit"
              disabled={isDisable}
              value={`${loading ? "Adding..." : "Add"}`}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPost;