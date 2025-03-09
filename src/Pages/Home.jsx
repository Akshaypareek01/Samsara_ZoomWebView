import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Base_url } from '../Config/BaseUrl';
import { Button, Switch,Modal,Box,Typography,TextField, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading,setloading] = useState(false);

    const handleBackToApp = () => {
      window.location.href = "samsara://";; // Adjust this to match your app's deep link
    };
    const handelZoomMeeting = (Data)=>{
    
        const data = Data
        console.log("Data===>",data)
        const ZoomMeetingNumber={
        number:data.meeting_number,
        pass:data.password,
        userName:"Test",
        email:"test@gmail.com",
        }
        const state = { ZoomMeetingNumber };
        const zoomMeetingNumberString = JSON.stringify(state.ZoomMeetingNumber);
        const queryParams = new URLSearchParams();
        queryParams.append('ZoomMeetingNumber', zoomMeetingNumberString);
        const queryString = queryParams.toString();
        console.log("zoom data ===>",zoomMeetingNumberString)
      navigate(`/cdn?${queryString}`);
        // navigate(`cdn/`, { state: { ZoomMeetingNumber } });
      }

      const getAllClasses = async () => {
        setloading(true)
        try {
          const response = await axios.get(`${Base_url}api/classes`); // Update the API endpoint accordingly
         
          const Data = response.data.data
          setloading(false)
          if(Data){
           
              const formattedData = Data.map((item) => ({
              "Title":item.title,
             "Teacher":item.teacher.name,
             "Date":item.schedule,
            
            "Recordings":"coming soon",
       
           "Meeting":<Box style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
            {
              item.meeting_number &&
              <Button variant='contained' color='success'  onClick={()=>{handelZoomMeeting(item)}}>Join</Button>
            }
    
    {
              !item.meeting_number &&
              <Button variant='contained'  color='error'>not started</Button>
            }
            
        </Box>
         }));

    
         setRows(formattedData);

       
        
        
          }
        } catch (error) {
          
          console.error('Error fetching classes:', error.message);
        }
      };

      useEffect(()=>{
        handleBackToApp()
      },[])
  return (
    <div style={{padding:"20px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <Button disabled={loading} variant='contained' onClick={getAllClasses}>
          {
            loading ? "loading..." : "See  Classes"
          }
        
          </Button>

          
        <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",

    padding: "10px",
    marginTop: "10px",
    textAlign: "left",
  }}
>
  {rows.map((el, index) => (
    <div key={index} style={{border:"1px solid grey",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"10px"}}>
      <div style={{height:"80px",textAlign:"center"}}>
        <p style={{fontSize:"16px",fontWeight:"bold"}}>{el.Title}</p>
      </div>
      <div>{el.Meeting}</div>
    </div>
  ))}

  
</div>

<Button  variant='contained' onClick={handleBackToApp}>
          Home
        
          </Button>
    </div>
  )
}
