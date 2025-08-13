import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import TaskCard from "../../components/Cards/TaskCard";
import { MdAdd } from "react-icons/md";
import AddEditTasks from "./AddEditTasks";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosIntance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddTaskImg from "../../assets/images/empty-task.png";
import NoDataImg from "../../assets/images/no-task.png";
import SearchBar from "../../components/SearchBar/SearchBar";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allTasks, setAllTasks] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery) {
      onSearchTask(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (taskDetails) => {
    setOpenAddEditModal({ isShown: true, data: taskDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  // get user Info

  const getUserInfo = async () => {
    try {
      const response = await axiosIntance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // get all tasks

  const getAllTasks = async () => {
    try {
      const response = await axiosIntance.get("/get-all-tasks");

      if (response.data && response.data.tasks) {
        setAllTasks(response.data.tasks);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Delete tasks
  const deleteTask = async (data) => {
    const taskId = data._id;
    try {
      const response = await axiosIntance.delete("/delete-task/" + taskId);
      if (response.data && !response.data.error) {
        showToastMessage("Task Deleted Successfully", "delete");
        getAllTasks();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An unexpected error occurred. Please try again.");
      }
    }
  };

  // search for a task
  const onSearchTask = async (query) => {
    try {
      const response = await axiosIntance.get("/search-tasks", {
        params: { query },
      });

      if (response.data && response.data.tasks) {
        setIsSearch(true);
        setAllTasks(response.data.tasks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // update pin
  const updateIsPinned = async (taskData) => {
    const taskId = taskData._id;
    try {
      const response = await axiosIntance.put("/update-task-pinned/" + taskId, {
        isPinned: !taskData.isPinned,
      });
      if (response.data && response.data.task) {
        showToastMessage("Task Updated Successfully");
        getAllTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // update status
  const updateStatus = async (taskData) => {
    const taskId = taskData._id;
    try {
      const response = await axiosIntance.put("/task-status/" + taskId, {
        completed: !taskData.completed,
      });
      if (response.data && response.data.task) {
        showToastMessage("Status Updated Successfully");
        getAllTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // sort tasks by due date (earliest first)
  const fetchTasksSortedByDueDate = async () => {
    try {
      const response = await axiosIntance.get("/tasks?sortBy=dueDate");
      if (response.data && response.data.tasks) {
        setAllTasks(response.data.tasks);
      }
    } catch (error) {
      console.log("Error sorting by due date:", error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllTasks();
  };

  useEffect(() => {
    getAllTasks();
    getUserInfo();
    // return () => {};
  }, []);

  return (
    <div className="relative pb-20">
      <Navbar
        userInfo={userInfo}
        onSearchTask={onSearchTask}
        handleClearSearch={handleClearSearch}
      />
      {/* ✅ Sort By Due Date Button */}
      <div className=" sm:ml-8 sm:flex sm:justify-center">
        <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4 mt-5 mx-5">
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
            className="w-full sm:w-[60%]" // pass this prop down to SearchBar and apply it
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4 mt-5 mx-5">
          <button
            onClick={fetchTasksSortedByDueDate}
            className="bg-blue-500 text-sm font-medium text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto cursor-pointer"
          >
            Due Tasks First
          </button>
        </div>
      </div>

      <div className="container mx-auto mt-6 px-4 sm:px-6">
        {allTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {allTasks.map((item, index) => {
              return (
                <TaskCard
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  duedate={item.dueDate}
                  date={item.createdOn}
                  completed={item.completed}
                  content={item.content}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteTask(item)}
                  onPinTask={() => {
                    updateIsPinned(item);
                  }}
                  onStatus={() => updateStatus(item)}
                />
              );
            })}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NoDataImg : AddTaskImg}
            message={
              isSearch
                ? `Oops! No tasks found matching your serach.`
                : `Start Creating your First Task! Click the 'Add' button to note down your tasks and reminders. Let's get Started!`
            }
          />
        )}
      </div>
      {/* Floating Add Button */}
      <button
        className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-[#2B85FF] hover:bg-blue-600 fixed right-6 bottom-6 z-50 shadow-lg"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-2xl sm:text-3xl text-white " />
      </button>

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 40,
          },
        }}
        contentLabel=""
        className="w-full max-w-[500px] max-h-[90vh] bg-white rounded-md mx-auto mt-8 p-5 overflow-y-auto outline-none"
        // overflow-scroll
      >
        <AddEditTasks
          type={openAddEditModal.type}
          taskData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllTasks={getAllTasks}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Home;
