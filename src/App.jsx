import { useState, useEffect } from "react";
import { Routes, Route, data } from "react-router";

import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import AboutPage from "./pages/AboutPage";


function App() {
    const [events, setEvents] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);

    useEffect(()=>{
        fetch("http://localhost:5000/api/events")
        .then((response)=>response.json())
        .then((data)=>{
            setEvents(data);
        });
    }, []);

    function handleAddEvent(newEvent) {
        fetch("http://localhost:5000/api/events",{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body: JSON.stringify(newEvent)
         }).then((response)=>response.json())
         .then((data)=>{
            console.log(data);
            fetch("http://localhost:5000/api/events")
            .then((response)=>response.json())
            .then((data)=>{
                setEvents(data);
                setEditingEvent(null);
            });
         })
    }

    function handleDeleteEvent(eventId) {
        fetch(`http://localhost:5000/api/events/${eventId}`, {
            method: "DELETE"
        }).then((response)=>response.json())
        .then((data)=>{
            console.log(data);
            fetch("http://localhost:5000/api/events")
            .then((response)=>response.json())
            .then((data)=>{
                setEvents(data);
            });
        });
    }

    function handleUpdateEvent(updatedEvent) {
        fetch(`http://localhost:5000/api/events/${updatedEvent._id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(updatedEvent)
        }).then((response)=>response.json())
        .then((data)=>{
            console.log(data);
            fetch("http://localhost:5000/api/events")
            .then((response)=>response.json())
            .then((data)=>{
                setEvents(data);
                setEditingEvent(null);
            });
        });
    }

    function handleEditEvent(eventID){
        const selectedEvent = events.find(function(event){
            return event._id === eventID
        });
        setEditingEvent(selectedEvent);
    }

    
    return (
        <div>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={
                        <HomePage
                            events={events}
                            onAddEvent={handleAddEvent}
                            onUpdateEvent={handleUpdateEvent}
                            onDeleteEvent={handleDeleteEvent}
                            onEditEvent={handleEditEvent}
                            editingEvent={editingEvent}
                            
                        />
                    }
                />

                <Route
                    path="/events"
                    element={
                        <EventsPage
                            events={events}
                            onDeleteEvent={handleDeleteEvent}
                        />
                    }
                />

                <Route
                    path="/events/:eventId"
                    element={
                        <EventDetailsPage
                            events={events}
                        />
                    }
                />

                <Route
                    path="/about"
                    element={<AboutPage />}
                />
            </Routes>

            <Footer />
        </div>
    );
}

export default App;