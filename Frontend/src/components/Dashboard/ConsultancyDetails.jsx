import { useEffect, useState, useMemo } from "react";
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

  const [tempRole, setTempRole] = useState("");
  const [tempDept, setTempDept] = useState("");
  const [tempStatus, setTempStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const loadDetails = async () => {
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

    loadDetails();
  }, [user, companyConfig]);

  const isDirty = useMemo(() => {
    if (!company) return false;
    const baseline = {
      name: company.name || "",
      domain: company.domain || "",
      roles: companyConfig?.roles || [],
      departments: companyConfig?.departments || [],
      userStatuses: companyConfig?.userStatuses || [],
    };
    return JSON.stringify(form) !== JSON.stringify(baseline);
  }, [company, companyConfig, form]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading consultancy settings...</div>
      </div>
    );
  }

  if (!company || !companyConfig) {
    return <div className="text-center text-gray-600">No company or configuration data available.</div>;
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = (field, value, setTemp) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setForm((prev) => ({
      ...prev,
      [field]: Array.from(new Set([...(prev[field] || []), trimmed])),
    }));
    setTemp("");
  };

  const handleRemoveItem = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setStatusMessage("");

      const companyRes = await updateCompany(company.id, {
        name: form.name,
        domain: form.domain,
      });

      const configRes = await updateCompanyConfig(company.id, {
        roles: form.roles,
        departments: form.departments,
        userStatuses: form.userStatuses,
      });

      if (companyRes?.success && configRes?.success) {
        setCompany((prev) => ({ ...prev, name: form.name, domain: form.domain }));
        setCompanyConfig({
          roles: form.roles,
          departments: form.departments,
          userStatuses: form.userStatuses,
        });
        refreshCompanyData();
        setEditing(false);
        setStatusMessage("Company details updated successfully.");
      } else {
        setStatusMessage("Unable to update company settings. Please try again.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      setStatusMessage("Update failed. See console for details.");
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
    setStatusMessage("");
  };

  const renderConfigCard = (field, title, items, tempValue, setTempValue, placeholder) => (
    <div className="bg-slate-50 rounded-3xl border border-slate-200 p-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">Manage the values used across user creation and filters.</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {items.length > 0 ? (
              items.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm border border-slate-200">
                  <span>{item}</span>
                  {editing && (
                    <button type="button" className="text-red-500 hover:text-red-600" onClick={() => handleRemoveItem(field, item)}>
                      ×
                    </button>
                  )}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">No {title.toLowerCase()} configured yet.</span>
            )}
          </div>

          {editing && (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddItem(field, tempValue, setTempValue);
                    e.preventDefault();
                  }
                }}
                placeholder={`Add new ${placeholder}`}
                className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="button"
                onClick={() => handleAddItem(field, tempValue, setTempValue)}
                className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-2 py-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Company settings</p>
              <h1 className="text-3xl font-semibold text-slate-900">Consultancy details</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Configure the company profile, roles, departments, and user status values used across the admin dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {!editing ? (
                <button onClick={() => setEditing(true)} className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                  Edit settings
                </button>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <button onClick={handleSave} disabled={!isDirty || loading} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                    Save changes
                  </button>
                  <button onClick={handleCancel} className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {statusMessage && <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{statusMessage}</p>}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Company profile</h2>
                <p className="text-sm text-slate-500">Update the name and domain used for the consultancy account.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                {editing ? "Editing" : "Read-only"}
              </span>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <label className="text-sm font-medium text-slate-700">Company name</label>
                {editing ? (
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                ) : (
                  <p className="mt-2 text-base font-medium text-slate-900">{form.name || "Not configured"}</p>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <label className="text-sm font-medium text-slate-700">Company domain</label>
                {editing ? (
                  <input
                    type="text"
                    value={form.domain}
                    onChange={(e) => handleChange("domain", e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                ) : (
                  <p className="mt-2 text-base font-medium text-slate-900">{form.domain || "Not configured"}</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Dashboard configuration</h2>
              <p className="text-sm text-slate-500">Configure roles, departments, and status values available across the application.</p>
            </div>

            <div className="space-y-4">
              {renderConfigCard("roles", "Roles", form.roles, tempRole, setTempRole, "role")}
              {renderConfigCard("departments", "Departments", form.departments, tempDept, setTempDept, "department")}
              {renderConfigCard("userStatuses", "Status values", form.userStatuses, tempStatus, setTempStatus, "status")}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
