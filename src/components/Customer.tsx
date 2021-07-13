import React, { useState, useEffect } from "react";
import { Card, Button } from "antd";
import { auth, database } from "../fire";
import { managerDataType } from "./Admin";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../redux/store";
import { Redirect } from "react-router-dom";

const Customer: React.FC = () => {
  const [customerDetails, setCustomerDetails] = useState<managerDataType>();
  const { user, userData } = useSelector((state: StateType) => state.user);
  const [show, setShow] = useState<boolean>(false);
  const dispatch = useDispatch();

  const showCustomerData = () => {
    database.ref(`Customer/${user?.uid}`).on("value", (snap) => {
      let customerData = snap.val();
      console.log(customerData);
      setCustomerDetails(customerData);
    });
    setShow(true);
  };

  console.log(user);
  // console.log(customerDetails) ;

  if (!user) {
    return <Redirect to="/"></Redirect>;
  }

  return (
    <div className="manager" style={{ background: "whitesmoke" }}>
      <Button type="primary" onClick={showCustomerData}>
        Get Data
      </Button>
      {show && customerDetails ? (
        <Card
          title={customerDetails?.username}
          bordered
          style={{ width: 500, textAlign: "center" }}
        >
          <p>
            {" "}
            <b>UserId:</b> {customerDetails!.userId}
          </p>
          <p>
            {" "}
            <b>Email:</b> {customerDetails!.email}
          </p>
          <p>
            {" "}
            <b>Age:</b> {customerDetails!.age}
          </p>
        </Card>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Customer;
