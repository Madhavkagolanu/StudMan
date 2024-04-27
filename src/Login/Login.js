import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
function Login() {
  const [userData, setUserData] = useState([]);
  const [uD, suD] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false); // State to track login error
  const navigate = useNavigate();
  const [tuD, stuD] = useState([]);
  useEffect(() => {
    fetch(
      "https://script.googleusercontent.com/macros/echo?user_content_key=KLS4S4-joRcLQLH_dsyPApf10wgE3mHQXNCqzoEJpj6Gy0m_e_7vK4YVlfH1BldNBiBGAGJYc-d8t7aLdK3Op8HFs8JqkOLbm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnAIUoqwrwLcy2r4m0VQOUwBrRh3xu6egBdceKOeWklIWINYgJyjR0osPQc9uRfi2IGAloUMy4FKfgY2nuVuvhA0YAvBFwpRKdNz9Jw9Md8uu&lib=Mrrx1QAIH-eluaL-4Ukq8ILlub2HXDe7k"
    )
      .then((response) => response.json())
      .then((data) => {
        setUserData(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleLogin = async () => {
    const user = userData.find(
      (user) => user.Email === email && user.Password === password
    );
    console.log(user);
    if (user) {
      localStorage.setItem("authToken", "admin");
      navigate("/admin");
      console.log("Login successful!");
    } else {
      try {
        const studentsCollectionRef = collection(db, "students");
        const teachersCollectionRef = collection(db, "teachers");

        const studentsSnapshot = await getDocs(studentsCollectionRef);
        const teachersSnapshot = await getDocs(teachersCollectionRef);

        const studentsData = studentsSnapshot.docs.map((doc) => doc.data());
        const teachersData = teachersSnapshot.docs.map((doc) => doc.data());

        suD(studentsData);
        stuD(teachersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      handleLogin2();
    }
  };
  const handleLogin2 = () => {
    console.log(uD);
    console.log(tuD);

    const studentUser = uD.find(
      (user) => user.Email === email && user.Password === password
    );
    const teacherUser = tuD.find(
      (user) => user.Email === email && user.Password === password
    );

    if (studentUser) {
      localStorage.setItem("authToken", "student");
      localStorage.setItem("userEmail", email);
      navigate("/student");
    } else if (teacherUser) {
      localStorage.setItem("authToken", "teacher");
      localStorage.setItem("userEmail", email);
      navigate("/teacher");
    } else {
      setLoginError(true);
    }
  };
  return (
    <div className="loginDiv">
      <center>
        <div className="container">
          <div className="form" id="login">
            <h1 className="form__title">Shreyas</h1>
            <div className="form__input-group">
              <input
                type="text"
                className="form__input"
                autoFocus
                placeholder="Username"
                id="usernameinput"
                value={email} // Link value to email state
                onChange={(e) => setEmail(e.target.value)} // Update email state onChange
              />
            </div>
            <div className="form__input-group">
              <input
                type="password"
                className="form__input"
                autoFocus
                placeholder="Password"
                id="passwordInput"
                value={password} // Link value to password state
                onChange={(e) => setPassword(e.target.value)} // Update password state onChange
              />
              <div className="padding"></div>
              <button
                className="form__button"
                id="loginButton"
                onClick={handleLogin}>
                Login
              </button>
            </div>
            {loginError && (
              <div className="error">Please wait or Try Again</div>
            )}
          </div>
        </div>
      </center>
    </div>
  );
}

export default Login;
