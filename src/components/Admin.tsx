import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Table, Tag, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../redux/store";
import { setUser, UserDataType } from "../redux/UserReducer";
import { auth, database } from "../fire";
import toast from "react-hot-toast";
import AdminTable from "./AdminTable";
import { Redirect } from "react-router-dom";

const { Option } = Select;
const { Item } = Form;

export type AdminTaskType = {
  userId: string;
  task: string;
  taskKey: string;
};

type taskObject = {
  task: string;
  taskKey: string;
  userId: string;
  username: string;
};

export type managerDataType = {
  age: string;
  email: string;
  role: string;
  userId: string;
  username: string;
  tasks?: taskObject;
};

const Admin = () => {
  const dispatch = useDispatch();
  const { user, userData } = useSelector((state: StateType) => state.user);
  const [form] = Form.useForm();

  const [authUser, setAuthUser] = useState<any>();
  const [managersData, setManagersData] = useState<managerDataType[]>();
  const [adminTasksData, setAdminTasksData] = useState<AdminTaskType[]>([]);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.email !== null && user.uid !== null) {
          dispatch(
            setUser({
              email: user.email,
              uid: user.uid,
            })
          );
        }
        setAuthUser(user);
      } else {
        dispatch(setUser(undefined));
        setAuthUser(undefined);
      }
    });
  }, []);

  useEffect(() => {
    database.ref(`Manager`).on("value", (snap) => {
      console.log(snap.val());
      let newArray: managerDataType[] = [];
      snap.forEach((managerData) => {
        if (managersData === []) {
          newArray = [managerData.val()];
        } else {
          newArray.push(managerData.val());
        }
        setManagersData(newArray);
      });
    });
  }, []);

  const handleAddTask = (values: any) => {
    const userId = values.to;
    const task = values.task;

    database.ref(`users/${userId}`).on("value", (snap) => {
      const { username } = snap.val();
      console.log(username);
      setUsername(username);
    });

    console.log(username);

    var taskKey = database.ref(`Admin/${authUser?.uid}/tasks`).push().key;
    database.ref(`Admin/${authUser?.uid}/tasks/${taskKey}`).set({
      userId: userId,
      task: task,
      taskKey: taskKey,
      username: username,
    });

    // var TaskKey = database.ref(`To/${userId}/tasks`).push().key;
    database
      .ref(`To/${userId}/tasks/${taskKey}`)
      .set({ task: task, taskKey: taskKey });

    toast.success("Task Added Successful");

    let newAdminTaskArray: AdminTaskType[] = [];
    database.ref(`Admin/${authUser?.uid}/tasks`).on("value", (snap) => {
      console.log(snap.val());

      snap.forEach((childSnap) => {
        if (newAdminTaskArray === []) {
          newAdminTaskArray = [childSnap.val()];
        } else {
          newAdminTaskArray.push(childSnap.val());
        }
      });
      setAdminTasksData(newAdminTaskArray);
    });

    database.ref(`Tasks/${taskKey}`).set({
      userId: user?.uid,
      to: username,
      from: user?.email,
      task: task,
    });
  };

  const getAdminData = () => {
    try {
      if (authUser?.uid) {
        let newAdminTaskArray: AdminTaskType[] = [];
        database.ref(`Admin/${authUser?.uid}/tasks`).on("value", (snap) => {
          console.log(snap.val());

          snap.forEach((childSnap) => {
            if (newAdminTaskArray === []) {
              newAdminTaskArray = [childSnap.val()];
            } else {
              newAdminTaskArray.push(childSnap.val());
            }
          });
          setAdminTasksData(newAdminTaskArray);
        });
      } else {
        alert("Admin uid is not available");
      }
    } catch (error) {
      alert(error);
    }
  };

  console.log(adminTasksData);

  if (!user) {
    return <Redirect to="/"></Redirect>;
  }

  return (
    <div className="admin">
      <h1 style={{ textAlign: "center" }}>Add Tasks </h1>
      <Form
        form={form}
        name="Add_Tasks_Form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        initialValues={{ remember: true }}
        onFinish={handleAddTask}
        // onFinishFailed
      >
        <Item name="to" label="To" rules={[{ required: true }]}>
          <Select placeholder="Whom do you want to assign Task.">
            {managersData?.map((managerData, index) => (
              <Option key={index} value={managerData.userId}>
                {`${managerData.username} (${managerData.email})`}
              </Option>
            ))}
          </Select>
        </Item>
        <Item name="task" label="Task" rules={[{ required: true }]}>
          <Input />
        </Item>
        <Item wrapperCol={{ offset: 8, span: 16 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              Add Task
            </Button>
          </Space>
        </Item>
      </Form>
      <Button
        type="primary"
        style={{
          background: "red",
          textAlign: "center",
          width: "fit-content",
          marginLeft: "auto",
          marginRight: "auto",
          border: "none",
          marginBottom: "15px",
        }}
        onClick={getAdminData}
      >
        Get Task Data
      </Button>
      <AdminTable
        adminTasksData={adminTasksData}
        setAdminTasksData={setAdminTasksData}
      />
    </div>
  );
};

export default Admin;
