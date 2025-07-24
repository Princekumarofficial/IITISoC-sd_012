import { useState ,useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, Loader2, Home } from 'lucide-react'; // ⬅️ NEW: Imported Home icon
import { TailCursor } from "../components/Tail-cursor"
import { useNavigate } from "react-router-dom";
import API from "../service/api.js";

const ContactForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      let response = await API.contactUs(formData);
      if (response.isSuccess) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  useEffect(() => {
    if (formSubmitted) {
      navigate('/dashboard');
    }
  }, [formSubmitted, navigate]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-blue-600/5 relative py-12">
        <TailCursor />

        {/* Home Button - ⬅️ NEW */}
        <div className="absolute top-5 left-5 z-50">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/30 border border-white/10 backdrop-blur-sm transition-all duration-200 shadow-md"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>

        <div className="container mx-auto px-4">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto glass backdrop-blur-sm rounded-2xl overflow-hidden border border-primary/20 shadow-lg glow"
          >
          <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 p-6 border-b border-primary/10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Contact Us
            </h2>
            <p className="text-muted-foreground mt-2">
              Have questions? Reach out and we'll get back to you soon.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-background/50 text-black border border-primary/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300 outline-none"
                placeholder="Your name"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-background/50 border border-primary/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 text-black transition-all duration-300 outline-none"
                placeholder="your.email@example.com"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-3 rounded-lg bg-background/50 border border-primary/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300 outline-none text-black"
                placeholder="Your message here..."
              ></textarea>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-2"
            >
              <button
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  status === 'success' 
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                    : status === 'error'
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                    : 'bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-primary/20'
                }`}
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : status === 'success' ? (
                  <>
                    <Check className="w-5 h-5" />
                    Message Sent!
                  </>
                ) : status === 'error' ? (
                  'Error - Try Again'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </motion.section>
      </div>
    </div></>

   
  );
};

export default ContactForm;