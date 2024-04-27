import Login from "./Login/Login";
import Admin from "./Admin/Admin";
import QuestionPaper from "./QuestionPaper/QuestionPaper";
import CreateStudent from "./Student/CreateStudent/createStudent";
import DeleteStudent from "./Student/DeleteStudent/deleteStudent";
import EditStudent from "./Student/editStudent/editStudent";
import AddTeacher from "./Teacher/addTeacher";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditTeacher from "./Teacher/editTeacher";
import Home from "./Home";
import Teacher from "./Teacher/Teacher";
import Student from "./Student/Student";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/questionpaper" element={<QuestionPaper />} />
        <Route path="/admin/createstudent" element={<CreateStudent />} />
        <Route path="/admin/deletestudent" element={<DeleteStudent />} />
        <Route path="/admin/editstudent" element={<EditStudent />} />
        <Route path="/admin/addteacher" element={<AddTeacher />} />
        <Route path="/admin/editteacher" element={<EditTeacher />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/student" element={<Student />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
