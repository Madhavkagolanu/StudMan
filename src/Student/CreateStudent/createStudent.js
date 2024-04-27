import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import "./createStudent.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function CreateStudent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fatherEmail, setFatherEmail] = useState("");
  const [grades, setGrades] = useState({
    sem1: { GPA: "", Attendance: "" },
    sem2: { GPA: "", Attendance: "" },
    sem3: { GPA: "", Attendance: "" },
    sem4: { GPA: "", Attendance: "" },
    sem5: { GPA: "", Attendance: "" },
    sem6: { GPA: "", Attendance: "" },
    sem7: { GPA: "", Attendance: "" },
    sem8: { GPA: "", Attendance: "" },
  });
  const [submitted, setSubmitted] = useState(false);

  const studentsCollectionRef = collection(db, "students");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      await addDoc(studentsCollectionRef, {
        Name: name,
        Email: email,
        Password: password,
        FatherEmail: fatherEmail,
        Grades: grades,
      });
    } catch (error) {
      console.error("Error creating student: ", error);
      alert("An error occurred while creating the student.");
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken || authToken !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  const handleGradeChange = (sem, key, value) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [sem]: {
        ...prevGrades[sem],
        [key]: value,
      },
    }));
  };

  return (
    <div>
      <div className="container scroll-container">
        <h1>Create Student</h1>
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
            <input
              type="email"
              id="fatherEmail"
              value={fatherEmail}
              placeholder="Father's Email"
              onChange={(e) => setFatherEmail(e.target.value)}
              required
            />
            <h3>Grades and Attendance for Each Semester</h3>
            <div>
              {Object.keys(grades).map((sem) => (
                <div key={sem}>
                  <input
                    type="text"
                    id={`${sem}GPA`}
                    value={grades[sem].GPA}
                    placeholder={`Semester ${sem} GPA`}
                    onChange={(e) =>
                      handleGradeChange(sem, "GPA", e.target.value)
                    }
                    required
                  />
                  <input
                    type="text"
                    id={`${sem}Attendance`}
                    value={grades[sem].Attendance}
                    placeholder={`Semester ${sem} Attendance`}
                    onChange={(e) =>
                      handleGradeChange(sem, "Attendance", e.target.value)
                    }
                    required
                  />
                </div>
              ))}
            </div>
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

export default CreateStudent;
