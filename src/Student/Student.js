import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

function Student() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    // Fetch student data based on email ID from local storage
    const userEmail = localStorage.getItem("userEmail");

    const fetchData = async () => {
      const studentsCollectionRef = collection(db, "students");
      const q = query(studentsCollectionRef, where("Email", "==", userEmail));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (data.length > 0) {
        // Assuming each student has an array of semester-wise marks and FatherEmail
        // Sort the semester-wise marks for the first student found
        const sortedMarks = Object.entries(data[0].Grades).sort(
          (a, b) => parseInt(a[0].slice(3)) - parseInt(b[0].slice(3))
        );
        setStudentData({
          marks: sortedMarks,
          fatherEmail: data[0].FatherEmail,
        });
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <h1>Semester-wise Marks</h1>
      <h3>Welcome {localStorage.getItem("userEmail")}</h3>
      <p>Father's Email: {studentData.fatherEmail}</p>
      <button className="button-5" onClick={handleLogout}>
        Logout
      </button>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {studentData.marks &&
          studentData.marks.map(([semester, marks]) => (
            <div key={semester}>
              <h2>{`Semester ${semester}`}</h2>
              <p>GPA: {marks.GPA}</p>
              <p>Attendance: {marks.Attendance}</p>
            </div>
          ))}
      </div>
      <Link to="" className="button-5">
        Visualize
      </Link>
    </div>
  );
}

export default Student;
