
import React, { useEffect, useState } from "react";
// import axios from "axios";
import axios from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import moment from "moment";

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const navigate = useNavigate();

  const handleBack = (e) => {
    // Prevent navigation if edit or delete icon is clicked
    if (e.target.closest(".icon-btn")) return;
    navigate('/dashboard');
  };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tasks/${id}`);
        console.log("Fetched task:", response.data); // Debug log
        setTask(response.data);
      } catch (error) {
        console.error("Failed to fetch task", error);
      }
    };

    fetchTask();
  }, [id]);

  if (!task) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
        Loading task details...
      </div>
    );
  }


return (
    
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-3xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 space-y-4 border border-gray-200">
        <h2 className="text-2xl sm:text-2xl font-bold text-slate-700 break-words">{task.title}</h2>

        <div className="border border-slate-300 rounded-xl h-auto bg-slate-50">
            <p className="text-gray-700 p-2 text-base sm:text-sm  font-medium break-words">{task.content}</p>
        </div>

        <p className="text-sm sm:text-right">
          <strong>Status:</strong>{" "}
          <span className={task.completed ? "text-green-600 text-md font-medium" : "text-red-600 text-md font-medium"}>
            {task.completed ? "Completed" : "Pending"}
          </span>
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm sm:text-base">
          <p className="text-gray-500 text-sm">
            <strong className="text-sm">Created On:</strong> {moment(task.createdOn).format("Do MMM YYYY")}
          </p>
          <p className="text-gray-500 text-sm">
            <strong className="text-sm">Due Date:</strong> {moment(task.dueDate).format("Do MMM YYYY")}
          </p>
        </div>

        <button
          onClick={handleBack}
          className="mt-4 text-sm font-medium inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all duration-200"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default TaskDetails;


