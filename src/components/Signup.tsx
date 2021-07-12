import React, { useEffect } from "react";
import { auth } from "../fire";
import { Form, Input, Button, Select } from "antd";
import { Link, useHistory, Redirect } from "react-router-dom";
import toast from "react-hot-toast";
import { database } from "../fire";
import { StateType } from "../redux/store";
import { setUser, setUserData } from "../redux/UserReducer";
import { useSelector, useDispatch } from "react-redux";

const { Option } = Select;

const Signup: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useSelector((state: StateType) => state.user);

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
      } else {
        dispatch(setUser(undefined));
      }
    });
  }, []);

  const handleSignUp = (values: any) => {
    const { email, password, name, role, age } = values;

    if (email && password) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(({ user }) => {
          database.ref(`users/${user?.uid}`).set({
            username: name,
            email,
            role,
            age,
            userId: user?.uid,
          });
          database.ref(`${role}/${user?.uid}`).set({
            username: name,
            email,
            role,
            age,
            userId: user?.uid,
          });
          if (user) {
            dispatch(
              setUserData({
                username: name,
                email: email,
                role: role,
                age: age,
                userId: user?.uid,
              })
            );
          }
          if (role === "Admin") {
            return history.push("/admin");
          } else if (role === "Manager") {
            return history.push("/manager");
          } else {
            return history.push("/customer");
          }
          toast.success("Sign up Successful");
        })
        .catch((error) => {
          console.error(error.message);
          toast.error(error.message);
        });
    }
  };

  if (user) {
    return <Redirect to="/"></Redirect>;
  }

  return (
    <div className="signup">
      <div className="signup_container">
        <h1
          style={{
            textAlign: "center",
            marginBottom: "25px",
            color: "whitesmoke",
          }}
        >
          Sign Up
        </h1>
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          // onSubmitCapture={e => e.preventDefault()}
          wrapperCol={{ span: 17 }}
          initialValues={{ remember: true }}
          onFinish={handleSignUp}
          onFinishFailed={() => toast.error("Sign Up Failed")}
        >
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true }]}
            style={{ color: "whitesmoke" }}
          >
            <Select
              placeholder="Select a option and change input text above"
              //   onChange={onGenderChange}
              allowClear
            >
              <Option value="Admin">Admin</Option>
              <Option value="Manager">Manager</Option>
              <Option value="Customer">Customer</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your Name!" }]}
            style={{ color: "whitesmoke" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
            style={{ color: "whitesmoke" }}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: "Please input your Age!" }]}
            style={{ color: "whitesmoke" }}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
            style={{ color: "whitesmoke" }}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 11, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ borderColor: "white" }}
            >
              Sign Up
            </Button>
          </Form.Item>
          <p style={{ textAlign: "center" }}> Already Have an account?</p>
          <Form.Item wrapperCol={{ offset: 11, span: 16 }}>
            <Button
              type="primary"
              style={{ background: "#173479", borderColor: "white" }}
            >
              <Link to="/signin">Sign In</Link>
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
