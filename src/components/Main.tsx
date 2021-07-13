import React, { useState } from "react";
import { Button, Table } from "antd";
import { database } from "../fire";
import toast from "react-hot-toast";

type Data = {
  from: string;
  task: string;
  to: string;
  userId: string;
};

const Main: React.FC = () => {
  const [tasksArray, setTasksArray] = useState<Data[]>([]);

  const getData = () => {
    database.ref(`Tasks`).on("value", (snap) => {
      if (snap.val()) {
        const newArray: Data[] = Object.values(snap.val());
        setTasksArray(newArray);
      }
      else {
        toast.error("There are no Tasks created by Admin...")
      }
    });
  };

  const data = tasksArray;

  const columns = [
    {
      title: "From",
      dataIndex: "from",
      key: "from",
    },
    {
      title: "Task",
      dataIndex: "task",
      key: "task",
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={getData}>
        Get Data
      </Button>

      <Table dataSource={data} columns={columns} />
    </div>
  );
};

export default Main;
