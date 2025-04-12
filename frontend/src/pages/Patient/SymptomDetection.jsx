import React, { useState } from "react";
import axios from "axios";

const SymptomDetection = () => {
  const [symptomInput, setSymptomInput] = useState(""); // For current symptom input
  const [symptomsList, setSymptomsList] = useState([]); // List of symptoms
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle adding a symptom to the list
  const handleAddSymptom = () => {
    if (symptomInput.trim()) {
      setSymptomsList([...symptomsList, symptomInput]);
      setSymptomInput("");
    }
  };

  // Handle removing a symptom from the list
  const handleRemoveSymptom = (index) => {
    const updatedList = symptomsList.filter((_, i) => i !== index);
    setSymptomsList(updatedList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (symptomsList.length === 0) {
      setResult("Please enter at least one symptom.");
      return;
    }

    setResult("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/symptom-checker", { symptoms: symptomsList });
      if (response.data.error) {
        setResult(`Error: ${response.data.error}`);
      } else {
        setResult(`Possible Conditions: ${response.data.suggestions}`);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        setResult(
          `Server error: ${error.response.data.error || "Unknown error"}`
        );
      } else {
        setResult(
          "An error occurred while sending the request. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSymptomsList([]);
    setResult("");
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl h-full bg-white shadow-lg rounded-2xl p-6 space-y-9 overflow-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-700 tracking-wide">
          Describe Your Symptoms, We'll Do the Rest!
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input for new symptom */}
          <div className="flex space-x-3">
            <input
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              placeholder="Enter a symptom..."
              className="flex-1 border border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
            />
            <button
              type="button"
              onClick={handleAddSymptom}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add
            </button>
          </div>

          {/* Display list of added symptoms */}
          {symptomsList.length > 0 && (
            <ul className="space-y-3 mt-4">
              {symptomsList.map((symptom, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm"
                >
                  <span className="text-gray-700">{symptom}</span>
                  <button
                    onClick={() => handleRemoveSymptom(index)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Submit and clear buttons */}
          <div className="flex justify-between items-center space-x-3">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Check Symptoms
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Clear All
            </button>
          </div>
        </form>

        {/* Loading spinner */}
        {loading ? (
          <div className="flex justify-center mt-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-400 border-b-4 border-transparent"></div>
          </div>
        ) : (
          <div className="mt-6 text-md text-center text-gray-700 font-medium">
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomDetection;
