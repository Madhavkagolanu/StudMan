import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";

function QuestionPaper() {
  const [chapter, setChapter] = useState("");
  const [marks, setMarks] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [questions, setQuestions] = useState([]);
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const componentRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken || authToken !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  useEffect(() => {
    if (chapter && marks && numQuestions) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://script.googleusercontent.com/macros/echo?user_content_key=rhMOJpRZirMqmedSLXqIs6AcydEKKklG30Zt_-UH-ySe3_SBH-HPb3aCeT094fypee_se5ZHkFWIFssxGdisFr9rR4b_ZuwKm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnP-S6xpEWm7cRAnLYedVXBoP3PrJV1x1huo12tYSDvpeRnfXAG0Y_R2n1xZBS3hJNrkKBQHZci_63_PWo0BSvD0FS8R6tpNwvtz9Jw9Md8uu&lib=Mc7CNuNHBTH1ozlkRm43YVblub2HXDe7k`
          );
          const data = await response.json();

          // Filter questions based on user input
          const filteredQuestions = data.data.filter(
            (question) =>
              question.Marks === parseInt(marks, 10) &&
              question.Chapter === parseInt(chapter, 10)
          );

          // Shuffle the filtered questions
          const shuffledQuestions = shuffleArray(filteredQuestions);

          // Select random questions from the shuffled array
          const selectedQuestions = shuffledQuestions.slice(
            0,
            parseInt(numQuestions, 10)
          );

          // Sort questions based on ascending order of marks
          const sortedQuestions = selectedQuestions.sort(
            (a, b) => a.Marks - b.Marks
          );

          setQuestions(sortedQuestions);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [chapter, marks, numQuestions]);

  // Helper function to shuffle an array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleSubmission = () => {
    // Check for duplicate questions by ID before adding to submittedQuestions
    const uniqueQuestions = questions.filter(
      (q1) => !submittedQuestions.some((q2) => q2.Id === q1.Id)
    );

    setSubmittedQuestions([...submittedQuestions, ...uniqueQuestions]);
    setQuestions([]);
    setChapter("");
    setMarks("");
    setNumQuestions("");
  };

  return (
    <div>
      <label>
        Chapter Number:
        <input
          type="number"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
        />
      </label>
      <br />
      <label>
        Marks for Questions:
        <input
          type="number"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
        />
      </label>
      <br />
      <label>
        Number of Questions:
        <input
          type="number"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleSubmission}>Submit</button>
      <ReactToPrint
        trigger={() => <button>Print PDF</button>}
        content={() => componentRef.current}
      />
      <br />
      <div ref={componentRef}>
        {submittedQuestions.length === 0 ? (
          <p>No submitted questions yet.</p>
        ) : (
          submittedQuestions.map((question, index) => (
            <div key={index}>
              <p>
                {question.Question} (Marks: {question.Marks})
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default QuestionPaper;
