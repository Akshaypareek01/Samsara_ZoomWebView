import React, { useEffect, useState } from 'react'
import UserHeader from './Components/UserHeader'


import { KTCard } from '../../../../_metronic/helpers'
import { GenralTabel } from '../../../TabelComponents/GenralTable'
import MapLocation from '../../../MapLocation/MapLocation'
import { Button, Switch,Modal,Box,Typography,TextField, Card, CardContent } from '@mui/material'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import RemoveIcon from '@mui/icons-material/Remove';
import ChargingStationIcon from '@mui/icons-material/ChargingStation';
import ChaletIcon from '@mui/icons-material/Chalet';
import { useNavigate } from 'react-router-dom'
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import { UserWalletModal } from './Components/UserWalletModal'
import AddVehicle from './Components/AddVehicle'
import { BASE_URL, Base_url } from '../../../Config/BaseUrl'
import axios from 'axios'
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useFormik } from "formik";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import events from "./Events";
import HostMeeting from './HostMeeting'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from '@mui/material/styles';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const orangeTheme = createTheme({
  palette: {
    primary: {
      main: '#fff', // Set the main color to your desired shade of orange
    },
  },
});
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ paddingTop:2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const column=[
  {name:"Title"},
  {name:"Teacher"},
  {name:"Schedule Date"},
  {name:"Recordings"},
  {name:"View"},
  {name:"Meeting"}
  
]
const LiveClasses = () => {
  const navigate = useNavigate();
  const[ShowVideo,setShowVideo] = useState(false)
  const [value, setValue] = React.useState(0);
  const [rows, setRows] = useState([]);
  const [classes, setClasses] = useState([]);
  const [Events, setEvents] = useState([]);
  const [filterRows,setFilterRows] = useState([])
  const [update,setupdate] = useState(0)
  const [ZoomMeetingNumber,setZoomMeetingNumber] = useState({
    number:"",
    pass:""
  });
  const handelZoomMeeting = (Data)=>{
    
    const data = Data
    console.log("Data===>",data)
    const ZoomMeetingNumber={
    number:data.meeting_number,
    pass:data.password
    }
    navigate(`zoom-meeting/`, { state: { ZoomMeetingNumber } });
  }

  const handleChangetabs = (event, newValue) => {
    setValue(newValue);
  };
  
  const handelClassView = (id)=>{
    // navigate(`class_view/${id}`)
    console.log("class view");
  }

  function formatApiDataForCalendar(apiData) {
    const EventsData = apiData.map((clazz) => ({
      title: clazz.title,
      start: new Date(),
      end:"",
      extendedProps: {
        description: clazz.description,
        teacher: clazz.teacher,
        status: clazz.status,
        students: clazz.students,
        meeting_number: clazz.meeting_number
      }
    }));

    setEvents(EventsData);
    return EventsData;
  }
  const getAllClasses = async () => {
    try {
      const response = await axios.get(`${Base_url}api/classes`); // Update the API endpoint accordingly
      setClasses(response.data.data);
      const Data = response.data.data
      if(Data){
       
          const formattedData = Data.map((item) => ({
          "Title":item.title,
         "Teacher":item.teacher.name,
         "Date":item.schedule,
        
        "Recordings":"coming soon",
        "View":<RemoveRedEyeIcon onClick={()=>handelClassView(item._id)}/>,
       "Meeting":<Box style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        {
          item.meeting_number &&
          <Button variant='contained' color='success'  onClick={()=>{handelZoomMeeting(item)}}>Join</Button>
        }

{
          !item.meeting_number &&
          <Button variant='contained' color='error'>not start yet</Button>
        }
        
    </Box>
     }));


     formatApiDataForCalendar(Data)

     setRows(formattedData);
     setFilterRows(formattedData);
   
    
    
      }
    } catch (error) {
      console.error('Error fetching classes:', error.message);
    }
  };

 

  useEffect(() => {
    // Fetch all classes when the component mounts
    getAllClasses();
  }, [update]);
  return (
    <div>
      
        <Box sx={{ width: '100%' }}>
      <Box sx={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
      <ThemeProvider theme={orangeTheme}>
        <Tabs value={value} onChange={handleChangetabs} aria-label="basic tabs example" textColor="primary"
        indicatorColor="primary"
       
        >
          <Tab label="table view" {...a11yProps(0)}  style={{backgroundColor:`${value === 0 ? "#EE731B" : "#fff"}`,marginRight:"10px",borderRadius:"10px",marginBottom:"10px"}}/>
          <Tab label="calendar view" {...a11yProps(1)} style={{backgroundColor:`${value === 1 ? "#EE731B" : "#fff"}`,marginRight:"10px",borderRadius:"10px",marginBottom:"10px"}} />
          
        </Tabs>
        </ThemeProvider>
      </Box>
      <CustomTabPanel value={value} index={0}>
      <GenralTabel column={column} rows={rows} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
      <FullCalendar
         defaultView="dayGridMonth"
         header={{
           left: "prev,next",
           center: "title",
           right: "dayGridMonth,timeGridWeek,timeGridDay"
         }}
         themeSystem="Simplex"
         plugins={[dayGridPlugin]}
         events={Events}
         eventColor={"#" + Math.floor(Math.random() * 16777215).toString(16)}
         eventClick= {(info)=> {
          alert('Meeting: ' + info.event.title );
       
          // handelZoomMeeting();
       
          info.el.style.borderColor = 'grey';
        }}
        
      />
      </CustomTabPanel>

    </Box>
 </div>
  )
}

export default LiveClasses
