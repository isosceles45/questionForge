import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Syllabus = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("syllabus");
  const [selectedFile, setSelectedFile] = useState(null);
  const [syllabus, setSyllabus] = useState("");
  const navigate = useNavigate();

  // Multiple PYQs state management
  const [pyqs, setPyqs] = useState([{ id: 1, content: "", name: "PYQ 1" }]);
  const [activePyqId, setActivePyqId] = useState(1);

  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Find active PYQ
  const activePyq = pyqs.find((pyq) => pyq.id === activePyqId) || pyqs[0];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setError("");
    } else {
      setError("Please select a valid PDF file");
      setSelectedFile(null);
    }
  };

  const handleExtractText = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file first");
      return;
    }

    setExtracting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:8000/upload/pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract text from PDF");
      }

      const data = await response.json();

      // Set text to the appropriate state based on active tab
      if (activeTab === "syllabus") {
        setSyllabus(data.text);
      } else {
        // Update the content of the active PYQ
        setPyqs((prevPyqs) =>
          prevPyqs.map((pyq) =>
            pyq.id === activePyqId ? { ...pyq, content: data.text } : pyq
          )
        );
      }

      setSelectedFile(null);
    } catch (err) {
      setError(err.message || "Error extracting text from PDF");
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async () => {
    if (!syllabus) {
      setError("Syllabus content is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Process one PYQ at a time
      for (const pyq of pyqs) {
        if (!pyq.content) continue; // Skip empty PYQs

        const response = await fetch("http://localhost:8000/content/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user.primaryEmailAddress.emailAddress,
            syllabus: syllabus,
            pyq: pyq.content,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to save content for ${pyq.name}`);
        }
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/syllabus/graph");
      }, 500);
    } catch (err) {
      setError(err.message || "Error saving content");
    } finally {
      setLoading(false);
    }
  };

  const addNewPyq = () => {
    const newId = Math.max(...pyqs.map((p) => p.id), 0) + 1;
    const newPyq = { id: newId, content: "", name: `PYQ ${newId}` };
    setPyqs([...pyqs, newPyq]);
    setActivePyqId(newId);
  };

  const removePyq = (id) => {
    if (pyqs.length <= 1) {
      setError("You must have at least one PYQ");
      return;
    }

    const newPyqs = pyqs.filter((pyq) => pyq.id !== id);
    setPyqs(newPyqs);

    // If we removed the active PYQ, set a new active PYQ
    if (activePyqId === id) {
      setActivePyqId(newPyqs[0].id);
    }
  };

  const renamePyq = (id, newName) => {
    setPyqs((prevPyqs) =>
      prevPyqs.map((pyq) =>
        pyq.id === id ? { ...pyq, name: newName || pyq.name } : pyq
      )
    );
  };

  const handlePyqContentChange = (content) => {
    setPyqs((prevPyqs) =>
      prevPyqs.map((pyq) =>
        pyq.id === activePyqId ? { ...pyq, content } : pyq
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Upload Syllabus & Past Question Papers
        </h1>

        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="bg-white/40 backdrop-blur-md border border-white/40 p-1 rounded-xl mb-6 flex">
            <button
              onClick={() => setActiveTab("syllabus")}
              className={`flex-1 py-3 rounded-lg ${
                activeTab === "syllabus"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "text-gray-700"
              }`}
            >
              Syllabus
            </button>
            <button
              onClick={() => setActiveTab("pyq")}
              className={`flex-1 py-3 rounded-lg ${
                activeTab === "pyq"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "text-gray-700"
              }`}
            >
              Past Question Papers
            </button>
          </div>

          {/* Main Card */}
          <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {activeTab === "syllabus"
                  ? "Upload Syllabus"
                  : "Upload Past Question Papers"}
              </h2>

              {activeTab === "pyq" && (
                <button
                  onClick={addNewPyq}
                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center text-sm transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New PYQ
                </button>
              )}
            </div>

            {activeTab === "pyq" && (
              <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2">
                {pyqs.map((pyq) => (
                  <div
                    key={pyq.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${
                      activePyqId === pyq.id
                        ? "bg-blue-100 border border-blue-300"
                        : "bg-gray-100 hover:bg-gray-200 border border-gray-200"
                    }`}
                    onClick={() => setActivePyqId(pyq.id)}
                  >
                    <span className="font-medium">{pyq.name}</span>
                    {pyqs.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePyq(pyq.id);
                        }}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="p-6 space-y-6">
              {/* PDF Upload Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload PDF (Optional)
                </label>
                <div className="flex gap-4">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="bg-white/70 border border-gray-300 rounded-lg p-2 w-full"
                  />
                  <button
                    onClick={handleExtractText}
                    disabled={!selectedFile || extracting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
                  >
                    {extracting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Extract
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                        Extract
                      </>
                    )}
                  </button>
                </div>
              </div>

              {activeTab === "pyq" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    PYQ Name
                  </label>
                  <input
                    type="text"
                    value={activePyq.name}
                    onChange={(e) => renamePyq(activePyq.id, e.target.value)}
                    placeholder="Enter a descriptive name for this PYQ"
                    className="bg-white/70 border border-gray-300 rounded-lg p-2 w-full"
                  />
                </div>
              )}

              {/* Text Content Section */}
              <div className="space-y-2">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  {activeTab === "syllabus"
                    ? "Syllabus Content"
                    : `Content for ${activePyq.name}`}
                  {activeTab === "syllabus" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <textarea
                  id="content"
                  value={
                    activeTab === "syllabus" ? syllabus : activePyq.content
                  }
                  onChange={(e) =>
                    activeTab === "syllabus"
                      ? setSyllabus(e.target.value)
                      : handlePyqContentChange(e.target.value)
                  }
                  placeholder={`Paste ${
                    activeTab === "syllabus" ? "syllabus" : "question paper"
                  } content here or extract from PDF`}
                  className="bg-white/70 border border-gray-300 rounded-lg p-4 w-full min-h-[300px]"
                  required={activeTab === "syllabus"}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between items-center">
              <div>
                {error && (
                  <div className="flex items-center text-red-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {error}
                  </div>
                )}
                {success && (
                  <div className="flex items-center text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Content saved successfully!
                  </div>
                )}
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading || !syllabus}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Content"
                )}
              </button>
            </div>
          </div>

          {/* Information Card */}
          <div className="mt-8 bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold mb-4 text-blue-700">
              How This Works
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-semibold">1. Syllabus:</span> Upload your
                course syllabus (required). This helps generate questions that
                match your curriculum.
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">2. Past Question Papers:</span>{" "}
                Add multiple PYQs (optional) to improve question relevance and
                style.
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">3. Knowledge Graph:</span> The
                system uses this information to build a knowledge graph that
                understands relationships between topics.
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">4. Question Generation:</span>{" "}
                Once uploaded, you can generate tailored question papers that
                match your syllabus and follow similar patterns to your past
                papers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Syllabus;
