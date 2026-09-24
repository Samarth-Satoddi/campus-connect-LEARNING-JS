require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const Event = require("./models/Events");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
  console.log("MongoDB Conncted successfully!")
}).catch((error)=>{
  console.log("MongoDB Connection Error: ", error);
});


const initialEvents = [
  {
    id: 1,
    title: "MERN Stack Workshop",
    category: "Technology",
    date: "25 September 2026",
    time: "10:00 AM",
    location: "Computer Lab 1",
    description:
      "Learn the basics of MongoDB, Express, React, and Node.js through a practical workshop.",
  },
  {
    id: 2,
    title: "College Hackathon",
    category: "Technology",
    date: "28 September 2026",
    time: "9:00 AM",
    location: "Main Auditorium",
    description:
      "Form a team, solve a real problem, and present your solution to mentors.",
  },
  {
    id: 3,
    title: "Photography Club Meet",
    category: "Club",
    date: "30 September 2026",
    time: "2:00 PM",
    location: "Seminar Hall",
    description:
      "Meet fellow photography enthusiasts and learn basic composition techniques.",
  },
];

app.get("/", (req, res)=>{
    res.send("Backend is working");
})

app.get("/api/events", async (req, res)=>{
    const events =  await Event.find();
    res.json(events);
})

app.delete("/api/events/:id", async(req, res)=>{
  const deletedEvent = await Event.findByIdAndDelete(
    req.params.id
  )
  
  if(!deletedEvent){
    return res.status(400).json({
      message:"Event Not Found"
    })
  }
  initialEvents.splice(eventIndex, 1);
  res.json({
    message: "Event Deleted Successfully"
  })
  
})

app.post("/api/events", async (req, res)=>{
  const newEvent = await Event.create(req.body);
  res.json({
    message: "Event Added Successfully!",
    event: newEvent
  });
});


app.put("/api/events/:id", async (req, res)=>{
  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id, 
    req.body,
     { new: true }
)

if(!updatedEvent){
  return res.status(404).json({
    message: "Event Not Found!"
  });
}

  res.json({
    message: "Event Updated Successfully!",
    event: updatedEvent
  });
});  

app.listen(5000, ()=>{
    console.log("Server is running on port 5000");
})