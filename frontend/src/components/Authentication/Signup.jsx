import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";

const Signup = () => {
  const [show] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );
  const [picLoading, setPicLoading] = useState(false);

  const navigate = useHistory();

 

  const submitHandler = async () => {
    if (!name || !email || !password || !confirmpassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmpassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const config = { headers: { "Content-Type": "application/json" } };

      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate.push("/chats");
    } catch (error) {
      alert("Error occurred: " + error.response?.data?.message || error.message);
    }
  };

  const postDetails = (file) => {
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "chat-app");
      formData.append("cloud_name", "amiraa");

      setPicLoading(true);
      fetch("https://api.cloudinary.com/v1_1/amiraa/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url);
          setPicLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setPicLoading(false);
        });
    } else {
      alert("Invalid file format. Please upload a JPEG or PNG image.");
    }
  };

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">
      <MDBRow>
        <MDBCol col="10" md="6">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img-fluid"
            alt="Sample"
          />
        </MDBCol>

        <MDBCol col="4" md="6">
          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0"> Signup </p>
          </div>

          <MDBInput
            wrapperClass="mb-4"
            label="Name"
            id="formControlLg"
            type="text"
            size="lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Email"
            id="formControlLg"
            type="email"
            size="lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            id="formControlLg"
            type={show ? "text" : "password"}
            size="lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Confirm Password"
            id="formControlLg"
            type={show ? "text" : "password"}
            size="lg"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Picture
            </label>
            <input
              type="file"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              onChange={(e) => postDetails(e.target.files[0])}
            />
          </div>
          <div className="d-flex justify-content-between mb-4">
            <button
              type="button"
              className="mt-4 btn btn-primary btn-lg"
              onClick={submitHandler}
              disabled={picLoading}
            >
              {picLoading ? "Uploading..." : "Sign Up"}
            </button>
         
          </div>
         <p className="small fw-bold mt-2 pt-1 mb-2">
  You have an account?{" "}
  <Link to="/login" className="link-danger">
    Login
  </Link>
</p>

                        
        </MDBCol>
         <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
          <div className="text-white mb-3 mb-md-0">
            Copyright © 2025. All rights reserved By Mouheb Baati
          </div>

          <div>
            <MDBBtn tag="a" color="none" className="mx-3" style={{ color: "white" }}>
              <MDBIcon fab icon="facebook-f" size="md" />
            </MDBBtn>

            <MDBBtn tag="a" color="none" className="mx-3" style={{ color: "white" }}>
              <MDBIcon fab icon="twitter" size="md" />
            </MDBBtn>

            <MDBBtn tag="a" color="none" className="mx-3" style={{ color: "white" }}>
              <MDBIcon fab icon="google" size="md" />
            </MDBBtn>

            <MDBBtn tag="a" color="none" className="mx-3" style={{ color: "white" }}>
              <MDBIcon fab icon="linkedin-in" size="md" />
            </MDBBtn>
          </div>
        </div>
      </MDBRow>
    </MDBContainer>
  );
};

export default Signup;
