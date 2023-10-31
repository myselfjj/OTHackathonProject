import React, { useRef, useState, useEffect } from "react";
// import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";

const PatientLogin = ({ handleCallBack }) => {
  const userRef = useRef();
  const errRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  let emailId = "";
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  // const [accessToken, setAccessToken] = useState("");

  let navigate = useNavigate();
  const routeChange = (e) => {
    navigate(e);
  };

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    emailId = user;
    setUser("");
    setPwd("");
    setError("");
    const url = `https://na-1-dev.api.opentext.com/tenants/7e75cc4e-7ed2-435d-a603-e789ecb11d1e/oauth2/token`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: "oN6D7aqZ1K2nnV40u1aK11mPLQyZXo11",
        client_secret: "Gj4X7cGym1adg9IH",
        grant_type: "password",
        username: user,
        password: pwd,
      }),
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        handleCallBack(emailId, data.access_token, true, "Patient's Dashboard");
        if (!data.access_token) {
          setError("Wrong Credentials!!");
          errRef.current.focus();
        } else setSuccess(true);
      })
      .catch((error) => console.error("Error", error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && <div className="spinner"></div>}
      {success ? (
        <section>{routeChange("/patientdashboardpage")}</section>
      ) : (
        <section className="sectionLogin">
          {/* <Navbar /> */}
          <p
            ref={errRef}
            className={error ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {error}
          </p>
          <h1>Sign In as Patient</h1>
          <form onSubmit={handleSubmit} className="formLogin">
            <label htmlFor="email">Username:</label>
            <input
              type="email"
              id="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            <button className="buttonLogin">Sign In</button>
            <br></br>
            <p>
              Sign In as Doctor?{" "}
              <a href="#" onClick={() => routeChange("/doctorlogin")}>
                Click here
              </a>
            </p>
          </form>
        </section>
      )}
    </>
  );
};

export default PatientLogin;
