import React, { useState, useEffect } from "react";
import { Card, Button } from "antd";
import { auth, database } from "../fire";
import { managerDataType } from "./Admin";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../redux/store";
import { Redirect } from "react-router-dom";

const Manager: React.FC = () => {
  const [managerDetails, setManagerDetails] = useState<managerDataType>();
  const { user, userData } = useSelector((state: StateType) => state.user);
  const [show, setShow] = useState<boolean>(false);
  const dispatch = useDispatch();

  const showManagerData = () => {
    setShow(true);
    database.ref(`Manager/${user?.uid}`).on("value", (snap) => {
      let managerData = snap.val();
      setManagerDetails(managerData);
    });
  };

  return (
    <div className="manager" style={{ background: "whitesmoke" }}>
      <Button type="primary" onClick={showManagerData}>
        Get Data
      </Button>
      {show && managerDetails  ? (
        <Card
          title={managerDetails?.username}
          bordered
          style={{ width: 500, textAlign: "center" }}
        >
          <p>
            {" "}
            <b>Role:</b> {managerDetails!.role}
          </p>
          <p>
            {" "}
            <b>UserId:</b> {managerDetails!.userId}
          </p>
          <p>
            {" "}
            <b>Email:</b> {managerDetails!.email}
          </p>
          <p>
            {" "}
            <b>Age:</b> {managerDetails!.age}
          </p>
        </Card>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Manager;
