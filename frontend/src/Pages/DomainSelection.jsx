import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DomainSelection = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [experience, setExperience] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [selectionMethod, setSelectionMethod] = useState('manual'); // 'manual' or 'resume'

  const domains = [
    { id: 'frontend', name: 'Frontend Developer', icon: '💻' },
    { id: 'backend', name: 'Backend Developer', icon: '⚙️' },
    { id: 'fullstack', name: 'Full Stack Developer', icon: '🌐' },
    { id: 'java', name: 'Java Developer', icon: '☕' },
    { id: 'cpp', name: 'C/C++ Developer', icon: '🔧' },
    { id: 'data', name: 'Data Analyst', icon: '📊' },
    { id: 'qa', name: 'QA / Testing', icon: '✅' },
    { id: 'devops', name: 'DevOps Engineer', icon: '🔄' },
  ];

  const experienceLevels = [
    { id: 'fresher', label: 'Fresher' },
    { id: '1-2', label: '1–2 years' },
    { id: '3-5', label: '3–5 years' },
    { id: '5+', label: '5+ years' },
  ];

  const handleDomainSelect = (domainId) => {
    setSelectedDomain(domainId);
    setSelectionMethod('manual');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setSelectionMethod('resume');
      // Here you would typically parse the resume and extract the domain
      // For now, we'll just auto-select a domain
      setSelectedDomain('fullstack');
    }
  };

  const handleStartInterview = () => {
    // Save selection to localStorage or context
    const interviewConfig = {
      domain: domains.find(d => d.id === selectedDomain)?.name || selectedDomain,
      domainId: selectedDomain,
      experience: experienceLevels.find(e => e.id === experience)?.label || experience,
      experienceId: experience,
      selectionMethod,
      resumeFile: resumeFile?.name,
      startedAt: new Date().toISOString()
    };
    
    localStorage.setItem('interviewConfig', JSON.stringify(interviewConfig));
    navigate('/interview');
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-3 sm:px-5 lg:px-6">
      <div className="max-w-4xl mx-auto mt-[6rem]">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === stepNum 
                        ? 'bg-blue-600 text-white' 
                        : step > stepNum 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-white border-2 border-gray-300 text-gray-500'
                    }`}
                  >
                    {stepNum}
                  </div>
                  <span className="mt-2 text-xs font-medium text-gray-500">
                    {stepNum === 1 ? 'Select Domain' : stepNum === 2 ? 'Experience' : 'Start'}
                  </span>
                </div>
                {stepNum < 3 && (
                  <div className="flex-1 border-t-2 border-gray-200 mx-2"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Select Domain */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Interview Domain</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Manual Selection Card */}
              <div 
                className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectionMethod === 'manual' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
                onClick={() => setSelectionMethod('manual')}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl mr-4">
                    📂
                  </div>
                  <h3 className="text-lg font-semibold">Select Domain Manually</h3>
                </div>
                <p className="text-gray-600 text-sm">Choose from our list of available domains</p>
              </div>

              {/* Upload Resume Card */}
              <label 
                className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectionMethod === 'resume' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl mr-4">
                    📄
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Upload Resume</h3>
                    <p className="text-gray-600 text-sm">Let AI analyze and suggest domains</p>
                  </div>
                </div>
                {resumeFile && (
                  <p className="text-sm text-green-600 mt-2">
                    {resumeFile.name} selected
                  </p>
                )}
              </label>
            </div>

            {/* Domain Grid */}
            {selectionMethod === 'manual' && (
              <div className="mt-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select your domain</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {domains.map((domain) => (
                    <div
                      key={domain.id}
                      onClick={() => handleDomainSelect(domain.id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 flex items-center space-x-3 ${
                        selectedDomain === domain.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <span className="text-2xl">{domain.icon}</span>
                      <h4 className="font-medium">{domain.name}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={nextStep}
                disabled={!selectedDomain}
                className={`px-6 py-2 rounded-md text-white ${
                  selectedDomain 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Next: Experience Level
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Experience Level */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Experience Level</h2>
            
            <div className="space-y-4 mb-8">
              {experienceLevels.map((level) => (
                <label 
                  key={level.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    experience === level.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      checked={experience === level.id}
                      onChange={() => setExperience(level.id)}
                    />
                    <span className="ml-3 block text-sm font-medium text-gray-700">
                      {level.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!experience}
                className={`px-6 py-2 rounded-md text-white ${
                  experience 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Next: Start Interview
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Start Interview */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎯</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Start Your Interview!</h2>
            <p className="text-gray-600 mb-8">
              You've selected <span className="font-medium">{
                domains.find(d => d.id === selectedDomain)?.name || 'your domain'
              }</span> with <span className="font-medium">{
                experienceLevels.find(e => e.id === experience)?.label.toLowerCase() || 'your experience level'
              }</span>.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-8 text-left">
              <h3 className="font-medium text-gray-900 mb-2">Interview Tips:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Find a quiet, well-lit space</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Ensure your microphone and camera are working</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Have a stable internet connection</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleStartInterview}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 shadow-md"
              >
                Start Interview Now
              </button>
            </div>
            
            <p className="mt-4 text-sm text-gray-500">
              You can change these settings later from your profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainSelection;
