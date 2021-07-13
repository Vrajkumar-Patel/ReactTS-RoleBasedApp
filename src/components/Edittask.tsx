import React, { useState, useEffect } from "react";
import { Form, Input, Button, Mentions } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../redux/store";
import { Redirect, useHistory } from "react-router-dom";
import { auth, database } from "../fire";
import { setUser } from "../redux/UserReducer";

const { Item } = Form;

const Edittask: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const taskDetails = useSelector((state: StateType) => state.user.editTask);
  const { user, userData } = useSelector((state: StateType) => state.user);

  const [authUser, setAuthUser] = useState<any>();
  const [taskDetail, setTaskDetail] = useState<any>();

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

  const handleEditTask = (values: any) => {
    const { userid, taskkey, task } = values;

    if (authUser) {
      database
        .ref(`Admin/${authUser.uid}/tasks/${taskkey}`)
        .on("value", (snap) => {
          setTaskDetail(snap.val());
        });
    }
    console.log(taskDetail);

    if (authUser) {
      database.ref(`Admin/${authUser.uid}/tasks/${taskkey}`).set({
        userId: userid,
        username: taskDetail.username,
        taskKey: taskkey,
        task: task,
      });
    }

    history.push("/admin");
  };

  if (!taskDetails) {
    return <Redirect to="/admin" />;
  }

  if (!user) {
    return <Redirect to="/"></Redirect>;
 }

  return (
    <div className="edittask">
      <div className="edittask_container">
        <h1 style={{ textAlign: "center" }}>Edit Task</h1>
        <Form
          name="edit_task_form"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 17 }}
          initialValues={{ remember: true }}
          onFinish={handleEditTask}
        >
          <Item label="User ID" name="userid" initialValue={taskDetails.userId}>
            <Mentions
              value={taskDetails.userId}
              style={{ width: "100%" }}
              placeholder={taskDetails.userId}
              readOnly
            ></Mentions>
          </Item>
          <Item
            label="Task Key"
            name="taskkey"
            initialValue={taskDetails.taskKey}
          >
            <Mentions
              value={taskDetails.taskKey}
              style={{ width: "100%" }}
              placeholder={taskDetails.taskKey}
              readOnly
            ></Mentions>
          </Item>
          <Item label="Task" name="task">
            <Input value={taskDetails?.task} placeholder={taskDetails?.task} />
          </Item>
          <Item wrapperCol={{ offset: 11, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ borderColor: "white" }}
            >
              Edit Task
            </Button>
          </Item>
        </Form>
      </div>
    </div>
  );
};

export default Edittask;
