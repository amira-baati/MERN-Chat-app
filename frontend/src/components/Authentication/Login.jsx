import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider"; // Import du contexte utilisateur

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const { setUser } = ChatState(); // Accès à la méthode pour mettre à jour l'utilisateur dans le contexte

  // Vérification si l'utilisateur est déjà connecté et redirection vers la page d'accueil
  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      history.push("/chats"); // Rediriger vers la page d'accueil si déjà connecté
    }
  }, [history]);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      alert("Please fill all the fields");
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data)); // Stocker les infos de l'utilisateur
      setUser(data); // Mettre à jour l'état global utilisateur dans le contexte
      setLoading(false);
      history.push("/chats"); // Rediriger vers la page d'accueil après la connexion
    } catch (error) {
      alert("Error occurred: " + error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
        .divider:after, .divider:before {
          content: "";
          flex: 1;
          height: 1px;
          background: #eee;
        }
        .h-custom {
          height: calc(100% - 73px);
        }
        @media (max-width: 450px) {
          .h-custom {
            height: 100%;
          }
        }
        .bg-primary {
          background-color: #0d6efd !important;
        }
        .link-danger {
          color: red;
          text-decoration: none;
        }
        .link-danger:hover {
          text-decoration: underline;
        }
        `}
      </style>
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
              <p className="text-center fw-bold mx-3 mb-0">Login</p>
            </div>

            <MDBInput
              wrapperClass="mb-4"
              label="Email address"
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
              type="password"
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-center text-md-start mt-4 pt-2">
              <MDBBtn
                className="mb-0 px-5"
                size="lg"
                onClick={submitHandler}
                disabled={loading}
              >
                {loading ? "Loading..." : "Login"}
              </MDBBtn>
              <p className="small fw-bold mt-2 pt-1 mb-2">
                Don't have an account?{" "}
                <Link to="/Signup" className="link-danger">
                  Register
                </Link>
              </p>
            </div>
          </MDBCol>
        </MDBRow>

        <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
          <div className="text-white mb-3 mb-md-0">
            Copyright © 2025. All rights reserved By Mouheb Baati
          </div>

          <div>
            <MDBBtn
              tag="a"
              color="none"
              className="mx-3"
              style={{ color: "white" }}
            >
              <MDBIcon fab icon="facebook-f" size="md" />
            </MDBBtn>

            <MDBBtn
              tag="a"
              color="none"
              className="mx-3"
              style={{ color: "white" }}
            >
              <MDBIcon fab icon="twitter" size="md" />
            </MDBBtn>

            <MDBBtn
              tag="a"
              color="none"
              className="mx-3"
              style={{ color: "white" }}
            >
              <MDBIcon fab icon="google" size="md" />
            </MDBBtn>

            <MDBBtn
              tag="a"
              color="none"
              className="mx-3"
              style={{ color: "white" }}
            >
              <MDBIcon fab icon="linkedin-in" size="md" />
            </MDBBtn>
          </div>
        </div>
      </MDBContainer>
    </>
  );
}

export default Login;
