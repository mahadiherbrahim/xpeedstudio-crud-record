import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import { useState } from 'react';
import {
  BrowserRouter as Router, Route, Switch
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GetForm from './Components/GetForm/GetForm';
import NotFound from './Components/NotFound/NotFound';
import Home from "./Components/Home/Home";
import "./style.css";
import UpdateForm from './Components/UpdateForm/UpdateForm';


function App() {
  const [list, setList] = useState([]);
  return (
    <Router>
      <Switch>
        <Route exact path="/" >
          <Home setList={setList} />
        </Route>
        <Route exact path="/get-form">
          <GetForm />
        </Route>
        <Route exact path="/update-form/:id" >
          <UpdateForm list={list} />
        </Route>
        <Route exact path="*">
          <NotFound></NotFound>
        </Route>
      </Switch>
      <ToastContainer />
    </Router>
  );
}

export default App;
