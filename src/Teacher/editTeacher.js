import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function EditTeacher() {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken || authToken !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedBranch, setUpdatedBranch] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");

  // Function to fetch teachers data from Firestore
  const fetchTeachers = async () => {
    const teachersCollectionRef = collection(db, "teachers");
    const snapshot = await getDocs(teachersCollectionRef);
    const teacherData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTeachers(teacherData);
  };

  // useEffect to fetch teachers data when the component mounts
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Function to handle editing a teacher
  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setUpdatedName(teacher.Name);
    setUpdatedBranch(teacher.Branch);
    setUpdatedEmail(teacher.Email);
    setEditMode(true);
  };

  // Function to update teacher data
  const handleUpdateTeacher = async () => {
    const teacherDocRef = doc(db, "teachers", selectedTeacher.id);
    await updateDoc(teacherDocRef, {
      Name: updatedName,
      Branch: updatedBranch,
      Email: updatedEmail,
    });
    fetchTeachers(); // Fetch updated teachers data after update
    setEditMode(false);
    setSelectedTeacher(null);
    setUpdatedName("");
    setUpdatedBranch("");
    setUpdatedEmail("");
  };

  // Function to delete a teacher
  const handleDeleteTeacher = async (id) => {
    const teacherDocRef = doc(db, "teachers", id);
    await deleteDoc(teacherDocRef);
    fetchTeachers(); // Fetch updated teachers data after deletion
  };

  return (
    <div>
      <div className="edit-teacher-container">
        <h1>Edit Teacher</h1>
        {teachers.map((teacher) => (
          <div key={teacher.id} className="teacher-card">
            <p>Name: {teacher.Name}</p>
            <p>Email: {teacher.Email}</p>
            <p>Branch: {teacher.Branch}</p>
            <button onClick={() => handleEditTeacher(teacher)}>Edit</button>
            <button onClick={() => handleDeleteTeacher(teacher.id)}>
              Delete
            </button>
            <hr />
          </div>
        ))}
      </div>
      <Link to="/admin" className="button-5">
        Back
      </Link>

      {editMode && selectedTeacher && (
        <div className="edit-form">
          <h2>Edit Teacher</h2>
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            placeholder="Name"
          />
          <input
            type="text"
            value={updatedBranch}
            onChange={(e) => setUpdatedBranch(e.target.value)}
            placeholder="Branch"
          />
          <input
            type="email"
            value={updatedEmail}
            onChange={(e) => setUpdatedEmail(e.target.value)}
            placeholder="Email"
          />
          <button onClick={handleUpdateTeacher}>Update</button>
        </div>
      )}
    </div>
  );
}

export default EditTeacher;
