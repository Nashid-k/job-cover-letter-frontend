import React, { useState, useEffect } from "react";
import { useAuth } from "../features/auth/AuthContext";
import { generateCoverLetter } from "../services/coverLetterService";
import { getProfile } from "../services/profileService";
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  User, 
  AlertCircle, 
  TrendingUp, 
  X,
  ChevronDown,
  ChevronUp,
  Download,
  Shield,
  Target,
  BarChart3,
  Clock,
  BookOpen,
  Zap,
  Mail,
  MapPin,
  Briefcase,
  Star,
  Cpu
} from "lucide-react";

export default function CoverLetter() {
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
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

  // Analyze job description against user skills
  const analyzeJobDescription = () => {
    if (!jobDescription.trim() || !profile.jobPreferences?.skills) return null;
    
    const userSkills = Array.isArray(profile.jobPreferences.skills) 
      ? profile.jobPreferences.skills 
      : profile.jobPreferences.skills.split(',').map(s => s.trim().toLowerCase());
    
    // Extract keywords from job description
    const jobText = jobDescription.toLowerCase();
    const commonTechSkills = [
      'javascript', 'typescript', 'react', 'node', 'python', 'java', 'html', 'css', 
      'sql', 'mongodb', 'express', 'aws', 'docker', 'kubernetes', 'graphql', 'rest', 
      'api', 'git', 'github', 'ci/cd', 'agile', 'scrum', 'redux', 'vue', 'angular', 
      'svelte', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'terraform', 
      'jenkins', 'ansible', 'postgresql', 'mysql', 'firebase', 'azure', 'gcp'
    ];
    
    const requiredSkills = commonTechSkills.filter(skill => 
      jobText.includes(skill) || jobText.includes(skill + ' ') || jobText.includes(' ' + skill)
    );
    
    const matchedSkills = requiredSkills.filter(skill => 
      userSkills.some(userSkill => userSkill.toLowerCase().includes(skill) || skill.includes(userSkill.toLowerCase()))
    );
    
    const missingSkills = requiredSkills.filter(skill => 
      !userSkills.some(userSkill => userSkill.toLowerCase().includes(skill) || skill.includes(userSkill.toLowerCase()))
    );
    
    // Extract experience requirements (simplified)
    const experienceRegex = /(\d+)\+?\s*(years|yrs|year)/gi;
    const experienceMatches = [];
    let match;
    
    while ((match = experienceRegex.exec(jobText)) !== null) {
      experienceMatches.push({
        years: parseInt(match[1]),
        context: jobText.substring(Math.max(0, match.index - 30), Math.min(jobText.length, match.index + 30))
      });
    }
    
    const score = requiredSkills.length > 0 
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100) 
      : 0;
    
    return {
      score,
      matchedSkills,
      missingSkills,
      requiredSkills,
      experienceRequirements: experienceMatches,
      userSkills
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      const analysisResult = analyzeJobDescription();
      
      const res = await generateCoverLetter(token, jobDescription, analysisResult);
      
      // Handle the enhanced response structure
      if (res && typeof res === 'object') {
        // Check if application is recommended
        if (res.recommendation?.action === 'not_recommended') {
          setError(`Application not recommended: ${res.recommendation.reason}`);
          setAnalysis(res.analysis);
          setCoverLetter('');
          return;
        }
        
        // Extract coverLetter from the response
        if (res.coverLetter) {
          setCoverLetter(res.coverLetter);
        } else {
          throw new Error('No cover letter content in response');
        }
        
        // Use analysis from response if available, otherwise use local analysis
        const finalAnalysis = res.analysis || analysisResult;
        setAnalysis({
          ...finalAnalysis,
          recommendation: res.recommendation
        });
        
      } else if (typeof res === 'string') {
        // Fallback for direct string response
        setCoverLetter(res);
        setAnalysis(analysisResult);
      } else {
        throw new Error('Invalid response format');
      }
      
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

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([coverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "cover-letter.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderSkills = (skills) => {
    if (!skills || skills.length === 0) {
      return <span className="text-gray-500 dark:text-gray-400">No skills specified</span>;
    }
    
    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
          >
            {skill}
          </span>
        ))}
      </div>
    );
  };

  const renderScoreBadge = (score) => {
    let color = "red";
    if (score >= 70) color = "green";
    else if (score >= 40) color = "yellow";
    
    const colorClasses = {
      green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
      yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
      red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colorClasses[color]}`}>
        {score}% Match
      </span>
    );
  };

  // eslint-disable-next-line no-unused-vars
  const isProfileComplete = profile.name && profile.email && (profile.jobPreferences?.skills || profile.jobPreferences?.title);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Cover Letter Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create personalized, truthful cover letters that highlight your actual skills and experience
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Summary Sidebar */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Your Profile
              </h2>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            {profileLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {profile.name || "Not provided"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {profile.email || "No email"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{profile.jobPreferences?.title || "No title specified"}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{profile.jobPreferences?.location || "Location not set"}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    {profile.jobPreferences?.remote ? (
                      <span className="inline-flex items-center text-green-600 dark:text-green-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Available for remote work
                      </span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        Remote preference not set
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Skills</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {profile.jobPreferences?.skills?.length || 0}
                    </span>
                  </div>
                  {renderSkills(
                    Array.isArray(profile.jobPreferences?.skills) 
                      ? profile.jobPreferences.skills 
                      : (profile.jobPreferences?.skills || '').split(',').map(s => s.trim()).filter(s => s)
                  )}
                </div>

                <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center">
                    {profile.resumePath ? (
                      <>
                        <div className="flex-shrink-0">
                          <FileText className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Resume uploaded</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Ready for analysis</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">No resume</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Upload for better results</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Job Input Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-3 sm:mb-0">
                  <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Job Description
                </h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <Cpu className="w-3 h-3 mr-1" />
                  AI Analysis Ready
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                      Paste Job Description *
                    </div>
                  </label>
                  <textarea
                    name="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    placeholder="Paste the job description here..."
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {jobDescription && profile.jobPreferences?.skills && (
                    <button
                      type="button"
                      onClick={() => {
                        const analysisResult = analyzeJobDescription();
                        setAnalysis(analysisResult);
                        setShowAnalysis(true);
                      }}
                      className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Analyze Match
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading || !jobDescription.trim() || profileLoading}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-200 shadow-md"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Cover Letter
                      </>
                    )}
                  </button>
                </div>
              </form>

              {analysis && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <BarChart3 className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white">Quick Analysis</span>
                    </div>
                    {renderScoreBadge(analysis.score)}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-4 text-xs">
                    <div className="text-center p-2 bg-white dark:bg-gray-700 rounded">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {analysis.matchedSkills?.length || 0}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 mt-1">Matched</div>
                    </div>
                    <div className="text-center p-2 bg-white dark:bg-gray-700 rounded">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {analysis.requiredSkills?.length || 0}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 mt-1">Required</div>
                    </div>
                    <div className="text-center p-2 bg-white dark:bg-gray-700 rounded">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">
                        {analysis.missingSkills?.length || 0}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 mt-1">Missing</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Output Section */}
            {coverLetter && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-3 sm:mb-0">
                    <FileText className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                    Generated Cover Letter
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDownload}
                      className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors duration-200"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center px-3 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm transition-colors duration-200"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 border border-gray-200 dark:border-gray-600 max-h-96 overflow-y-auto">
                  <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 text-sm leading-relaxed">
                    {coverLetter}
                  </div>
                </div>

                {analysis && (
                  <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setShowAnalysis(!showAnalysis)}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 flex items-center justify-between text-left font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      <span className="flex items-center">
                        <Shield className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
                        Detailed Job Match Analysis
                      </span>
                      {showAnalysis ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    
                    {showAnalysis && (
                      <div className="p-5 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <h4 className="font-medium text-green-900 dark:text-green-100 mb-3 flex items-center">
                              <Check className="w-4 h-4 mr-2" />
                              Skills Match ({analysis.matchedSkills?.length || 0}/{analysis.requiredSkills?.length || 0})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {analysis.matchedSkills && analysis.matchedSkills.map(skill => (
                                <span key={skill} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                  <Check className="w-3 h-3 mr-1" />
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                            <h4 className="font-medium text-red-900 dark:text-red-100 mb-3 flex items-center">
                              <X className="w-4 h-4 mr-2" />
                              Skills to Develop ({analysis.missingSkills?.length || 0})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {analysis.missingSkills && analysis.missingSkills.map(skill => (
                                <span key={skill} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                                  <X className="w-3 h-3 mr-1" />
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {analysis.experienceRequirements && analysis.experienceRequirements.length > 0 && (
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                            <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-3 flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Experience Requirements
                            </h4>
                            <div className="space-y-2">
                              {analysis.experienceRequirements.map((req, i) => (
                                <div key={i} className="text-sm text-yellow-800 dark:text-yellow-200">
                                  <span className="font-medium">{req.years}+ years experience</span>
                                  <p className="text-xs opacity-75 mt-1">"{req.context}..."</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            <Shield className="w-4 h-4 inline mr-1" />
                            This cover letter only includes skills you actually possess to maintain complete truthfulness.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-3">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Advanced AI generates personalized cover letters</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg mb-3">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">100% Truthful</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Only includes skills you actually possess</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-3">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Matching</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Analyzes job requirements against your skills</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg mb-3">
              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Career Insights</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Identifies skill gaps and areas for development</p>
          </div>
        </div>
      </div>
    </div>
  );
}