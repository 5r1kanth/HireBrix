import { useState } from "react";

export default function AddUserForm({ role = "Admin", onAddUser }) {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    role: role,
    department: "",
    status: "Active",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    console.log("Testing form data" + formData.firstName);
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("First Name, Last Name, and Email are required.");
      return;
    }
    onAddUser(formData);
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      role: role,
      department: "",
      status: "Active",
    });
  };

  return (
    <div className="bg-white shadow rounded-md p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-center">Add New {role}</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name Fields */}
        <div className="flex gap-4">
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="flex-1 p-3 border rounded" required />
          <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} className="flex-1 p-3 border rounded" />
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="flex-1 p-3 border rounded" required />
        </div>

        {/* Email */}
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-3 border rounded" required />

        {/* Department */}
        <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} className="p-3 border rounded" />

        {/* Role */}
        <select name="role" value={formData.role} onChange={handleChange} className="p-3 border rounded">
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Team Lead">Team Lead</option>
          <option value="Recruiter">Recruiter</option>
          <option value="Consultant">Consultant</option>
        </select>

        {/* Status */}
        <select name="status" value={formData.status} onChange={handleChange} className="p-3 border rounded">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition mt-2">
          Add {role}
        </button>
      </form>
    </div>
  );
}
