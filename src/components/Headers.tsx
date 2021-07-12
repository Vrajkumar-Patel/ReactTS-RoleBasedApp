import React, { useEffect } from "react";
import { Layout, Menu, Button, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/UserReducer";
import { StateType } from "../redux/store";
import { auth } from "../fire";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const { Header } = Layout;
const { Item } = Menu;

const styles = {
  backgroundHover: {
    backgroundColor: "rgb(23, 52, 121, 0.5)",
  },
};

const Headers: React.FC = () => {
  const dispatch = useDispatch();
  const { user, userData } = useSelector((state: StateType) => state.user);

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

  console.log(userData);

  const handleSignOut = () => {
    auth.signOut();
    toast.success("Sign Out Successful");
  };

  return (
    <div>
      <Layout>
        <Header className="header">
          <Menu theme="dark" mode="horizontal" className="header_menu">
            {!user ? (
              <>
                <Space>
                  <Item key="1" style={styles.backgroundHover}>
                    <Link to="/signup">
                      <Button
                        type="primary"
                        style={{
                          background: "orange",
                          border: "none",
                        }}
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </Item>
                  <Item key="2" style={styles.backgroundHover}>
                    <Link to="/signin">
                      <Button
                        type="primary"
                        style={{
                          background: "orange",
                          border: "none",
                        }}
                      >
                        Sign In
                      </Button>
                    </Link>
                  </Item>
                </Space>
              </>
            ) : (
              <>
                <Space>
                  <Item key="3" style={user ? styles.backgroundHover : {}}>
                    {user?.email}
                  </Item>
                  <Item key="4" style={styles.backgroundHover}>
                    <Button
                      type="primary"
                      onClick={handleSignOut}
                      style={{
                        background: "orange",
                        border: "none",
                      }}
                    >
                      Sign Out
                    </Button>
                  </Item>
                </Space>
              </>
            )}
          </Menu>
        </Header>
      </Layout>
    </div>
  );
};

export default Headers;
