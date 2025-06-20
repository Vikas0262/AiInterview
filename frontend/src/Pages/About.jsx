import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaRobot, 
  FaLightbulb, 
  FaUsers, 
  FaChartLine, 
  FaLinkedin, 
  FaTwitter, 
  FaGithub, 
  FaRocket, 
  FaCode, 
  FaBrain, 
  FaUserTie 
} from 'react-icons/fa';

const About = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const features = [
    {
      icon: <FaRobot className="w-8 h-8 text-indigo-500" />,
      title: 'AI-Powered Learning',
      description: 'Harness the power of artificial intelligence to get personalized interview preparation and smart practice questions.'
    },
    {
      icon: <FaLightbulb className="w-8 h-8 text-amber-500" />,
      title: 'Smart Practice',
      description: 'Our intelligent system adapts to your skill level, providing targeted practice to improve your weak areas.'
    },
    {
      icon: <FaUsers className="w-8 h-8 text-emerald-500" />,
      title: 'Community Driven',
      description: 'Join a growing community of learners and professionals sharing knowledge and experiences.'
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-rose-500" />,
      title: 'Track Progress',
      description: 'Detailed analytics help you understand your progress and areas for improvement.'
    },
    {
      icon: <FaCode className="w-8 h-8 text-blue-500" />,
      title: 'Real-world Scenarios',
      description: 'Practice with questions based on real interview scenarios from top tech companies.'
    },
    {
      icon: <FaBrain className="w-8 h-8 text-purple-500" />,
      title: 'Skill Assessment',
      description: 'Get detailed feedback on your technical and problem-solving abilities.'
    }
  ];

  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Tech entrepreneur with 10+ years of experience in EdTech and AI.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      name: 'Sarah Williams',
      role: 'Lead Developer',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Full-stack developer passionate about creating seamless learning experiences.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      name: 'Michael Chen',
      role: 'AI Specialist',
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
      bio: 'Machine learning expert focused on adaptive learning technologies.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      name: 'Emma Davis',
      role: 'UX Designer',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      bio: 'Designer dedicated to creating intuitive and engaging user experiences.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-[4rem]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold mb-6"
          >
            About InterviewAI
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl max-w-3xl mx-auto"
          >
            Revolutionizing the way people interact with AI through innovative technology and exceptional user experience.
          </motion.p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2 mb-10 md:mb-0 md:pr-10"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                Founded in 2023, InterviewAI was born out of a simple idea: to make AI more accessible and useful for everyone. 
                Our team of passionate technologists and designers came together to create an AI assistant that truly understands 
                and adapts to your needs.
              </p>
              <p className="text-gray-600">
                Today, we serve thousands of users worldwide, helping them be more productive and creative with the power of AI. 
                Our commitment to innovation and user satisfaction drives us to continuously improve and expand our offerings.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:w-1/2"
            >
              <div className="bg-gray-200 rounded-xl overflow-hidden shadow-xl">
                <img 
                  src='' 
                  alt="Our team working together" 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80';
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A diverse group of passionate individuals working together to create something amazing.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-blue-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who are already experiencing the power of InterviewAI.
          </p>
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-lg transition-colors duration-300">
            Get Started for Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
