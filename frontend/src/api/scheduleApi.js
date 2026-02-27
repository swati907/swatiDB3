const BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api/schedules";

const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = "Something went wrong";

        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (err) {
            // If response is not JSON
            errorMessage = response.statusText;
        }

        throw new Error(errorMessage);
    }

    return response.json();
};

// ✅ GET ALL SCHEDULES
export const getSchedules = async () => {
    const response = await fetch(BASE_URL);
    return handleResponse(response);
};

// ✅ CREATE NEW SCHEDULE
export const createSchedule = async (data) => {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return handleResponse(response);
};

// ✅ UPDATE SCHEDULE
export const updateSchedule = async (id, updates) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
    });

    return handleResponse(response);
};

// ✅ DELETE SCHEDULE
export const deleteScheduleApi = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    return handleResponse(response);
};