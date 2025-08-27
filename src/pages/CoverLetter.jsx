import React, { useState, useEffect } from "react";
import { useAuth } from "../features/auth/AuthContext";
import { generateCoverLetter } from "../services/coverLetterService";
import { getProfile } from "../services/profileService";
import Input from "../components/Input";
import Button from "../components/Button";
import { FileText, Sparkles, Copy, Check, User, AlertCircle } from "lucide-react";

export default function CoverLetter() {
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();

  // Fetch profile data on component mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        setProfileLoading(true);
        const token = localStorage.getItem("token");
        const data = await getProfile(token);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile data. Please check your profile settings.");
      } finally {
        setProfileLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      const res = await generateCoverLetter(token, jobDescription);
      setCoverLetter(res.coverLetter);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      setError("Failed to generate cover letter. Please try again.");
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Helper function to render skills as badges
const renderSkills = (skills) => {
  if (!skills) return <span className="text-gray-500 dark:text-gray-400">Not specified</span>;
  let skillsArray = Array.isArray(skills)
    ? skills.filter(skill => skill && skill.trim())
    : skills.split(',').map(skill => skill.trim()).filter(skill => skill);
  if (skillsArray.length === 0) {
    return <span className="text-gray-500 dark:text-gray-400">Not specified</span>;
  }
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {skillsArray.map((skill, index) => (
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

  // Check if profile is complete enough for good cover letter generation
  const isProfileComplete = profile.name && profile.email && (profile.jobPreferences?.skills || profile.jobPreferences?.title);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <Sparkles className="w-10 h-10 mr-3 text-blue-600 dark:text-blue-400" />
            AI Cover Letter Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Create personalized cover letters using your profile data
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-center font-medium flex items-center justify-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Your Profile Data
            </h2>
            
            {profileLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                  <p className="text-gray-900 dark:text-white mt-1">{profile.name || "Not provided"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                  <p className="text-gray-900 dark:text-white mt-1">{profile.email || "Not provided"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Job Title:</span>
                  <p className="text-gray-900 dark:text-white mt-1">{profile.jobPreferences?.title || "Not specified"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>
                  <p className="text-gray-900 dark:text-white mt-1">{profile.jobPreferences?.location || "Not specified"}</p>
                </div>
                <div>
  <span className="font-medium text-gray-700 dark:text-gray-300 block mb-1">Skills:</span>
  {renderSkills(profile.jobPreferences?.skills)}
</div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Remote:</span>
                  <div className="mt-1">
                    {profile.jobPreferences?.remote ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        Not specified
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Resume:</span>
                  <div className="mt-1">
                    {profile.resumePath ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                        ✅ Uploaded
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                        ❌ Not uploaded
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!isProfileComplete && !profileLoading && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-yellow-700 dark:text-yellow-300 text-xs flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  Complete your profile for better cover letters
                </p>
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-green-600 dark:text-green-400" />
              Job Description
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Paste Job Description *
                </label>
                <textarea
                  name="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                  rows={12}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  placeholder="Paste the complete job description here. Include requirements, responsibilities, and company information for best results..."
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading || !jobDescription.trim() || profileLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-4 font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Personalized Cover Letter
                  </div>
                )}
              </Button>
            </form>
          </div>

          {/* Output Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
                <FileText className="w-6 h-6 mr-3 text-purple-600 dark:text-purple-400" />
                Generated Cover Letter
              </h2>
              {coverLetter && (
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>
            
            {coverLetter ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 text-sm leading-relaxed font-sans">
                  {coverLetter}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-12 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Your personalized cover letter will appear here
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  Fill in the job description and click generate
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Tips for Better Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Keep your profile information up to date with current skills and preferences</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Upload your resume for more detailed and accurate cover letters</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Include complete job requirements and company information in the job description</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-600 dark:bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Review and customize the generated letter before sending to employers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}