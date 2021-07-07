// import { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Admin from "./components/Admin";
import Manager from "./components/Manager";
// import Home from "./components/Home";
import Main from './components/Main'
import Customer from "./components/Customer";
import Edittask from './components/Edittask'
import { auth } from "./fire";
import Headers from "./components/Headers";

function App() {
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route exact path="/">
						<Headers />
						<Main />
					</Route>
					<Route exact path="/signup">
						<Signup />
					</Route>
					<Route exact path="/signin">
						<Signin />
					</Route>
					<Route exact path="/admin">
						<Headers />
						<Admin />
					</Route>
					<Route exact path="/manager">
						<Headers />
						<Manager />
					</Route>
					<Route exact path="/customer">
						<Headers />
						<Customer />
					</Route>
					<Route exact path="/admin/edittask">
						<Headers />
						<Edittask />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
