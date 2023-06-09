import React, { useEffect } from 'react';
import {  Link, useNavigate } from "react-router-dom";
import CustomInput from '../components/CustomInput';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch ,useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';


//creating validation schema
const Login = () => {
  const dispatch = useDispatch();
  //navigate user object if exist
  const navigate = useNavigate();
  let schema = Yup.object().shape({
    email: Yup.string()
    .email("Email Should be valid")
    .required("Email is Required"),
    password: Yup.string().required("Password is Required"),
  });
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password:'',
    },
    validationSchema:schema,
    onSubmit:(values) => {
    //dispatch our login user
      dispatch(login(values));
      alert(JSON.stringify(values, null, 2));
    },
  });
  //Apply use effect to get the object
  //const {user,isloading,isError,isSuccess,message} = useSelector(
  //  (state) => state.auth
  //  );

  const authState = useSelector((state) => state);
  const { user,isLoading,isError,isSuccess,message} =authState.auth;

  useEffect(() => {
    //to check if the user exist  the navigate to admin
    console.log(user);
    if(!user == null ||  isSuccess){
      navigate("admin");
    }

  },[user,isLoading,isError,isSuccess,message]);//passing condition to check the state
  return (
    <div className="py-5" style={{background:"#ffd333", minHeight:"100vh"}}>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
    <div className="my-5 w-25 bg-white rounded-3 mx-auto p-4">
      <h3 className="text-center" title>Login</h3>
      <p className='"text-center'>Login to your Account to continue</p>
      <div className="error text-center">
        {message.message == "Rejected" ? "You are not an Admin" : ""}
      </div>
      <form action="" onSubmit={formik.handleSubmit}>
      <CustomInput 
        type="text" 
        name="email" 
        label="Email Address" 
        id="email"
        val={formik.values.email}
        onCh={formik.handleChange("email")}
        onBl={formik.handleChange("email")}
      />
      <div className="error">
        {formik.touched.email && formik.errors.email ? (
         <div>{formik.errors.email}</div>
        ) : null}
      </div>
      <CustomInput 
        type="password" 
        name="password" 
        label="Password Address" 
        id="pass"
        val={formik.values.password}
        onCh={formik.handleChange("password")}
        onBl={formik.handleChange("password")}
      />
      <div className="error">
        {formik.touched.password && formik.errors.password ? (
         <div>{formik.errors.password}</div>
        ) : null}
      </div>
      <div className='mb-3 text-end'>
        <Link to="forgot-password">
        Forgot Password
        </Link>
      </div>
      <button
        className="border-0 px-3 py-2 text-white fw-bold w-100 text-center text-decoration-none fs-5" 
        style={{background:"#ffd333"}}
        type= "submit"
      >   
      Login
      </button>
      </form>
    </div>
   </div>
  );
};

export default Login;