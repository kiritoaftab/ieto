// const express=require('express') 
import express from 'express'
import db from './config.js' 
import {doc,setDoc,updateDoc,addDoc,collection,getDoc, onSnapshot, DocumentSnapshot, where,limit, getDocs,query} from 'firebase/firestore'
import cors from 'cors';

// const cors=require('cors') 
//import Users  from './config.js'
const app=express()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173'
}));


//APIS

// to add data 

app.post("/create",async(req,res)=>{
    const data =req.body 
    console.log(data)
    await Users.add(data)
    res.send({"msg":"user added"})
})

// https://firebase.google.com/docs/firestore/quickstart#web-version-9_1 

//Document reference 
const specialDay=doc(db,'dailySpecial/2023-02-14') //here we have specified the document ID 

//WRITE API call, overwrites the value provided ,
// If path i.e, {document/collection} is not created will create and write, 
//  if path already exists will overwrite
app.post("/addDataDoc",async(req,res)=>{
    
    try{
        await writeDailySpecial();
        console.log("Value written to db")
        res.send({"msg":"Value written to db"})
    }catch(error){
        console.log(`Error has occured ${error}`) 
        res.send("Error while writing to db")
    }
})

//From the course



function writeDailySpecial(){
    const docData={
        description:"A delicious Biryani",
        price:200,
        spice:"medium",
        vegan:false
    };
    setDoc(specialDay,docData); // This function should be used asynchrounously so add async and await 
}


//UPDATE API , if value exists updates the values to the new Values / or gives error if item doesn't exist 

app.post("/updateDoc",async (req,res)=>{
    try{
        await updateDailySpecial();
        res.send({"msg":"updated successfully"})
    }catch(error){
        res.send({"msg":`cannot update ${error} `})
    }
})

function updateDailySpecial(){
    const updateData={
        description:"A cool Smoothie",
        price:50,
        milk:"single toned",
        vegan:false
    }; 
    //The app crashes , so ensure to use only valid paths for this function
    //const errorneousPath=doc(specialDay,'/some-path/which-doesnt-exist') 
    updateDoc(specialDay,updateData);
    //This function adds the fields which were not initially present ,
    // and also updates the values for fields which are present in the updateData
    //we can see this function as an APPEND functionality 

}


// Updating API, using setDoc with merge:true 
// this enables to update the doc even if path is not created, 
//and if exists gives the updateDoc like merge functionality

app.post("/mergeDoc",async (req,res)=>{
    const mergeData={
        title:"Merging doc",
        price:60,
        meat:"chicken",
        vegan:false
    };
    const errorneousPath=doc(specialDay,'/some-path/which-doesnt-exist')
    try {
        //await setDoc(errorneousPath,mergeData,{merge:true})
        await setDoc(specialDay,mergeData,{merge:true})
        res.send("Values Merged")
    }
    catch(error){
        res.send("Error occured while merging ")
    }

}) 

//Adding a Document to the collection
// same functionality as push, it pushes the document onto the collection with auto generated unique ID 
// here we did not specify document ID , we connected it to the Collection 
const ordersCollection =collection(db,'orders'); // creates a orders collection in the root/

app.post("/addDocToCollection",async(req,res)=>{
    
    var recvData=req.body;
    console.log(recvData.value);
    const newDoc=await addDoc(ordersCollection,{
        eventText:recvData.value
    });

    res.send(`your doc was created at ${newDoc.path}`)

})


//READ Api , reads a single Document under a collection whose path is well defined 
//Note dont give spaces in api calls or else gives 404 error 

app.get("/getSingleDoc",async (req,res)=>{
    const mySnapshot=await getDoc(specialDay);
    
        const docData=mySnapshot.data();
        res.json(docData)
    
})

let dailySpecialUnsubscribe;

//Listen API , it will tell in real time when a particular data is updated 
function listenToDocument(){
    dailySpecialUnsubscribe=onSnapshot(specialDay,(docSnapshot)=>{
        if(docSnapshot.exists()){
            const docData=docSnapshot.data();
            console.log(`In realtime , docData is ${JSON.stringify(docData)}`);// just do res.send here
            return docData;
        }
    })
}

app.get("/activeDocListener",async(req,res)=>{
    const docData= await listenToDocument();
    res.send(`In realtime, docData is ${JSON.stringify(docData)}`); //this is giving undefined in POSTMAN
})

//Reading multiple documents in a collection 
//we need to first make our query by using query function, provide the collection and where clauses, if using orderby need to set up indexing
// then this query is passed to a getDocs function which gives a array of Documents , which we can loop through and display 
app.get("/multipleDocuments",async(req,res)=>{
    const ordersQuery= query(
        ordersCollection
    );
     const querySnapshot=await getDocs(ordersQuery);
     const allDocs= querySnapshot.docs; //returns an array of Docs  //This returns wiht lot of Jargins
    // console.log(typeof(allDocs));
    // // or you can use forEach() directly on the querySnapshot
    
    var docArray={}
    querySnapshot.forEach((snap)=>{
        console.log(`Document has id ${snap.id} contains data ${JSON.stringify(snap.data())}`)
        docArray[snap.id]=snap.data();
    }) 
    res.send(docArray);
})


app.listen(4000,()=>console.log("Up and running on port 4000")) 