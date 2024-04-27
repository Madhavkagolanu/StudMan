import React, { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "../Student/CreateStudent/createStudent.css";
function CreateTeacher() {
  const [name, setName] = useState("");
  const [branch, setBranch] = useState(""); // Assuming branch is a string
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const teachersCollectionRef = collection(db, "teachers");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      await addDoc(teachersCollectionRef, {
        Name: name,
        Branch: branch,
        Email: email,
        Password: password,
      });
    } catch (error) {
      console.error("Error creating teacher: ", error);
      alert("An error occurred while creating the teacher.");
    }
  };

  return (
    <div>
      <div className="container">
        <h1>Create Teacher</h1>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <br />
            <input
              type="text"
              id="name"
              value={name}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <br />
            <select
              id="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required>
              <option value="">Select Branch</option>
              <option value="CSE">Computer Science Engineering</option>
              <option value="ECE">
                Electronics and Communication Engineering
              </option>
              {/* Add more options as needed */}
            </select>
            <br />
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <br />
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            <button type="submit" className="button-31">
              Submit
            </button>
          </form>
        ) : (
          <div>
            <h2>Thank You</h2>
            <p>Your response has been submitted.</p>
          </div>
        )}
      </div>
      <div className="btn">
        <Link to="/admin" className="button button-5">
          Back
        </Link>
      </div>
    </div>
  );
}

export default CreateTeacher;
