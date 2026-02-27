import { useState, useEffect } from "react";
import "./App.css";

import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteScheduleApi
} from "./api/scheduleapi";

function App() {
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await getSchedules();
      setSchedules(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addSchedule = async () => {
    if (!form.title.trim() || !form.date || !form.startTime || !form.endTime) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const newSchedule = await createSchedule(form);
      setSchedules(prev => [...prev, newSchedule]);

      setForm({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: ""
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleComplete = async (schedule) => {
    try {
      const updated = await updateSchedule(schedule._id, {
        completed: !schedule.completed
      });

      setSchedules(prev =>
        prev.map(s =>
          s._id === updated._id ? updated : s
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteSchedule = async (id) => {
    try {
      await deleteScheduleApi(id);
      setSchedules(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div className="container">
      <h1>Schedule Management</h1>

      <div className="form">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <input
          type="time"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
        />

        <input
          type="time"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
        />

        <button onClick={addSchedule}>Add Schedule</button>
      </div>

      <ul>
        {schedules.length === 0 && (
          <p style={{ textAlign: "center" }}>No schedules added yet.</p>
        )}

        {schedules.map(schedule => (
          <li
            key={schedule._id}
            className={schedule.completed ? "completed" : ""}
          >
            <h3>{schedule.title}</h3>
            {schedule.description && <p>{schedule.description}</p>}
            <p>
              {schedule.date} | {schedule.startTime} - {schedule.endTime}
            </p>

            <div className="actions">
              <button onClick={() => toggleComplete(schedule)}>
                {schedule.completed ? "Mark Incomplete" : "Mark Complete"}
              </button>

              <button onClick={() => deleteSchedule(schedule._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;