import moment from "moment";
import React, { useState } from "react";
import { MdOutlinePushPin } from "react-icons/md";
import { IoCheckbox } from "react-icons/io5";
import { RiExpandDiagonalLine } from "react-icons/ri";
import { MdCreate, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiEdit } from "react-icons/fi";

const TaskCard = ({
  id,
  title,
  duedate,
  date,
  completed,
  content,
  isPinned,
  onEdit,
  onDelete,
  onPinTask,
  onStatus,
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Prevent navigation if edit or delete icon is clicked
    if (e.target.closest(".icon-btn")) return;
    navigate(`/task/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="border border-slate-200 rounded p-4 bg-slate-50 hover:shadow-xl transition-all ease-in-out "
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex">
            {/* ✅ Tick Button to mark completed */}
            <IoCheckbox
              className={`icon-btn mr-2 ${
                completed
                  ? "bg-white text-green-400 "
                  : "bg-slate-400 text-white hover:bg-white hover:text-green-400"
              }`}
              onClick={onStatus}
            />
            <h6 className="text-md font-medium ">{title}</h6>
          </div>

          <span className="text-xs text-slate-500">
            {moment(date).format("Do MMM YYYY")}
          </span>
        </div>
        <MdOutlinePushPin
          className={`icon-btn ${
            isPinned ? "text-[#2B85FF]" : "text-slate-300 hover:text-[#2B85FF]"
          }`}
          onClick={onPinTask}
        />
      </div>
      <p className="text-xs text-slate-600 mt-2 ">{content?.slice(0, 60)}</p>
      <div className="flex items-center justify-between mt-2 ">
        <div className="text-xs text-slate-500">
          {moment(duedate).format("Do MMM YYYY")}
          {/* <p>Status: {completed ? "✅ Completed" : "🕒 Incomplete"}</p> */}
        </div>
        <div className="flex items-center gap-2">
          {/* <RiExpandDiagonalLine
            onClick={handleCardClick}
            className=" icon-btn hover:text-blue-600 cursor-pointer"
          /> */}
          <MdCreate
            className=" icon-btn hover:text-green-600 cursor-pointer"
            onClick={onEdit}
          />
          <MdDelete
            className="icon-btn hover:text-red-500 cursor-pointer"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
