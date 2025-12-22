import { useState } from "react";
import { createUser } from "@/api/users.api";
import { COMPANY_ID } from "@/data/consultancyData";

const ROLE_CONFIG = {
  Admin: "Add Admin",
  Manager: "Add Manager",
  "Team Lead": "Add Team Lead",
  Recruiter: "Add Recruiter",
  Consultant: "Add Consultant",
};

export default function AddUserForm({ role = "Admin", onAddUser }) {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    department: "",
    role,
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("First Name, Last Name, and Email are required.");
      return;
    }

    const payload = {
      companyId: COMPANY_ID,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      status: formData.status,
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      // googleId & picture will be updated on first login
    };

    try {
      setLoading(true);
      const createdUser = await createUser(payload);
      onAddUser(createdUser);

      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        department: "",
        role,
        status: "Active",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-md p-6 w-full max-w-5xl mx-auto">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-6 text-center">{ROLE_CONFIG[role] || "Add User"}</h2>

      {/* Error */}
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex gap-4">
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="flex-1 p-3 border rounded" required />
          <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} className="flex-1 p-3 border rounded" />
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="flex-1 p-3 border rounded" required />
        </div>

        {/* Email */}
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-3 border rounded" required />

        {/* Department */}
        <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} className="p-3 border rounded" />

        {/* Role (locked to selected flow) */}
        <select name="role" value={formData.role} onChange={handleChange} className="p-3 border rounded">
          <option value={role}>{role}</option>
        </select>

        {/* Status */}
        <select name="status" value={formData.status} onChange={handleChange} className="p-3 border rounded">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Submit */}
        <button type="submit" disabled={loading} className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition mt-2 disabled:opacity-50">
          {loading ? "Saving..." : ROLE_CONFIG[role] || "Add User"}
        </button>
      </form>
    </div>
  );
}
