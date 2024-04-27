import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function AdminPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <h1>Welcome to the Admin Page</h1>
      <Link to="/admin/questionpaper" className="button-31">
        Question Paper
      </Link>
      <Link to="/admin/createstudent" className="button-31">
        Create Student
      </Link>
      <Link to="/admin/deletestudent" className="button-31">
        Delete Student
      </Link>
      <Link to="/admin/editstudent" className="button-31">
        Edit Student
      </Link>
      <Link to="/admin/addteacher" className="button-31">
        Add Teacher
      </Link>
      <Link to="/admin/editteacher" className="button-31">
        Edit/Delete Teacher
      </Link>
      <Link to="/admin/timetable" className="button-31">
        Time Table
      </Link>
      <Link to="/admin/sendemail" className="button-31">
        Send Email
      </Link>
      <center>
        <button onClick={handleLogout}>Logout</button>
      </center>
    </div>
  );
}

export default AdminPage;
