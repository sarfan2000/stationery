import React, { useEffect, useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { auth } from "../firebase-config"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { updatePassword, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import "./Profile.css";


const Profile = () => {


  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [quantityerror, setQuantityError] = useState("");
  const [emptyerror, setEmptyError] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const [updateUsername, setUpdateUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updateConfirmPassword, setUpdateConfirmPassword] = useState("");
  const [updateError, setUpdateError] = useState(null);
  const userEmail = auth.currentUser ? auth.currentUser.email : '';

  const handleUpdateSubmit = async () => {
    console.log("click")
    if (newPassword !== updateConfirmPassword) {
      setError("New passwords do not match");
      return;
    }
    try {
      const user = auth.currentUser;

      if (oldPassword && newPassword) {
        const credentials = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credentials);
        await updatePassword(user, newPassword);
      }

      if (updateUsername) {
        await updateProfile(user, { displayName: updateUsername });
      }

      // Clear input fields and error
      setUpdateUsername("");
      setOldPassword("");
      setNewPassword("");
      setUpdateConfirmPassword("");
      setUpdateError(null);

      console.log("User profile updated:", user);
    } catch (updateError) {
      setUpdateError(updateError.message);
      console.log(updateError.message);
    }
  };




  const handleNewUserSubmit = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, username, password);
      const newUser = userCredentials.user;
      // Handle any additional operations for the new user

      // Clear input fields and error
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setError(null);

      console.log("New user created:", newUser);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const handleFocus = () => {
    setEmptyError("");
    setQuantityError("");
  };

  const handleSubmit = async (e) => { }

  /*const userEmail = auth.currentUser ? auth.currentUser.email : '';
  console.log('User email:', userEmail);*/


  const handleSignOut = useCallback(async () => {
    try {
      // Clear local storage
      localStorage.clear();

      await auth.signOut();
      console.log("User signed out successfully.");
      navigate("/");
    } catch (error) {
      console.log("Error signing out:", error);
    }
  }, [navigate]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear local storage
      localStorage.clear();
    };

    // Add the event listener when the component mounts
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Remove the event listener when handleSignOut is called
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleSignOut]);
    
  
  return (
    <>
    
    <Navbar />
      
      <div className='cont'>
        <div className='text-right vv'>
          <button className='btn btn-sm btn-danger' onClick={handleSignOut}>Logout</button>
        </div>
        <div className='row text-center'>
          <div className='col-md-2'></div>
          {/* UPDATE BOX */}
          <div className='col-md-4'>
            <div className='brdr1'>
              <h5 className='text-dark mt-2'>Update Profile</h5>
              {error && <p>{error}</p>}
              <div>
                <label>Username</label>
              </div>

              <div>
                <input value={updateUsername} type="email" onChange={(event) => setUpdateUsername(event.target.value)} onFocus={handleFocus} />
              </div>

              <div>
                <label>Old password</label>
              </div>

              <div>
                <input value={oldPassword} type="password" onChange={(event) => setOldPassword(event.target.value)} onFocus={handleFocus} />
              </div>

              <div>
                <label>New Password</label>
              </div>

              <div>
                <input value={newPassword} type="password" onChange={(event) => setNewPassword(event.target.value)} onFocus={handleFocus} />
              </div>

              <div>
                <label>Confirm Password</label>
              </div>

              <div>
                <input value={updateConfirmPassword} type="password" onChange={(event) => setUpdateConfirmPassword(event.target.value)} onFocus={handleFocus} />
              </div>

              <button className='btn btn-sm btn-danger mb-2 px-3' onClick={handleUpdateSubmit}>Update</button>
            </div>
          </div>

          {/* ADD NEW USER BOX */}
          <div className='col-md-4'>
            <div className='brdr2 text-center'>
              <h5 className='text-dark mt-2'>Add new user</h5>
              {error && <p>{error}</p>}

              <label>Username</label><br />
              <input value={username} type="email" onChange={(event) => setUsername(event.target.value)} onFocus={handleFocus} /><br />

              <label>Password</label><br />
              <input value={password} type="password" onChange={(event) => setPassword(event.target.value)} onFocus={handleFocus} /><br />

              <label>Confirm Password</label><br />
              <input value={confirmPassword} type="password" onChange={(event) => setConfirmPassword(event.target.value)} onFocus={handleFocus} /><br />

              <button className='btn btn-sm btn-warning px-4' onClick={handleNewUserSubmit}>Add</button><br />
            </div>
          </div>
          <div className='col-md-2'></div>


        </div>






      </div>
      {/* CURRENT USER AND SIGN OUT AREA*/}
      <h1 className='current'>current user details : {userEmail}</h1>



      <Footer />
    </>
  )
}

export default Profile