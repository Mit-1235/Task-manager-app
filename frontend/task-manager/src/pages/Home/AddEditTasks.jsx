import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import axiosIntance from "../../utils/axiosInstance";

const AddEditTasks = ({
  taskData,
  type,
  getAllTasks,
  onClose,
  showToastMessage,
}) => {
  const [title, setTitle] = useState(taskData?.title || "");
  const [content, setContent] = useState(taskData?.content || "");
  const [dueDate, setDueDate] = useState(
    taskData?.dueDate ? taskData.dueDate.slice(0, 10) : ""
  );

  const [errorTitle, setErrorTitle] = useState(null);
  const [errorContent, setErrorContent] = useState(null);
  const [errorDate, setErrorDate] = useState(null);

  //   add task
  const addNewTask = async () => {
    try {
      const response = await axiosIntance.post("/add-task", {
        title,
        content,
        dueDate,
      });
      if (response.data && response.data.task) {
        showToastMessage("Task Added Successfully");
        getAllTasks();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorContent(error.response.data.message);
      }
    }
  };

  //   edit task
  const editTask = async () => {
    const taskId = taskData._id;
    try {
      const response = await axiosIntance.put("/edit-task/" + taskId, {
        title,
        content,
        dueDate,
      });
      if (response.data && response.data.task) {
        showToastMessage("Task Updated Successfully");
        getAllTasks();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorContent(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setErrorTitle("Title is required");
      return;
    }
    if (!content) {
      setErrorContent("Content is required");
      return;
    }
    if (!dueDate) {
      setErrorDate("DueDate is required");
      return;
    }
    setErrorTitle("");
    setErrorContent("");
    setErrorDate("");

    if (type === "edit") {
      editTask();
    } else {
      addNewTask();
    }
  };

  return (
    <div className="relative w-full px-4 py-6 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto bg-white rounded-lg ">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 cursor-pointer hover:bg-slate-100"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400 " />
      </button>

      <div className="flex flex-col gap-2 mt-2">
        <label htmlFor="title" className="input-label font-medium">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none border border-gray-100 bg-slate-50 p-2 rounded-md "
          placeholder="Go To Gym At 5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {errorTitle && <span className="text-red-500 text-sm">{errorTitle}</span>}

      <div className="flex flex-col gap-2 mt-4 ">
        <label className="input-label  font-medium">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded-md border border-gray-100"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {errorContent && (
        <span className="text-red-500 text-sm">{errorContent}</span>
      )}
      {/* here due date apply */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label font-medium">DUE DATE</label>
        <input
          type="date"
          className="text-base text-slate-950 outline-none bg-white p-2 rounded-md border border-gray-100"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      {errorDate && (<span className="text-red-500 text-sm">{errorDate}</span>)}

      <button
        className="btn-primary font-medium mt-5 p-3 "
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditTasks;
