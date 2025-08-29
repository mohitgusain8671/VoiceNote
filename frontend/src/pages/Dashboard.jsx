import React, { useState } from "react";
import Navbar from "../components/Navbar";
import NotesList from "../components/NotesList";

const Dashboard = () => {
  // Mock notes data - replace with actual API call later
  const [notes] = useState([
    {
      id: 1,
      title: "Meeting Notes",
      content:
        "Discussed project timeline and deliverables. Need to follow up with team members about their progress. The client wants to see a demo by next Friday.",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Shopping List",
      content:
        "Milk, Bread, Eggs, Butter, Cheese, Apples, Bananas, Chicken, Rice, Pasta",
      createdAt: "2024-01-14",
      updatedAt: "2024-01-14",
    },
    {
      id: 3,
      title: "Book Ideas",
      content:
        "1. A story about time travel and its consequences 2. Romance novel set in Victorian era 3. Sci-fi thriller about AI consciousness",
      createdAt: "2024-01-13",
      updatedAt: "2024-01-13",
    },
    {
      id: 4,
      title: "Workout Plan",
      content:
        "Monday: Chest and Triceps, Tuesday: Back and Biceps, Wednesday: Legs, Thursday: Shoulders, Friday: Cardio and Abs",
      createdAt: "2024-01-12",
      updatedAt: "2024-01-12",
    },
  ]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <NotesList notes={notes} />
    </div>
  );
};

export default Dashboard;
