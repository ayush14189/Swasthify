import React, { useState } from "react";
import axios from "axios";

const HealthTips = () => {
  const [illness, setIllness] = useState("");
  const [adviceText, setAdviceText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDownload, setShowDownload] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAdviceText("");
    setShowDownload(false);

    try {
      const response = await axios.post("http://localhost:8080/health-tips", { illness });
      setAdviceText(response.data.advice);
      setShowDownload(true);
    } catch (error) {
      setAdviceText(
        "An error occurred while generating health tips. Please try again."
      );
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await axios.post(
        "/download-pdf",
        { illness, advice: adviceText },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${illness}_health_tips.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-10 bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-xl mt-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-700 tracking-wide">
        Get Personalized Health Tips
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-6">
          <label
            htmlFor="illness"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter Your Illness:
          </label>
          <input
            type="text"
            id="illness"
            placeholder="e.g., Diabetes, Hypertension"
            value={illness}
            onChange={(e) => setIllness(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out hover:shadow-md"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3 px-6 rounded-full font-medium text-white transition-all ease-in-out ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } shadow-lg`}
          disabled={loading}
        >
          {loading ? "Generating..." : "Get Tips"}
        </button>
      </form>
      <div id="result" className="mt-8">
        {adviceText && (
          <div className="bg-white rounded-lg p-6 shadow-md transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Health Tips:
            </h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              {adviceText.split("\n").map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {showDownload && (
        <button
          id="downloadBtn"
          className="w-full mt-6 py-3 px-6 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium shadow-lg transition-all ease-in-out"
          onClick={downloadPDF}
        >
          Download PDF
        </button>
      )}
    </div>
  );
};

export default HealthTips;
