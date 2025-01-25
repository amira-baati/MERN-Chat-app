import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import './custom.css';
import ChatProvider from "./Context/ChatProvider";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
     <BrowserRouter>
      <ChatProvider>
        <App />     
        
         <ToastContainer />

      </ChatProvider>
    </BrowserRouter>
);
