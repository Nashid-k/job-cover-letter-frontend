import React, { useEffect, useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
import {
  getProfile,
  updatePreferences,
  uploadResume,
} from "../services/profileService";
import Input from "../components/Input";
import Button from "../components/Button";
import { User, Upload, Settings, Check, X } from "lucide-react";

export default function Profile() {
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({
    title: "",
    location: "",
    skills: [],
    remote: false,
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");
      const data = await getProfile(token);
      setProfile(data);
      // Ensure skills are always an array in form state
      const jobPreferences = data.jobPreferences || {};
      setForm({
        title: jobPreferences.title || "",
        location: jobPreferences.location || "",
        skills:
          Array.isArray(jobPreferences.skills)
            ? jobPreferences.skills
            : typeof jobPreferences.skills === "string"
            ? jobPreferences.skills.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
        remote: jobPreferences.remote || false,
      });
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "skills") {
      // Always store as array (model expects [String])
      setForm({
        ...form,
        skills: value
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    // Send form with skills as array
    const data = await updatePreferences(token, { ...form, skills: form.skills });
    setProfile(data);
    setMessage("Preferences updated!");
    setTimeout(() => setMessage(""), 3000);
    setLoading(false);
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      const data = await uploadResume(token, resumeFile);
      
      // Update both profile and form state with the parsed data
      setProfile(data);
      
      // Update form with the extracted data from resume
      setForm(prev => ({
        ...prev,
        title: data.jobPreferences?.title || prev.title,
        skills: Array.isArray(data.jobPreferences?.skills) 
          ? data.jobPreferences.skills 
          : prev.skills,
        remote: data.jobPreferences?.remote || prev.remote
      }));
      
      setMessage("Resume uploaded and parsed successfully!");
      setResumeFile(null); // Clear the file input
    } catch (error) {
      setMessage("Error uploading resume: " + error.message);
    }
    
    setTimeout(() => setMessage(""), 3000);
    setLoading(false);
  };

  // Skills badges, always receives array
  const renderSkills = (skills) => {
    if (!skills || skills.length === 0)
      return <span className="text-gray-500 dark:text-gray-400">No skills specified</span>;
    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 max-w-full break-words"
          >
            {skill}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Profile
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Manage your account and preferences
          </p>
        </div>

        {message && (
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-in fade-in duration-500">
            <p className="text-green-600 dark:text-green-400 text-center font-medium flex items-center justify-center">
              <Check className="w-5 h-5 mr-2" />
              {message}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <User className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
              Profile Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Name
                </label>
                <p className="text-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg">
                  {profile.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Email
                </label>
                <p className="text-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg">
                  {profile.email}
                </p>
              </div>

              {/* Current Job Preferences Preview */}
              {profile.jobPreferences && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Current Preferences</h3>
                  <div className="space-y-3">
                    {profile.jobPreferences.title && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Job Title</span>
                        <p className="text-gray-900 dark:text-white">{profile.jobPreferences.title}</p>
                      </div>
                    )}
                    {profile.jobPreferences.location && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</span>
                        <p className="text-gray-900 dark:text-white">{profile.jobPreferences.location}</p>
                      </div>
                    )}
                    {profile.jobPreferences.skills && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">Skills</span>
                        {renderSkills(
                          Array.isArray(profile.jobPreferences.skills)
                            ? profile.jobPreferences.skills
                            : typeof profile.jobPreferences.skills === "string"
                            ? profile.jobPreferences.skills.split(",").map((s) => s.trim()).filter(Boolean)
                            : []
                        )}
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Remote Work</span>
                      <p className="text-gray-900 dark:text-white">
                        {profile.jobPreferences.remote ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            Not specified
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resume Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Upload className="w-6 h-6 mr-3 text-green-600 dark:text-green-400" />
              Resume Upload
            </h2>
            <form onSubmit={handleResumeUpload} className="space-y-6">
              <div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl px-4 py-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
                />
              </div>
              <Button
                type="submit"
                loading={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold transition"
                disabled={!resumeFile}
              >
                Upload Resume
              </Button>
              {profile.resumePath && (
                <div className="text-green-600 dark:text-green-400 text-sm text-center flex flex-col items-center gap-1">
                  <span className="flex items-center gap-2">
                    ✅ Resume uploaded:
                    <a
                      href={`/${profile.resumePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-400 ml-1"
                    >
                      View Resume
                    </a>
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs break-all">{profile.resumePath}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Job Preferences */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Settings className="w-6 h-6 mr-3 text-purple-600 dark:text-purple-400" />
            Job Preferences
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Job Title"
                name="title"
                value={form.title || ""}
                onChange={handleChange}
                placeholder="e.g., Frontend Developer"
              />
              <Input
                label="Location"
                name="location"
                value={form.location || ""}
                onChange={handleChange}
                placeholder="e.g., Remote or New York"
              />
            </div>

            <div>
              <Input
                label="Skills (comma separated)"
                name="skills"
                value={form.skills.join(", ")}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separate skills with commas. They will appear as tags in your profile.
              </p>

              {/* Skills Preview */}
              {form.skills.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">Preview</span>
                  {renderSkills(form.skills)}
                </div>
              )}
            </div>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="remote"
                checked={form.remote || false}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Remote Work Available
              </span>
            </label>

            <Button
              type="submit"
              loading={loading}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition"
            >
              Update Preferences
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}