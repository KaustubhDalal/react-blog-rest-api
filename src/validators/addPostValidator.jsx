const addPostValidator = ({title,category}) => {
  const errors = {
    q  : "",
  };

  if(!title){
    errors.title = "Title is required";
  }

  if(!category){
    errors.category = "Category is required";
  }
  return errors;
}

export default addPostValidator;