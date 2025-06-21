import React from 'react';
import t1 from '../assets/Testimonial/t1.jpg'
import t2 from '../assets/Testimonial/t2.jpg'
import t3 from '../assets/Testimonial/t3.jpg'

const Testimonials = () => {
  return (
    <div className="py-16 px-6">
        <div className="container px-6 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <img 
                  src={t1} 
                  alt="User" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold">Sarah Johnson</h4>
                  <p className="text-sm text-blue-200">Software Engineer</p>
                </div>
              </div>
              <p className="text-blue-100">"InterviewAI helped me prepare for my technical interviews at top tech companies. The feedback was incredibly valuable and I landed my dream job!"</p>
              <div className="mt-4 text-yellow-400">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <img 
                  src={t2} 
                  alt="User" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold">Michael Chen</h4>
                  <p className="text-sm text-blue-200">Product Manager</p>
                </div>
              </div>
              <p className="text-blue-100">"The behavioral interview practice was spot-on! I felt so much more confident going into my interviews after using this platform."</p>
              <div className="mt-4 text-yellow-400">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <img 
                  src={t3} 
                  alt="User" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold">Emily Rodriguez</h4>
                  <p className="text-sm text-blue-200">Marketing Specialist</p>
                </div>
              </div>
              <p className="text-blue-100">"The quiz feature helped me identify gaps in my knowledge. The voice interview practice was incredibly realistic. Highly recommend!"</p>
              <div className="mt-4 text-yellow-400">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

  );
};

export default Testimonials;