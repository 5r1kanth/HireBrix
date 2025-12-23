import { useState, useEffect } from "react";
import { createUser, updateUser } from "@/api/users.api";
import { COMPANY_ID } from "@/data/consultancyData";
import { ROLE_CONFIG } from "@/data/adminData"; // You can export ROLE_CONFIG from adminData

export default function AddUserForm({ role = "Admin", onAddUser, userData = null }) {
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

  // Prefill form when editing
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        middleName: userData.middleName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        department: userData.department || "",
        role: userData.role || role,
        status: userData.status || "Active",
      });
    }
  }, [userData, role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const capitalize = (str) =>
    str
      ?.trim()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("First Name, Last Name, and Email are required.");
      return;
    }

    const payload = {
      companyId: COMPANY_ID,
      email: formData.email.trim(),
      role: formData.role,
      department: formData.department.trim(),
      status: formData.status,
      firstName: capitalize(formData.firstName),
      middleName: capitalize(formData.middleName),
      lastName: capitalize(formData.lastName),
    };

    try {
      setLoading(true);

      if (userData && userData.id) {
        // Update existing user
        await updateUser(userData.id, payload);
      } else {
        // Create new user
        await createUser(payload);
      }

      onAddUser(); // Refresh parent table
      // Reset form only if adding new user
      if (!userData) {
        setFormData({
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          department: "",
          role,
          status: "Active",
        });
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-md p-6 w-full max-w-5xl mx-auto">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-6 text-center">{userData ? `Edit ${formData.role}` : ROLE_CONFIG[role] || "Add User"}</h2>

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
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="p-3 border rounded"
          required
          disabled={!!userData} // Prevent email edit for existing users
        />

        {/* Department */}
        <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} className="p-3 border rounded" />

        {/* Role */}
        <select name="role" value={formData.role} onChange={handleChange} className="p-3 border rounded">
          <option value={formData.role}>{formData.role}</option>
        </select>

        {/* Status */}
        <select name="status" value={formData.status} onChange={handleChange} className="p-3 border rounded">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Submit */}
        <button type="submit" disabled={loading} className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition mt-2 disabled:opacity-50">
          {loading ? "Saving..." : userData ? "Update User" : ROLE_CONFIG[role] || "Add User"}
        </button>
      </form>
    </div>
  );
}
