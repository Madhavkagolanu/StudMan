/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import "./deleteStudent.css"; // Import your CSS file
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function DeleteStudent() {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken || authToken !== "admin") {
      navigate("/");
    }
  }, [navigate]);
  const [students, setStudents] = useState([]);

  // Function to fetch students data from Firestore
  const fetchStudents = async () => {
    const studentsCollectionRef = collection(db, "students");
    const snapshot = await getDocs(studentsCollectionRef);
    const studentData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStudents(studentData);
  };

  // useEffect to fetch students data when the component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  // Function to handle deleting a student
  const handleDeleteStudent = async (id) => {
    const studentDocRef = doc(db, "students", id);
    await deleteDoc(studentDocRef);
    fetchStudents(); // Fetch updated students data after deletion
  };

  return (
    <div>
      <div className="delete-student-container">
        <h1>Delete Student</h1>
        {students.map((student) => (
          <div key={student.id} className="student-card">
            <p>Name: {student.Name}</p>
            <p>Email: {student.Email}</p>
            <button onClick={() => handleDeleteStudent(student.id)}>
              Delete
            </button>
            <hr />
          </div>
        ))}
      </div>
      <Link to="/admin" className="button-5">
        Back
      </Link>
    </div>
  );
}

export default DeleteStudent;
