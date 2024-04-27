import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import "../DeleteStudent/deleteStudent.css"; // Import your CSS file
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function EditStudent() {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken || authToken !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");

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

  // Function to handle editing a student
  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setUpdatedName(student.Name);
    setUpdatedEmail(student.Email);
    setEditMode(true);
  };

  // Function to update student data
  const handleUpdateStudent = async () => {
    const studentDocRef = doc(db, "students", selectedStudent.id);
    await updateDoc(studentDocRef, {
      Name: updatedName,
      Email: updatedEmail,
    });
    fetchStudents(); // Fetch updated students data after update
    setEditMode(false);
    setSelectedStudent(null);
    setUpdatedName("");
    setUpdatedEmail("");
  };

  return (
    <div>
      <div className="delete-student-container">
        <h1>Edit Student</h1>
        {students.map((student) => (
          <div key={student.id} className="student-card">
            <p>Name: {student.Name}</p>
            <p>Email: {student.Email}</p>
            <button onClick={() => handleDeleteStudent(student.id)}>
              Delete
            </button>
            <button onClick={() => handleEditStudent(student)}>Edit</button>
            <hr />
          </div>
        ))}
      </div>
      <Link to="/admin" className="button-5">
        Back
      </Link>

      {editMode && selectedStudent && (
        <div className="edit-form">
          <h2>Edit Student</h2>
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            placeholder="Name"
          />
          <input
            type="email"
            value={updatedEmail}
            onChange={(e) => setUpdatedEmail(e.target.value)}
            placeholder="Email"
          />
          <button onClick={handleUpdateStudent}>Update</button>
        </div>
      )}
    </div>
  );
}

export default EditStudent;
