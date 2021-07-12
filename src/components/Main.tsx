import React, { useState } from "react";
import { Button, Table } from "antd";
import { database } from "../fire";

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
      const newArray: Data[] = Object.values(snap.val());
      // console.log(newArray);
      setTasksArray(newArray);
    });
  };

  console.log(tasksArray);

  const data = tasksArray;

  const columns = [
    {
      title: "From",
      dataIndex: "from",
      key: "from",
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
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
