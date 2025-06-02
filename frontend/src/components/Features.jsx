import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all cursor-pointer">
    <div className="px-6 text-center mb-4">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto">
        <i className={`text-2xl ${icon}`}></i>
      </div>
    </div>
    <h3 className="text-xl font-bold text-center mb-3">{title}</h3>
    <p className="text-blue-100 text-center">{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: 'fas fa-microphone',
      title: 'Real-Time Voice Interview',
      description: 'Practice with our AI interviewer using your voice. Get realistic interview experience with natural conversations.',
    },
    {
      icon: 'fas fa-comment-dots',
      title: 'Instant Feedback',
      description: 'Receive detailed analysis and suggestions to improve your interview performance immediately after each session.',
    },
    {
      icon: 'fas fa-users',
      title: 'Multiple Interview Types',
      description: 'Practice HR, technical, and behavioral interviews tailored to your industry and experience level.',
    },
    {
      icon: 'fas fa-clipboard-check',
      title: 'Quiz Practice and Scoring',
      description: 'Test your knowledge with industry-specific quizzes and track your progress over time with detailed scoring.',
    },
  ];

  return (
    <section id="features" className="py-16 px-6">
      <div className="container px-6 mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
