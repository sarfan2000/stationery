import React, { useState } from 'react'
import "./Login.css"
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase-config"
import {useNavigate} from 'react-router-dom';

import logo from './images/logo.png';

let user = null;
let userLocal = JSON.parse(localStorage.getItem("USERDATA"));

export const Authorized = user || userLocal;

const Login = () => {
  
  const [loginEmail, setLoginEmail]  = useState("");
  const [loginPassword, setLoginPassword]  = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  //const [loggedUser, setLoggedUser] = useState();


 /* useEffect(() => {
    console.log(loggedUser);
  }, [loggedUser]);*/

 


  const login =  async ()=>{

   
    try {
        const userCredentials = await signInWithEmailAndPassword(auth,loginEmail,loginPassword);
        const loggedUser = userCredentials.user;
        localStorage.setItem("USERDATA", JSON.stringify(loggedUser));
        user = true; 
        navigate("/home");
        
      
    }
    catch (error) {
      if (error.code === "auth/wrong-password" || "auth/user-not-found") {
        setError("Your Username or Password is incorrect");
      } else {
        setError(error.message);
      }
      console.log(error.message);
    }

 

  } 


  {error && <p>{error}</p>}
 
  return (
    <div className="container">

      <div className='box1'>
        <div className='imgbox'>
          <img className='logo' src={logo} alt="ITUM Logo"/>
          <h2>ITUM Stationaries</h2>
        </div>
        <div className="login-form">
          <h2 className='text'>Login</h2>
          <div className="form-group">
            {/*<label className="label" htmlFor="username">Username</label>*/}
            <input
              className="input"
              type="text"
              id="loginEmail"
              value={loginEmail}
              placeholder='Username'
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            {/*<label className="label" htmlFor="password">Password</label>*/}
            <input
              className="input"
              type="password"
              id="loginPassword"
              value={loginPassword}
              placeholder='Password'
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>
          <div className='btn-container'>
          <button className="button" onClick={login}>Login</button>
          </div>
        </div>
      </div>
      <div className={`error-box ${error ? 'show' : ''}`}>
        {error && <h2>{error}</h2>}
      </div>
      
    </div>
  )
}

export default Login



