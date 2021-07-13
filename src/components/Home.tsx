import React, { useState } from "react";
import { Button, Table } from "antd";
import { database } from "../fire";
import { managerDataType } from "./Admin";

const Home: React.FC = () => {
  const [adminData, setAdminData] = useState({});
  const [show, setShow] = useState<boolean>(false);
  const [totalTasks, setTotalTasks] = useState();

  const tasksArray = Object.keys(adminData);

  const getData = () => {
    setShow(true);

    database.ref("Tasks").on("value", (snap) => {
    });
  };

  return (
    <div>
      <Button type="primary" onClick={getData}>
        Get Data
      </Button>
      {show ? <Table /> : <></>}
    </div>
  );
};

export default Home;
