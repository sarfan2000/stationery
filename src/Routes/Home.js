import React, { useState, useEffect } from 'react'
import "./Home.css"
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { db } from '../firebase-config';
import { collection, getDocs, updateDoc, doc, getDoc, addDoc} from 'firebase/firestore';
import { serverTimestamp } from "firebase/firestore";

import {auth} from "../firebase-config"



const Home = () => {
 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const userCollectionRef = collection(db,"itemlog");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [reloadAmount, setReloadAmount] = useState("");

  const [selectedReloadBtn, setSelectedReloadBtn] = useState(false);
  const [selectedReleaseBtn, setSelectedReleaseBtn] = useState(false);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [note, setNote] = useState("");
 
  const [successmsg, setSuccessmsg] = useState("");

  const userEmail = auth.currentUser ? auth.currentUser.email : '';
  
  

  const handleClose = () => {
    setSelectedItem(null);
    setSelectedQuantity(null);
    setSelectedReloadBtn(false);
    setSelectedReleaseBtn(false)
  };

  const handleCloseSuccess =() =>{
  
    setIsFormSubmitted(false);

  }

  const reload = (name,quantity,docId) => {
    setSelectedItem(name);
    setSelectedQuantity(quantity);
    setSelectedDocId(docId);
    setSelectedReloadBtn(true);
  };

 

  const release = (name,quantity,docId) => {
    setSelectedItem(name);
    setSelectedQuantity(quantity);
    setSelectedDocId(docId);
    setSelectedReleaseBtn(true);
  };

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

 /* const handleReload = async () => {
    if (reloadAmount !== "") {
      const newCount = selectedQuantity + parseInt(reloadAmount);
  
      try {
        await userCollectionRef.doc(selectedItem).update({
          quantity: newCount
          
        });
    
        console.log("Document updated successfully!");
      } catch (error) {
        console.log("Error updating document:", error);
      }
    }
    
  };*/

  /*const handleReload = async () => {
    if (reloadAmount !== "" && selectedItem) {
      const newCount = selectedQuantity + parseInt(reloadAmount);
  
      try {
        const docRef = db.collection("itemlog").doc(selectedItem);
        await docRef.update({
          quantity: newCount
        });
        console.log("Document updated successfully!");
      } catch (error) {
        console.log("Error updating document:", error);
      }
    }
  };*/
/*
  const handleReload = async () => {
    if (reloadAmount !== "" && selectedItem) {
      const newCount = selectedQuantity + parseInt(reloadAmount);
  
      try {
        const docRef = db.collection("itemlog").doc(selectedItem);
        await docRef.update({
          quantity: newCount
        });
        console.log("Document updated successfully!");
      } catch (error) {
        console.log("Error updating document:", error);
      }
    }
  };*/
const handleReload = async () => {
    if (reloadAmount !== "" && selectedItem) {
      const newCount = Number(selectedQuantity) + parseInt(reloadAmount);
  
      try {
        const docRef = doc(db, "itemlog", selectedDocId);
        const docSnapshot = await getDoc(docRef);
  
        if (docSnapshot.exists()) {
          await updateDoc(docRef, {
            quantity: newCount
          });
          setIsFormSubmitted(true)
          handleClose();

          if(!isNaN(reloadAmount)){
            await addDoc(collection(db,"records"),{
              name:selectedItem,
              quantity:reloadAmount,
              note:note,
              status:"reload",
              username:userEmail,
              createdAt: serverTimestamp()
            });
          
            setSuccessmsg("Data added successfully");
          }
  
         
          console.log("Document updated successfully!");
        } else {
          console.log("Document does not exist.");
        }
      } catch (error) {
        console.log("Error updating document:", error);
      }
    }
  };

  const handleRelease = async () => {
    if (reloadAmount !== "" && selectedItem) {
      const newCount = Number(selectedQuantity) - parseInt(reloadAmount);
  
      try {
        const docRef = doc(db, "itemlog", selectedDocId);
        const docSnapshot = await getDoc(docRef);
  
        if (docSnapshot.exists()) {
          await updateDoc(docRef, {
            quantity: newCount
          });
          setIsFormSubmitted(true)
          handleClose();

          if(!isNaN(reloadAmount)){
            await addDoc(collection(db,"records"),{
              name:selectedItem,
              quantity:reloadAmount,
              note:note,
              username:userEmail,
              status:"release",
              createdAt: serverTimestamp()
            });
            console.log(userEmail);

            setSuccessmsg("Data added successfully");

          }

         
          console.log("Document updated successfully!");
        } else {
          console.log("Document does not exist.");
        }
      } catch (error) {
        console.log("Error updating document:", error);
      }
    }
  };
/*
  const handleReload = async () => {
    if (reloadAmount !== "" && selectedItem) {
      const newCount = Number(selectedQuantity) + parseInt(reloadAmount, 10);
  
      try {
        const docRef = doc(db, "itemlog", selectedDocId);
        const docSnapshot = await getDoc(docRef);
  
        if (docSnapshot.exists()) {
          await updateDoc(docRef, {
            quantity: newCount
          });
          console.log("Document updated successfully!");
        } else {
          console.log("Document does not exist.");
        }
      } catch (error) {
        console.log("Error updating document:", error);
      }
    }
  };*/




/*
  const handleReload = async () => {
    if (reloadAmount !== "" && selectedItem) {
      const newCount = selectedQuantity + parseInt(reloadAmount);
  
      try {
        const querySnapshot = await getDocs(userCollectionRef);
        querySnapshot.forEach((doc) => {
          if (doc.data().name === selectedItem) {
            const docRef = doc(db, "itemlog", doc.id);
            updateDoc(docRef, {
              quantity: newCount
            });
            console.log("Document updated successfully!");
          }
        });
      } catch (error) {
        console.log("Error updating document:", error);
      }
    }
  };*/
    
 
  
 // console.log(selectedQuantity);
  //console.log(reloadAmount);
  
  


  return (
    <>
      <Navbar/>
     
      <div className = {loading ? "visibleloader":"hideloader"}>

      </div>

      <div className='hello'>hello</div>
      <div className='test'>
        <div className="content">
          {users.map((user) => {
            return(
              <div className='box'>
              
                <h1 className='topic'>{user.name}</h1>
                <h1>{user.quantity}</h1>
                <button onClick={() => reload(user.name, user.quantity, user.id)}>reload</button>
                <button onClick={() => release(user.name, user.quantity, user.id)}>release</button>
                

              </div>
              

            
            );
          })}
        </div>

        {  selectedItem && selectedReloadBtn && (

        <div className='selected-item-reload'>
          Selected item: {selectedItem}
          
          <button onClick={handleClose}>close</button><br/>
          <label>amount</label>
          <input  onChange={(event)=>{setReloadAmount(event.target.value)}}></input><br/>
          <label>Note</label>
          <input  onChange={(event)=>{setNote(event.target.value)}}></input><br/>

          <button onClick={handleReload}>reload now</button>
          
          
          </div>)}
          
          { selectedItem && selectedReleaseBtn &&(
          
          <div className='selected-item-release'>
          Selected item: {selectedItem}
          
          <button onClick={handleClose}>close</button><br/>
          <label>amount</label>
          <input  onChange={(event)=>{setReloadAmount(event.target.value)}}></input><br/>
          <label>Note</label>
          <input  onChange={(event)=>{setNote(event.target.value)}}></input><br/>

          <button onClick={handleRelease}>release now</button>
          
          
          </div>)}

          {isFormSubmitted  &&
          <div className="success-message">
              <button onClick={handleCloseSuccess}>close</button><br/>
              <div>Document updated successfully!</div>
          </div>}

      
       
      </div>
      <Footer/>
    
    </>
  )
}

export default Home