
import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { db } from '../firebase-config';
import { collection, getDocs} from 'firebase/firestore';
import "./Record.css";
import {auth} from "../firebase-config"


const Records = () => {
  const [users, setUsers] = useState([]);
  const userCollectionRef = collection(db,"records");
  const [loading, setLoading] = useState(true);
  
  const userEmail = auth.currentUser ? auth.currentUser.email : '';


  
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await getDocs(userCollectionRef);
        setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();

  }, [userCollectionRef]);
  return (
    <>
    <Navbar/>  
    
    
    <div className = {loading ? "visibleloader":"hideloader"}>

    </div>
    <div className="content-record">
          {users.map((user) => {
            return(
              <div className='box-record'>
              
                <h1 className='topic'>{user.name}</h1>
                <h1>{user.status}</h1>
                <h1>{user.quantity}</h1>
                <h1>{user.username}</h1>
                <h1>{user.createdAt && user.createdAt.toDate().toLocaleString()}</h1>
                
                

              </div>
            
            );
          })}
     </div>

     <div className='em'>username:{userEmail} </div>
     <Footer/>

    </>
  )
}

export default Records