import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import './App.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Pour les icônes
import ChatPage from "./Pages/ChatPage";
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
     <Route path="/chats" component={ChatPage}/>
      <Route path="/" component={Login} exact/>
    <Route path="/login" component={Login} />
     <Route path="/Signup" component={Signup}/>
    </div>
  );
}

export default App;
