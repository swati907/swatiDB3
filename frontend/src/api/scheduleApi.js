const BASE_URL = "http://localhost:3000/api/schedules";

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
    }
    return response.json();
};

// GET ALL
export const getSchedules = async () => {
    const response = await fetch(BASE_URL);
    return handleResponse(response);
};

// CREATE
export const createSchedule = async (data) => {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};

// UPDATE
export const updateSchedule = async (id, updates) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
    });
    return handleResponse(response);
};

// DELETE
export const deleteScheduleApi = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    });
    return handleResponse(response);
};