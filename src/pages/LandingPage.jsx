import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Briefcase, 
  FileText, 
  Sparkles, 
  Users, 
  CheckCircle, 
  ChevronRight,
  Github,
  Linkedin,
  Mail,
  Star,
  Target,
  LayoutDashboard,
  User as UserIcon,
  Award,
  BarChart3,
  Shield,
  Zap
} from "lucide-react";

const JobSeekerLanding = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "AI-Powered Cover Letters",
      description: "Generate professional, tailored cover letters in seconds with our advanced AI technology."
    },
    {
      icon: <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Smart Resume Parsing",
      description: "Upload your resume and automatically extract skills, experiences, and achievements."
    },
    {
      icon: <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Application Tracking",
      description: "Keep track of all your job applications in one place with our intuitive dashboard."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Personalized Recommendations",
      description: "Get job recommendations based on your skills, preferences, and career goals."
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "95%", label: "Success Rate" },
    { value: "50K+", label: "Cover Letters" },
    { value: "1M+", label: "Skills Extracted" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      content: "JobSeeker helped me land my dream job at Google. The AI-generated cover letters were incredibly professional!",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      content: "The resume parsing feature is magical. It extracted all my skills and experiences perfectly.",
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      content: "I went from 0 interview calls to 5 in just two weeks after using JobSeeker.",
      avatar: "ER"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold">J</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                JobSeeker
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Testimonials
              </a>
              <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                About
              </a>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Land Your Dream Job with
              <span className="text-blue-600 dark:text-blue-400"> AI-Powered</span> Tools
            </h1>
            
            <p className={`text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 transition-all duration-700 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Create professional cover letters, optimize your resume, and track your job applications—all in one place.
            </p>
            
            <div className={`flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
              >
                Sign In
              </Link>
            </div>
            
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 max-w-4xl mx-auto border border-gray-200 dark:border-gray-700 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <LayoutDashboard className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">JobSeeker Dashboard</h2>
                </div>
                <p className="text-blue-100 mb-6">Experience our intuitive dashboard designed for job seekers</p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-white font-bold text-lg">12</div>
                    <div className="text-blue-100 text-sm">Cover Letters</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-white font-bold text-lg">8</div>
                    <div className="text-blue-100 text-sm">Applications</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-white font-bold text-lg">15</div>
                    <div className="text-blue-100 text-sm">Skills</div>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Try Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center transition-all duration-500 hover:scale-105"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for Your Job Search
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Powerful tools designed to help you stand out in the competitive job market
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                  {features[currentFeature].icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {features[currentFeature].title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {features[currentFeature].description}
              </p>
              <div className="flex space-x-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`h-2 rounded-full transition-all ${index === currentFeature ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300 dark:bg-gray-600'}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-6">Why Choose JobSeeker?</h3>
              <div className="space-y-4">
                {[
                  "Save hours on each job application",
                  "Increase your interview chances",
                  "Professional, tailored content",
                  "Easy-to-use interface"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 text-blue-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4 inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white dark:bg-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Job Seekers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join thousands of users who have successfully landed their dream jobs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join thousands of job seekers who have already landed their dream roles with JobSeeker
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* About Section */}
      <footer id="about" className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold">J</span>
                </div>
                <span className="text-xl font-bold">JobSeeker</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The all-in-one platform for job seekers to create professional applications, track progress, and land dream jobs.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Creator</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">NK</span>
                </div>
                <div>
                  <p className="font-medium">Nashid K</p>
                  <p className="text-sm text-gray-400">Full Stack Developer</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Built with passion to help job seekers navigate the competitive job market.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} JobSeeker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobSeekerLanding;