import { useEffect, useState } from "react";
import { getCompanyById, updateCompany, updateCompanyConfig } from "@/api/company.api";
import { useAuth } from "@/context/AuthContext";

export default function ConsultancyDetails() {
  const { user, companyConfig, setCompanyConfig, refreshCompanyData } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    domain: "",
    roles: [],
    departments: [],
    userStatuses: [],
  });

  // Temp input for adding new items
  const [tempRole, setTempRole] = useState("");
  const [tempDept, setTempDept] = useState("");
  const [tempStatus, setTempStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.companyId) return;
      setLoading(true);
      try {
        const comp = await getCompanyById(user.companyId);
        setCompany(comp);

        setForm({
          name: comp?.name || "",
          domain: comp?.domain || "",
          roles: companyConfig?.roles || [],
          departments: companyConfig?.departments || [],
          userStatuses: companyConfig?.userStatuses || [],
        });
      } catch (err) {
        console.error("Failed to fetch company info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, companyConfig]);

  if (loading) return <div>Loading...</div>;
  if (!company || !companyConfig) return <div>No company data found</div>;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = (field, value, setTemp) => {
    if (!value.trim()) return;
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));
    setTemp(""); // clear input
  };

  const handleRemoveItem = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const companyRes = await updateCompany(company.id, {
        name: form.name,
        domain: form.domain,
      });

      const configRes = await updateCompanyConfig(company.id, {
        roles: form.roles,
        departments: form.departments,
        userStatuses: form.userStatuses,
      });

      if (companyRes.success && configRes.success) {
        setCompany({ ...company, name: form.name, domain: form.domain });
        setCompanyConfig({
          roles: form.roles,
          departments: form.departments,
          userStatuses: form.userStatuses,
        });
        refreshCompanyData();
        setEditing(false);
      } else {
        alert("Failed to update company details.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed, check console for errors.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: company.name,
      domain: company.domain,
      roles: companyConfig.roles,
      departments: companyConfig.departments,
      userStatuses: companyConfig.userStatuses,
    });
    setTempRole("");
    setTempDept("");
    setTempStatus("");
    setEditing(false);
  };

  const renderEditableList = (field, items, tempValue, setTempValue, placeholder) => (
    <div className="col-span-2">
      <span className="font-medium text-gray-600 capitalize">{field}:</span>
      {!editing ? (
        <p>{items?.join(", ") || "N/A"}</p>
      ) : (
        <div>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="border rounded-md p-1 flex-1"
              placeholder={`Add new ${placeholder}`}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddItem(field, tempValue, setTempValue);
                  e.preventDefault();
                }
              }}
            />
            <button className="bg-blue-500 text-white px-3 rounded-md" onClick={() => handleAddItem(field, tempValue, setTempValue)}>
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <span key={index} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full flex items-center gap-1">
                {item}
                <button type="button" className="text-red-500 font-bold" onClick={() => handleRemoveItem(field, index)}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-md shadow p-4 w-full max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Consultancy Details</h2>
        {!editing ? (
          <button className="bg-blue-500 text-white px-3 py-1 rounded-md" onClick={() => setEditing(true)}>
            Edit
          </button>
        ) : (
          <div className="space-x-2">
            <button className="bg-green-500 text-white px-3 py-1 rounded-md" onClick={handleSave}>
              Save
            </button>
            <button className="bg-gray-300 text-black px-3 py-1 rounded-md" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Company Name */}
        <div>
          <span className="font-medium text-gray-600">Company Name:</span>
          {!editing ? (
            <p>{form.name || "N/A"}</p>
          ) : (
            <input type="text" className="border rounded-md w-full p-1" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
          )}
        </div>

        {/* Domain */}
        <div>
          <span className="font-medium text-gray-600">Domain:</span>
          {!editing ? (
            <p>{form.domain || "N/A"}</p>
          ) : (
            <input type="text" className="border rounded-md w-full p-1" value={form.domain} onChange={(e) => handleChange("domain", e.target.value)} />
          )}
        </div>

        {/* Editable Lists */}
        {renderEditableList("roles", form.roles, tempRole, setTempRole, "role")}
        {renderEditableList("departments", form.departments, tempDept, setTempDept, "department")}
        {renderEditableList("userStatuses", form.userStatuses, tempStatus, setTempStatus, "status")}
      </div>
    </div>
  );
}
