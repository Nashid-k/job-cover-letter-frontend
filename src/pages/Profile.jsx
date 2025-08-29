import React, { useEffect, useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
import { useNavigate } from "react-router-dom"; // Added for navigation
import {
  getProfile,
  updatePreferences,
  uploadResume,
} from "../services/profileService";
import { User, Upload, Settings, Check, X, Plus, Trash2, Edit3, Briefcase, MapPin, AlertCircle, Info } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate(); // For redirecting
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({
    title: "",
    location: "",
    skills: [],
    remote: false,
  });
  const [newSkill, setNewSkill] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [loading, setLoading] = useState(false);
  const [editingSkillIndex, setEditingSkillIndex] = useState(null);
  const [editSkillValue, setEditSkillValue] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");
      try {
        const data = await getProfile(token);
        setProfile(data);
        const jobPreferences = data.jobPreferences || {};
        setForm({
          title: jobPreferences.title || "",
          location: jobPreferences.location || "",
          skills: Array.isArray(jobPreferences.skills)
            ? jobPreferences.skills
            : typeof jobPreferences.skills === "string"
            ? jobPreferences.skills.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
          remote: jobPreferences.remote || false,
        });
      } catch (error) {
        setMessage("Error fetching profile: " + error.message, "error");
      }
    }
    fetchProfile();
  }, []);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setForm({
        ...form,
        skills: [...form.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...form.skills];
    updatedSkills.splice(index, 1);
    setForm({ ...form, skills: updatedSkills });
    setEditingSkillIndex(null);
  };

  const handleEditSkill = (index) => {
    setEditingSkillIndex(index);
    setEditSkillValue(form.skills[index]);
  };

  const handleSaveEdit = () => {
    if (editSkillValue.trim()) {
      const updatedSkills = [...form.skills];
      updatedSkills[editingSkillIndex] = editSkillValue.trim();
      setForm({ ...form, skills: updatedSkills });
    }
    setEditingSkillIndex(null);
    setEditSkillValue("");
  };

  const handleCancelEdit = () => {
    setEditingSkillIndex(null);
    setEditSkillValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const data = await updatePreferences(token, { ...form, skills: form.skills });
      setProfile(data);
      showMessage("Preferences updated successfully!", "success");
    } catch (error) {
      showMessage("Error updating preferences: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      showMessage("Please select a file to upload", "error");
      return;
    }
    
    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      const data = await uploadResume(token, resumeFile);
      setProfile(data.user); // Update with the user data from response
      setForm(prev => ({
        ...prev,
        title: data.user.jobPreferences?.title || prev.title,
        location: data.user.jobPreferences?.location || prev.location,
        skills: Array.isArray(data.user.jobPreferences?.skills)
          ? data.user.jobPreferences.skills
          : prev.skills,
        remote: data.user.jobPreferences?.remote || prev.remote,
      }));
      showMessage("Resume uploaded and parsed successfully! Please review and edit extracted data as AI parsing may contain errors.", "success");
      setResumeFile(null);
      document.getElementById('resume-upload').value = '';
      navigate("/profile"); // Redirect to profile page
    } catch (error) {
      showMessage("Error uploading resume: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const renderSkills = (skills) => {
    if (!skills || skills.length === 0)
      return <span className="text-gray-500 dark:text-gray-400">No skills specified</span>;
    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
          >
            {skill}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-lg mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Your Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Update your preferences and upload your resume
          </p>
        </div>

        {message && (
          <div className={`mb-8 p-4 rounded-lg border animate-pulse ${
            messageType === "error"
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          }`}>
            <p className={`flex items-center justify-center text-base font-medium ${
              messageType === "error"
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
            }`}>
              {messageType === "error" ? (
                <AlertCircle className="w-6 h-6 mr-2" />
              ) : (
                <Check className="w-6 h-6 mr-2" />
              )}
              {message}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              Profile Overview
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-medium text-gray-900 dark:text-white truncate">
                    {profile.name || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {profile.email || "No email"}
                  </p>
                </div>
              </div>
              {profile.jobPreferences && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Current Preferences</h3>
                  <div className="space-y-3">
                    {profile.jobPreferences.title && (
                      <div className="flex items-center text-sm">
                        <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900 dark:text-white">{profile.jobPreferences.title}</span>
                      </div>
                    )}
                    {profile.jobPreferences.location && (
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900 dark:text-white">{profile.jobPreferences.location}</span>
                      </div>
                    )}
                    {profile.jobPreferences.skills && (
                      <div>
                        <div className="flex items-center text-sm mb-2">
                          <span className="text-gray-400 mr-2">•</span>
                          <span className="text-gray-900 dark:text-white">Skills:</span>
                        </div>
                        {renderSkills(
                          Array.isArray(profile.jobPreferences.skills)
                            ? profile.jobPreferences.skills
                            : typeof profile.jobPreferences.skills === "string"
                            ? profile.jobPreferences.skills.split(",").map((s) => s.trim()).filter(Boolean)
                            : []
                        )}
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <span className="text-gray-400 mr-2">•</span>
                      <span className="text-gray-900 dark:text-white mr-2">Remote work:</span>
                      {profile.jobPreferences.remote ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Available
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          Not specified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job Preferences and Resume Upload Card */}
          <div className="lg:col-span-2 space-y-8">
            {/* Resume Upload Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-green-500" />
                Resume Upload
              </h2>
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center">
                <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  AI parsing may contain errors. Please review and edit extracted skills, title, and other details below.
                </p>
              </div>
              <form onSubmit={handleResumeUpload} className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="absolute opacity-0 w-0 h-0"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-base text-gray-600 dark:text-gray-400">
                      {resumeFile ? resumeFile.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      PDF, DOC, or DOCX (Max 5MB)
                    </p>
                  </label>
                </div>
                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                    !resumeFile || loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={!resumeFile || loading}
                >
                  {loading ? "Uploading..." : "Upload Resume"}
                </button>
                {profile.resumePath && (
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-4">
                    <p className="text-green-600 dark:text-green-400 text-sm flex items-center justify-center">
                      <Check className="w-5 h-5 mr-2" />
                      Resume uploaded
                    </p>
                    <a
                      href={`/${profile.resumePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-2 inline-block"
                    >
                      View uploaded resume
                    </a>
                  </div>
                )}
              </form>
            </div>

            {/* Job Preferences Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-purple-500" />
                Job Preferences
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Preferred Job Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title || ""}
                      onChange={handleChange}
                      placeholder="e.g., Physician, Mechanical Engineer, HR Manager"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Preferred Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location || ""}
                      onChange={handleChange}
                      placeholder="e.g., New York, Remote"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills
                  </label>
                  <div className="flex gap-3 mb-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a skill (e.g., CPR, AutoCAD, Recruitment)"
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Add skills relevant to your profession. Review AI-extracted skills carefully.
                  </p>

                  {form.skills.length > 0 && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Your Skills ({form.skills.length})
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {form.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm"
                          >
                            {editingSkillIndex === index ? (
                              <>
                                <input
                                  type="text"
                                  value={editSkillValue}
                                  onChange={(e) => setEditSkillValue(e.target.value)}
                                  className="bg-transparent border-none outline-none w-24 text-sm"
                                  autoFocus
                                  disabled={loading}
                                />
                                <button
                                  type="button"
                                  onClick={handleSaveEdit}
                                  className="ml-2 text-green-600 hover:text-green-800 disabled:opacity-50"
                                  disabled={loading}
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="ml-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                                  disabled={loading}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => handleEditSkill(index)}
                                  className="ml-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                  disabled={loading}
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSkill(index)}
                                  className="ml-1 text-gray-500 hover:text-red-600 disabled:opacity-50"
                                  disabled={loading}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
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
                    disabled={loading}
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Available for remote work
                  </span>
                </label>

                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Preferences"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}