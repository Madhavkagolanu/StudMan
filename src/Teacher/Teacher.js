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
import "./Teacher.css";

function EditStudent() {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken || authToken !== "teacher") {
      navigate("/");
    }
  }, [navigate]);

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedFatherEmail, setUpdatedFatherEmail] = useState("");
  const [updatedGrades, setUpdatedGrades] = useState({
    sem1: { GPA: "", Attendance: "" },
    sem2: { GPA: "", Attendance: "" },
    sem3: { GPA: "", Attendance: "" },
    sem4: { GPA: "", Attendance: "" },
    sem5: { GPA: "", Attendance: "" },
    sem6: { GPA: "", Attendance: "" },
    sem7: { GPA: "", Attendance: "" },
    sem8: { GPA: "", Attendance: "" },
  });

  // Function to fetch students data from Firestore
  const fetchStudents = async () => {
    const studentsCollectionRef = collection(db, "students");
    const snapshot = await getDocs(studentsCollectionRef);
    const studentData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // Sort students by name
    const sortedStudents = studentData.sort((a, b) =>
      a.Name.localeCompare(b.Name)
    );
    setStudents(sortedStudents);
  };

  // useEffect to fetch students data when the component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  // Function to handle editing a student
  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setUpdatedName(student.Name);
    setUpdatedEmail(student.Email);
    setUpdatedFatherEmail(student.FatherEmail);
    setUpdatedGrades(student.Grades);
    setEditMode(true);
  };

  // Function to update student data
  const handleUpdateStudent = async () => {
    const studentDocRef = doc(db, "students", selectedStudent.id);
    await updateDoc(studentDocRef, {
      Name: updatedName,
      Email: updatedEmail,
      FatherEmail: updatedFatherEmail,
      Grades: updatedGrades,
    });
    fetchStudents(); // Fetch updated students data after update
    setEditMode(false);
    setSelectedStudent(null);
    setUpdatedName("");
    setUpdatedEmail("");
    setUpdatedFatherEmail("");
    setUpdatedGrades({
      sem1: { GPA: "", Attendance: "" },
      sem2: { GPA: "", Attendance: "" },
      sem3: { GPA: "", Attendance: "" },
      sem4: { GPA: "", Attendance: "" },
      sem5: { GPA: "", Attendance: "" },
      sem6: { GPA: "", Attendance: "" },
      sem7: { GPA: "", Attendance: "" },
      sem8: { GPA: "", Attendance: "" },
    });
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Function to delete a student
  const handleDeleteStudent = async (id) => {
    const studentDocRef = doc(db, "students", id);
    await deleteDoc(studentDocRef);
    fetchStudents(); // Fetch updated students data after deletion
  };

  return (
    <div>
      <h2>Welcome {localStorage.getItem("userEmail")}</h2>
      <button type="submit" className="button-5" onClick={handleLogout}>
        LOGOUT
      </button>
      <div className="edit-student-container">
        <div className="">
          <h1>Edit Student</h1>
          {students.map((student) => (
            <div key={student.id} className="student-card">
              <p>Name: {student.Name}</p>
              <p>Email: {student.Email}</p>
              <p>Father's Email: {student.FatherEmail}</p>
              {/* Display grades and attendance */}
              <div>
                {Object.keys(student.Grades).map((sem) => (
                  <p key={sem}>
                    Semester {sem} GPA: {student.Grades[sem].GPA} Attendance:{" "}
                    {student.Grades[sem].Attendance}
                  </p>
                ))}
              </div>
              <button onClick={() => handleEditStudent(student)}>Edit</button>
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
            <input
              type="email"
              value={updatedFatherEmail}
              onChange={(e) => setUpdatedFatherEmail(e.target.value)}
              placeholder="Father's Email"
            />
            {/* Input fields for grades and attendance */}
            <h3>Grades and Attendance for Each Semester</h3>
            <div>
              {Object.keys(updatedGrades)
                .sort((a, b) => Number(a.slice(3)) - Number(b.slice(3)))
                .map((sem) => (
                  <div key={sem}>
                    <h4>Semester {sem}</h4>
                    <input
                      type="text"
                      value={updatedGrades[sem].GPA}
                      onChange={(e) =>
                        setUpdatedGrades((prevGrades) => ({
                          ...prevGrades,
                          [sem]: { ...prevGrades[sem], GPA: e.target.value },
                        }))
                      }
                      placeholder={`Semester ${sem} GPA`}
                    />
                    <input
                      type="text"
                      value={updatedGrades[sem].Attendance}
                      onChange={(e) =>
                        setUpdatedGrades((prevGrades) => ({
                          ...prevGrades,
                          [sem]: {
                            ...prevGrades[sem],
                            Attendance: e.target.value,
                          },
                        }))
                      }
                      placeholder={`Semester ${sem} Attendance`}
                    />
                  </div>
                ))}
            </div>
            <button onClick={handleUpdateStudent}>Update</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditStudent;
