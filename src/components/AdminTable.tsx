import React, { useEffect, useState } from "react";
import { Table, Button, Space } from "antd";
import { AdminTaskType } from "./Admin";
import { auth, database } from "../fire";
import { useHistory } from 'react-router-dom'
import { setUser } from "../redux/UserReducer";
import { useDispatch } from "react-redux";
import {setEditTask} from '../redux/UserReducer'

type Props = {
	adminTasksData: AdminTaskType[];
	setAdminTasksData: React.Dispatch<React.SetStateAction<AdminTaskType[]>>;
};

const AdminTable: React.FC<Props> = ({ adminTasksData, setAdminTasksData }) => {

	const history = useHistory();
	const dispatch = useDispatch();
	const [authUser, setAuthUser] = useState<any>();
	const [showEdit, setShowEdit] = useState<boolean>(false);

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

	// useEffect(() => {
	// 	auth.onAuthStateChanged((user) => {
	// 		if (user) {
	// 			if (user.email !== null && user.uid !== null) {
	// 				dispatch(
	// 					setUser({
	// 						email: user.email,
	// 						uid: user.uid,
	// 					})
	// 				);
	// 			}
	// 		} else {
	// 			dispatch(setUser(undefined));
	// 		}
	// 	});
	// }, []);

	console.log(adminTasksData);

	// const deleteTask = (userId: string, taskKey: string) => {
	// 	console.log(userId);
	// };

	const handleDelete = (task: string, taskKey: string, userId: string) => {
		try {
			if (authUser.uid) {
				database.ref(`Admin/${authUser.uid}/tasks/${taskKey}`).remove();
				database.ref(`Tasks/${taskKey}`).remove();
				database.ref(`To/${userId}/tasks/${taskKey}`).remove();

				let newAdminTaskArray: AdminTaskType[] = [];
				database.ref(`Admin/${authUser?.uid}/tasks`).on("value", (snap) => {
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
				alert("Can't fetch admin User ID.");
			}
		} catch (error) {
			alert(error);
		}
	};

	const handleEdit = (userId: string, taskKey: string, task: string) => {
		dispatch(setEditTask({
			userId,
			taskKey,
			task
		}))
		history.push('/admin/edittask')
	};

	const data = adminTasksData;

	const columns = [
		{
			title: "userId",
			dataIndex: "userId",
			key: "userId",
			width: 150,
		},
		{
			title: "TaskKey",
			dataIndex: "taskKey",
			key: "taskKey",
		},
		{
			title: "Task",
			dataIndex: "task",
			key: "tasks",
			editable: true,
		},
		{
			title: "Actions",
			dataIndex: "",
			key: "edit",
			render: (
				text: string,
				record: {
					userId: string;
					taskKey: string;
					task: string;
				}
			) => (
				<>
					<Space>
						<Button type="primary" onClick={() => handleEdit(record.userId, record.taskKey, record.task)}>
							Edit
						</Button>
						<Button
							type="primary"
							onClick={() =>
								handleDelete(record.task, record.taskKey, record.userId)
							}
							style={{ background: "red", border: "none" }}
						>
							Delete
						</Button>
					</Space>
				</>
			),
			// render: (_, record: ) => <>
			//     <Space>

			//     <Button type='primary' onClick={handleEdit}>Edit</Button>
			//         <Button type='primary' onClick={ handleDelete} style={{background:'red', border:'none'}}>Delete</Button>
			//     </Space>
			// </>,
		},
	];

	return (
		<div>
			<Table dataSource={data} columns={columns} bordered />
		</div>
	);
};

export default AdminTable;
