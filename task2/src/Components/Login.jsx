import React from "react";
import "./CSS/login_form.css"; 

const Login= () => {
  return (
    <div className="login-page" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <h2>Login Form</h2>
      <form action="action_page.php" method="post">
        <div className="imgcontainer">
        <img src="../../public/login_sgt.jpg" alt="Login" className="login" />
        </div>
        <div className="container">
          <i className="fa fa-user icon"></i>
          <input type="text" placeholder="Enter Username" name="uname" className="input-field" required />
          <br />
          <i className="fa fa-key icon"></i>
          <input
            type="password"
            placeholder="Enter Password"
            name="psw"
            className="std_textbox"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            required
          />
          <span className="fa fa-fw fa-eye-slash field_icon toggle-password"></span>
          <br />
          <i className="fa fa-key icon"></i>
          <input
            type="password"
            placeholder="Re-Enter Password"
            name="psw-repeat"
            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
            required
          />
          <span className="fa fa-fw fa-eye-slash field_icon toggle-password"></span>
          <br />
          <br />
          <input type="checkbox" defaultChecked name="remember" /> Remember me &nbsp;
          <a href="#">Forgot Password?</a>
          <br />
          <br />
          <button type="submit">Login</button>&nbsp;&nbsp;&nbsp;
          <button type="reset" className="cancelbtn">Reset</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
