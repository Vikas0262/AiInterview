const Footer = () => {
    return (
        <footer className="py-12 px-6">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1 */}
            <div>
              <div className="flex items-center mb-4">
                <i className="fas fa-robot text-2xl mr-2"></i>
                <span className="text-xl font-bold">InterviewAI</span>
              </div>
              <p className="text-blue-200 mb-4">Helping you prepare for interviews with AI-powered practice tools.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-300 hover:text-white transition-colors cursor-pointer">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-blue-300 hover:text-white transition-colors cursor-pointer">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a href="#" className="text-blue-300 hover:text-white transition-colors cursor-pointer">
                  <i className="fab fa-github text-xl"></i>
                </a>
              </div>
            </div>
            
            {/* Column 2 */}
            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-300 hover:text-white transition-colors cursor-pointer">About Us</a></li>
                <li><a href="#" className="text-blue-300 hover:text-white transition-colors cursor-pointer">Careers</a></li>
                <li><a href="#" className="text-blue-300 hover:text-white transition-colors cursor-pointer">Blog</a></li>
                <li><a href="#" className="text-blue-300 hover:text-white transition-colors cursor-pointer">Press</a></li>
              </ul>
            </div>
            
            {/* Column 3 */}
            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-300 hover:text-white transition-colors cursor-pointer">Documentation</a></li>
                <li><a href="#" className="text-blue-300 hover:text-white transition-colors cursor-pointer">Help Center</a></li>
                <li><a href="#" className="text-blue-300 hover:text-white transition-colors cursor-pointer">Community</a></li>
                <li><a href="#" className="text-blue-300 hover:text-white transition-colors cursor-pointer">Partners</a></li>
              </ul>
            </div>
            
            {/* Column 4 */}
            <div>
              <h4 className="text-lg font-bold mb-4">Stay Updated</h4>
              <p className="text-blue-200 mb-4">Subscribe to our newsletter for tips and updates.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 bg-white/10 border-none rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full"
                />
                <button className="px-4 py-2 bg-[#4A90E2] rounded-r-lg hover:bg-[#3A80D2] transition-all cursor-pointer whitespace-nowrap !rounded-button">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-800/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-300 text-sm mb-4 md:mb-0">© 2025 InterviewAI. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-blue-300 hover:text-white text-sm transition-colors cursor-pointer">Terms of Service</a>
              <a href="#" className="text-blue-300 hover:text-white text-sm transition-colors cursor-pointer">Privacy Policy</a>
              <a href="#" className="text-blue-300 hover:text-white text-sm transition-colors cursor-pointer">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;