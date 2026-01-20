import SkillSelector from "./SkillSelector";

export default function OpportunityForm({
  form,
  setForm,
  onSubmit,
  submitLabel = "Save",
  isEdit = false,
}) {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow-md p-8"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? "Edit Opportunity" : "Create New Opportunity"}
      </h2>

      {/* TITLE */}
      <div className="mb-5">
        <label className="text-sm font-medium">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full mt-1 px-4 py-3 border rounded-lg"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="mb-5">
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
          className="w-full mt-1 px-4 py-3 border rounded-lg"
        />
      </div>

      {/* SKILLS */}
      <div className="mb-6">
        <SkillSelector
          selectedSkills={form.skills}
          onChange={(skills) => setForm({ ...form, skills })}
        />
      </div>

      {/* DURATION & LOCATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="text-sm font-medium">Duration</label>
          <input
            name="duration"
            value={form.duration}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-3 border rounded-lg"
          />
        </div>
      </div>
      {/* STATUS */}
      <div className="mb-6">
        <label className="text-sm font-medium">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full mt-1 px-4 py-3 border rounded-lg"
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>


      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
