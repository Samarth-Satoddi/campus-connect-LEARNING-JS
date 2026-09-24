import { useState, useEffect } from "react";

const emptyForm = {
  title: "",
  category: "",
  date: "",
  time: "",
  location: "",
  description: "",
};

function normalizeDateInput(value) {
  if (!value) return "";

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toISOString().split("T")[0];
}

function normalizeTimeInput(value) {
  if (!value) return "";

  const amPmMatch = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (amPmMatch) {
    let hours = Number(amPmMatch[1]);
    const minutes = amPmMatch[2];
    const meridiem = amPmMatch[3].toUpperCase();

    if (meridiem === "AM" && hours === 12) {
      hours = 0;
    }

    if (meridiem === "PM" && hours < 12) {
      hours += 12;
    }

    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  return value.slice(0, 5);
}

function EventForm({ onAddEvent, onUpdateEvent, editingEvent }) {
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  useEffect(function () {
    if (editingEvent != null) {
      setFormData({
        title: editingEvent.title,
        category: editingEvent.category,
        date: normalizeDateInput(editingEvent.date),
        time: normalizeTimeInput(editingEvent.time),
        location: editingEvent.location,
        description: editingEvent.description,
      });
      return;
    }

    setFormData(emptyForm);
  }, [editingEvent]);

  function handleChange(event) {
    const inputName = event.target.name;
    const inputValue = event.target.value;

    setFormData({
      ...formData,
      [inputName]: inputValue,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      formData.title === "" ||
      formData.category === "" ||
      formData.date === "" ||
      formData.time === "" ||
      formData.location === "" ||
      formData.description === ""
    ) {
      setFormError("Please fill in every field.");
      return;
    }

    const eventData = {
      title: formData.title,
      category: formData.category,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      description: formData.description,
    };

    if (editingEvent != null) {
      onUpdateEvent({
        ...editingEvent,
        ...eventData,
      });
    } else {
      onAddEvent({
        id: Date.now(),
        ...eventData,
      });
    }

    setFormData(emptyForm);
    setFormError("");
  }

  const isEditing = editingEvent != null;

  return (
    <section className="event-form-section">
      <p className="section-label">{isEditing ? "Update an Activity" : "Create an Activity"}</p>

      <h2>{isEditing ? "Update Campus Event" : "Add a New Campus Event"}</h2>

      <form className="event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title</label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Example: React Workshop"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Cultural">Cultural</option>
            <option value="Club">Club</option>
            <option value="Workshop">Workshop</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>

          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time</label>

          <input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="location">Location</label>

          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="Example: Seminar Hall"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the event"
          />
        </div>

        {formError !== "" && <p className="form-error">{formError}</p>}

        <button className="submit-button" type="submit">
          {isEditing ? "Update Event" : "Create Event"}
        </button>
      </form>
    </section>
  );
}

export default EventForm;