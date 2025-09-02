import React, { useState } from "react";
import { db } from "../firebase/firebase-config"; // adjust path if needededededd
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function CreateProjectForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    shortDescription: "",
    longDescription: "",
    imageUrl: "",
    fundingGoal: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Calculate campaign duration
      const today = new Date();
      const endDate = new Date(formData.endDate);
      const duration = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

      const projectData = {
        ...formData,
        fundingGoal: Number(formData.fundingGoal),
        fundedMoney: 0, // Add fundedMoney with default value of 0
        backers:0,
        duration,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "projects"), projectData);

      setMessage("✅ Project submitted successfully!");
      setFormData({
        title: "",
        category: "",
        shortDescription: "",
        longDescription: "",
        imageUrl: "",
        fundingGoal: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Error adding project: ", error);
      setMessage("❌ Failed to submit project.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Create a New Project
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />

          <textarea
            name="shortDescription"
            placeholder="Short Description"
            value={formData.shortDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            rows="2"
            required
          />

          <textarea
            name="longDescription"
            placeholder="Long Description"
            value={formData.longDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            rows="5"
            required
          />

          <input
            type="url"
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />

          <input
            type="number"
            name="fundingGoal"
            placeholder="Funding Goal (USD)"
            value={formData.fundingGoal}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />

          <label className="block text-gray-700 font-medium">
            Campaign End Date:
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Project"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 font-semibold text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}