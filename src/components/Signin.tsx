import React, { useState, useEffect } from "react";
import { auth } from "../fire";
import { Form, Input, Button, Select } from "antd";
import { Link, useHistory, Redirect } from "react-router-dom";
import toast from "react-hot-toast";
import { database } from "../fire";
import { StateType } from '../redux/store'
import { setUser, setUserData } from '../redux/UserReducer'
import { useSelector, useDispatch } from 'react-redux';
import {managerDataType} from './Admin'

const Signin: React.FC = () => {

	const [userDetails, setUserDetails] = useState<managerDataType>();
	const history = useHistory();
	const dispatch = useDispatch();
	// const {user, userData} = useSelector((state: StateType) => state.user)



	useEffect(() => {
		auth.onAuthStateChanged((user) =>{
			if (user) {
				if (user.email !== null && user.uid !== null) {
					dispatch(setUser({
						email: user.email,
						uid: user.uid
					}))					
				}
			} else {
				dispatch(setUser(undefined))
			}	
		});
	}, []);

	const handleSignin = (values: any) => {
		const { email, password } = values;
		if (email && password) {
			auth
				.signInWithEmailAndPassword(email, password)
				.then(({ user }) => {
					database.ref(`users/${user?.uid}`).on('value', (snap) => {
						setUserDetails(snap.val())
					})
				})
				.catch((error) => toast.error(error.message));
			}
			console.log(userDetails);
			if (userDetails?.role === "Admin") {
				history.push('/admin')
			} else if (userDetails?.role === "Manager") {
				history.push('/manager')
			} else if (userDetails?.role === "Customer") {
				history.push('/customer')
			} else {
				alert('Can\'t find data, please try again')
			}
	};



	// if (user) {
	// 	return <Redirect to='/'></Redirect>
	// }

	return (
		<div className="signin">
			<div className="signin_container">
				<h1
					style={{
						textAlign: "center",
						marginBottom: "25px",
						color: "whitesmoke",
					}}
				>
					Sign In
				</h1>
				<Form
					name="basic"
					labelCol={{ span: 4 }}
					// onSubmitCapture={e => e.preventDefault()}
					wrapperCol={{ span: 17 }}
					initialValues={{ remember: true }}
					onFinish={handleSignin}
					onFinishFailed={() => toast.error("Sign In Failed")}
				>
					<Form.Item
						label="Email"
						name="email"
						rules={[{ required: true, message: "Please input your Email!" }]}
						style={{ color: "whitesmoke" }}
					>
						<Input />
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
							Sign In
						</Button>
					</Form.Item>
					<p style={{ textAlign: "center" }}> Don't Have an account?</p>
					<Form.Item wrapperCol={{ offset: 11, span: 16 }}>
						<Button
							type="primary"
							style={{ background: "#173479", borderColor: "white" }}
						>
							<Link to="/signup">Sign Up</Link>
						</Button>
					</Form.Item>
				</Form>
				{/* <p>{ userDetails }</p> */}
			</div>
		</div>
	);
};

export default Signin;
