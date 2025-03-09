import React, { useEffect, useState } from 'react'
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
import { Box, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./ZoomClass.css"
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Base_url } from '../Config/BaseUrl';
const KJUR = require('jsrsasign')


export const ZoomMeeetingRoom = () => {
 
  const navigate = useNavigate();
  const location = useLocation();
  const [joined, setJoined] = useState(false);
  const { ZoomMeetingNumber } = location.state; 

    const client = ZoomMtgEmbedded.createClient();
    var authEndpoint = Base_url
  var sdkKey = 'TsFvuPFLTeKf7_bNBWggPA'
  var meetingNumber =ZoomMeetingNumber.number
  var passWord = ZoomMeetingNumber.pass
  var role = 0
  var userName = "Akshay Pareek"
  var userEmail = "Akshay96102@gmail.com"
  var registrantToken = ''
  var zakToken = ''
  var leaveUrl = 'http://localhost:3000'
  var userId="Akshay96102@gmail.com"
  var SECRET="C7Dm4JuZ2QXoN0bM2OYTw5JxZvjPK1y9"
  
  function getSignature() {
    const iat = Math.round(new Date().getTime() / 1000) - 30
    const exp = iat + 60 * 60 * 2
    const oHeader = { alg: 'HS256', typ: 'JWT' }
  
    const oPayload = {
      sdkKey: sdkKey,
      appKey: sdkKey,
      mn: meetingNumber,
      role: role,
      iat: iat,
      exp: exp,
      tokenExp: exp,
      userId: userId,
    }
  
    const sHeader = JSON.stringify(oHeader)
    const sPayload = JSON.stringify(oPayload)
    const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, SECRET);

    const data = {
      meetingId:meetingNumber,
      meetingPassword:passWord
    }
    setTimeout(()=>{
      startMeeting(sdkJWT,data)
    },1000)
    
    return sdkJWT
  }
  
  function startMeeting(signature,data) {
  
    let meetingSDKElement = document.getElementById('meetingSDKElement');
  
    client.init({zoomAppRoot: meetingSDKElement,
       language: 'en-US',
       customize: {
        video: {
          isResizable: false,
          popper: {
            disableDraggable: true
          }
        },
        chat: {
          popper: {
            disableDraggable: true,
           
          }
        }
      }
  
  })
    
    .then(() => {
      client.join({
        signature: signature,
        sdkKey: sdkKey,
        meetingNumber: data.meetingId,
        password: data.meetingPassword,
        userName: userId,
        userEmail: userEmail,
        tk: registrantToken,
        zak: zakToken,
        
      }).then((res) => {
        console.log('joined succesfully',res);
        setJoined(true);
      
      }).catch((error) => {
        console.log("error ==>",error);
        // alert("Meeting not started yet !!")
      })
    }).catch((error) => {
      console.log(error)
    })

    
  }

  const handleJoinMeeting = async () => {
           getSignature()
  };

  const handelBack=()=>{
    window.history.back();
  }

  const handleFullScreen = () => {
    let meetingSDKElement = document.getElementById('meetingSDKElement');
    if (meetingSDKElement) {
      if (meetingSDKElement.requestFullscreen) {
        meetingSDKElement.requestFullscreen();
      } else if (meetingSDKElement.mozRequestFullScreen) {
        meetingSDKElement.mozRequestFullScreen();
      } else if (meetingSDKElement.webkitRequestFullscreen) {
        meetingSDKElement.webkitRequestFullscreen();
      } else if (meetingSDKElement.msRequestFullscreen) {
        meetingSDKElement.msRequestFullscreen();
      }
    }
  };
 

  useEffect(()=>{
    console.log("Data===>",ZoomMeetingNumber);
    handleJoinMeeting();
  },[])
  return (
    <div>

{joined && (
        <Button
          sx={{ marginTop: '5px',marginBottom:"10px" }}
          variant="contained"
          onClick={handleFullScreen}
        >
          Go Fullscreen
        </Button>
      )}

<div id="meetingSDKElement" >
          {/* Zoom Meeting SDK Component View Rendered Here */}
        </div>



{
  !ZoomMeetingNumber && 
  <Box style={{textAlign:"center",border:"1px solid red"}}>
    <h2 style={{fontSize:"30px"}}>Meeting credentials not matched !!</h2>
    <h2 style={{fontSize:"16px"}}>Go back refresh and try again</h2>
    <Button sx={{marginTop:"30px"}} variant='contained'  onClick={handelBack} >Go Back</Button>
  </Box>
}


    </div>

    
  )
}


// .zmwebsdk-makeStyles-root-204 width :100% height:250px
// .zmwebsdk-makeStyles-root-54 height:80vh