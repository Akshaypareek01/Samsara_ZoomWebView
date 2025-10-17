// Example using useEffect hook

import { Base_url } from '../Config/BaseUrl';
import { KJUR } from 'jsrsasign';
import React,{useEffect,Fragment, useState} from "react";
import { useLocation } from 'react-router-dom';
const ZoomCdn = () => {
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const zoomMeetingNumberString = params.get('ZoomMeetingNumber');
    const ZoomMeetingNumber = JSON.parse(zoomMeetingNumberString);
    console.log("Zomm DEtails ==>",ZoomMeetingNumber.number,ZoomMeetingNumber.pass);
  var authEndpoint = Base_url
  var sdkKey = 'TsFvuPFLTeKf7_bNBWggPA'
  var meetingNumber =ZoomMeetingNumber.number
  var passWord = ZoomMeetingNumber.pass
  var role = ZoomMeetingNumber.role ? ZoomMeetingNumber.role : 0
  var userName = ZoomMeetingNumber.userName
  var userEmail = ZoomMeetingNumber.email
  var registrantToken = ''
  var zakToken = ''
  var leaveUrl = '/'
  var userId=ZoomMeetingNumber.email
  var SECRET="C7Dm4JuZ2QXoN0bM2OYTw5JxZvjPK1y9"




var meetingConfig ={
    mn: meetingNumber,
name: userName,
pwd: passWord,
role: role,
email:userEmail,
lang:"English",
signature: "",
china:"",

}

const serialize =(obj) => {
    // eslint-disable-next-line no-shadow
    var keyOrderArr = ["name", "mn", "email", "pwd", "role", "lang", "signature", "china"];

    Array.intersect = function () {
      var result = new Array();
      var obj = {};
      for (var i = 0; i < arguments.length; i++) {
        for (var j = 0; j < arguments[i].length; j++) {
          var str = arguments[i][j];
          if (!obj[str]) {
            obj[str] = 1;
          } else {
            obj[str]++;
            if (obj[str] == arguments.length) {
              result.push(str);
            }
          }
        }
      }
      return result;
    };

    if (!Array.prototype.includes) {
      Object.defineProperty(Array.prototype, "includes", {
        enumerable: false,
        value: function (obj) {
          var newArr = this.filter(function (el) {
            return el === obj;
          });
          return newArr.length > 0;
        },
      });
    }

    var tmpInterArr = Array.intersect(keyOrderArr, Object.keys(obj));
    var sortedObj = [];
    keyOrderArr.forEach(function (key) {
      if (tmpInterArr.includes(key)) {
        sortedObj.push([key, obj[key]]);
      }
    });
    Object.keys(obj)
      .sort()
      .forEach(function (key) {
        if (!tmpInterArr.includes(key)) {
          sortedObj.push([key, obj[key]]);
        }
      });
    var tmpSortResult = (function (sortedObj) {
      var str = [];
      for (var p in sortedObj) {
        if (typeof sortedObj[p][1] !== "undefined") {
          str.push(
            encodeURIComponent(sortedObj[p][0]) +
              "=" +
              encodeURIComponent(sortedObj[p][1])
          );
        }
      }
      return str.join("&");
    })(sortedObj);
    return tmpSortResult;
  }
useEffect(async()=>{
   console.log("Zoom data =======>",ZoomMeetingNumber && ZoomMeetingNumber)
    const {ZoomMtg} = await import ("@zoomus/websdk");
    ZoomMtg.setZoomJSLib('https://source.zoom.us/3.1.6/lib', '/av');
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
 
    var signature = ZoomMtg.generateSDKSignature({
     meetingNumber: meetingConfig.mn,
     sdkKey: sdkKey,
     sdkSecret: SECRET,
     role: meetingConfig.role,
     success: function (res) {
       console.log(res);
       meetingConfig.signature = res.result;
       meetingConfig.sdkKey = sdkKey;
       var joinUrl = "/meeting.html?" + serialize(meetingConfig);
       console.log(joinUrl);
       // window.open(joinUrl);
       window.location.replace(joinUrl);
     },
   });
  
  
//    ZoomMtg.generateSDKSignature({
//     meetingNumber:meetingNumber,
//     role:role,
//     sdkKey:sdkKey,
//     sdkSecret:SECRET,

//     success:function(signature){
//         ZoomMtg.init({
//             leaveUrl:leaveUrl,
//             success:function(data){
//                  ZoomMtg.join({
//                     meetingNumber: meetingNumber,
//                     signature:signature.result,
//                     sdkKey:sdkKey,
//                     userName:'Akshay Pareek',
//                     userEmail: 'akshay96102@gmail.com',
//                     passWord:passWord,
//                     tk: '',
                    
//                     success: function (res) {
//                                 console.log('Meeting joined successfully:==>', res);
//                               },
//                     error: function (res) {
//                                 console.error('Error joining meeting:==>', res);
//                               },
//                  })
//             },
//             error:function(err){

//                 console.log(err)
//             }
//         })
//     },
//     error:function(error){
//         console.log(error);
//     }
//    })
},[])

  return  <Fragment>
        <link type="text/css" rel="stylessheet" href='https://source.zoom.us/3.1.6/css/bootstrap.css' />
        <link type="text/css" rel="stylessheet" href='https://source.zoom.us/3.1.6/css/react-select.css' />
  </Fragment>
};

export default ZoomCdn;

