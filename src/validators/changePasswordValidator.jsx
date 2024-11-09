const changePasswordValidator = ({oldPassword,newPassword}) => {
  const errors = {
    oldPassword : "",
    newPassword : ""
  };

  if(!oldPassword){
    errors.oldPassword = "Old Password is required";
  }

  if(!newPassword){
    errors.newPassword = "New Password is required";
  }else if(newPassword.length < 6){
    errors.newPassword = "New Password should be 6 characters long";
  }

  if(oldPassword && oldPassword === newPassword){
    errors.newPassword = "You are providing old password";
  }
  return errors;
}

export default changePasswordValidator;