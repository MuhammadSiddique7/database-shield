import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import {
  HiOutlineShieldCheck,
  HiOutlineBolt,
  HiOutlineCodeBracket,
  HiOutlineCircleStack,
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineChartBar,
  HiOutlineChevronDown
} from 'react-icons/hi2';

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    { icon: HiOutlineShieldCheck, title: 'SQL Injection Detection', desc: 'Advanced AI-powered detection of malicious SQL injection attempts before they reach your database.' },
    { icon: HiOutlineBolt, title: 'Real-time Analysis', desc: 'Sub-50ms query analysis ensures your application remains blazing fast while staying protected.' },
    { icon: HiOutlineCodeBracket, title: 'REST API Integration', desc: 'Simple drop-in REST API that works with any backend language or framework.' },
    { icon: HiOutlineCircleStack, title: 'Multi-Database Support', desc: 'Works seamlessly with PostgreSQL, MySQL, MongoDB, and other major database engines.' },
    { icon: HiOutlineDocumentMagnifyingGlass, title: 'Detailed Query Logs', desc: 'Comprehensive logging of all queries with risk scores, confidence levels, and timestamps.' },
    { icon: HiOutlineChartBar, title: 'Risk Assessment Engine', desc: 'Smart risk scoring system categorizes threats from low to critical severity.' }
  ];

  const faqs = [
    { q: 'What is Database Shield?', a: 'Database Shield is an AI-powered security layer that sits between your application and database, analyzing queries in real-time to prevent SQL injection and other database attacks.' },
    { q: 'How does the detection work?', a: 'We use advanced machine learning models trained on millions of safe and malicious queries to identify attack patterns with 99.9% accuracy.' },
    { q: 'What databases are supported?', a: 'We support all major databases including PostgreSQL, MySQL, SQL Server, MongoDB, and more.' },
    { q: 'Is there a free tier?', a: 'Yes! Our free tier includes 1,000 queries per month and 1 project, perfect for small applications and testing.' },
    { q: 'How do I integrate?', a: 'Simply send your database queries to our REST API endpoint before executing them. We provide SDKs and examples for all major languages.' },
    { q: 'What is the response time?', a: 'Our globally distributed edge network ensures query analysis typically completes in under 50ms.' }
  ];

  return (
    <div className="min-h-screen bg-dark text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden cyber-grid-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Protect Every <span className="gradient-text">Query</span>
            </h1>
            <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto mb-10">
              The intelligent security layer for your database. Detect and block SQL injection and malicious queries in real-time with our AI-powered API.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">Get Started Free</Link>
              <Link to="/docs" className="btn-secondary text-lg px-8 py-4">View Documentation</Link>
            </div>
          </motion.div>

          <motion.div
            className="mt-20 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <img src="/shield.svg" alt="Shield" className="w-32 h-32 md:w-48 md:h-48 drop-shadow-[0_0_30px_rgba(0,229,255,0.3)] animate-pulse" />
          </motion.div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-gray-800 py-10">
            <div>
              <p className="text-4xl font-bold text-white">10K+</p>
              <p className="text-cyan-400 mt-2">Queries Analyzed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">99.9%</p>
              <p className="text-cyan-400 mt-2">Accuracy</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">&lt;50ms</p>
              <p className="text-cyan-400 mt-2">Response Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Powerful Security Features</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="glass-card-hover p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <feature.icon className="w-12 h-12 text-cyan-400 mb-6" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -z-10 transform -translate-y-1/2"></div>
            
            {['Integrate our API', 'Send your queries', 'Get instant verdict'].map((step, i) => (
              <div key={i} className="flex flex-col items-center mb-10 md:mb-0 bg-dark px-4">
                <div className="w-16 h-16 rounded-full bg-cyan-900/30 border border-cyan-400 flex items-center justify-center text-cyan-400 text-2xl font-bold mb-4 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="glass-card p-8 border-t-4 border-t-gray-500">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></p>
              <ul className="space-y-4 mb-8 text-gray-400">
                <li className="flex items-center gap-2"><HiOutlineShieldCheck className="text-cyan-400" /> 1,000 queries/mo</li>
                <li className="flex items-center gap-2"><HiOutlineShieldCheck className="text-cyan-400" /> 1 Project</li>
                <li className="flex items-center gap-2"><HiOutlineShieldCheck className="text-cyan-400" /> Basic Support</li>
              </ul>
              <Link to="/register" className="btn-secondary w-full text-center block">Get Started</Link>
            </div>
            {/* Pro */}
            <div className="glass-card p-8 border-t-4 border-t-cyan-400 relative transform md:-translate-y-4 shadow-2xl shadow-cyan-900/20">
              <div className="absolute top-0 right-0 bg-cyan-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-bl-lg">Coming Soon</div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-6">$29<span className="text-lg text-gray-500 font-normal">/mo</span></p>
              <ul className="space-y-4 mb-8 text-gray-400">
                <li className="flex items-center gap-2"><HiOutlineShieldCheck className="text-cyan-400" /> 50,000 queries/mo</li>
                <li className="flex items-center gap-2"><HiOutlineShieldCheck className="text-cyan-400" /> 10 Projects</li>
                <li className="flex items-center gap-2"><HiOutlineShieldCheck className="text-cyan-400" /> Priority Support</li>
              </ul>
              <button disabled className="w-full text-center block py-2.5 px-4 rounded-lg bg-gray-800 text-gray-500 cursor-not-allowed font-medium">Coming Soon</button>
            </div>
            {/* Enterprise */}
            <div className="glass-card p-8 border-t-4 border-t-indigo-500 relative">
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Coming Soon</div>
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-4xl font-bold mb-6">Custom</p>
              <ul className="space-y-4 mb-8 text-gray-400">
                <li className="flex items-center gap-2"><HiOutlineShieldCheck className="text-cyan-400" /> Unlimited queries</li>
                <li className="flex items-center gap-2"><HiOutlineShieldCheck className="text-cyan-400" /> Unlimited Projects</li>
                <li className="flex items-center gap-2"><HiOutlineShieldCheck className="text-cyan-400" /> 24/7 Phone Support</li>
              </ul>
              <button disabled className="w-full text-center block py-2.5 px-4 rounded-lg bg-gray-800 text-gray-500 cursor-not-allowed font-medium">Coming Soon</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-lg">{faq.q}</span>
                  <HiOutlineChevronDown className={`w-5 h-5 text-cyan-400 transform transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-4 text-gray-400"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/shield.svg" alt="Logo" className="w-6 h-6" />
              <span className="text-lg font-bold">Database Shield</span>
            </div>
            <p className="text-gray-400 text-sm">Protecting applications from database attacks with intelligent real-time analysis.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
              <li><Link to="/docs" className="hover:text-cyan-400 transition-colors">Documentation</Link></li>
              <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">Changelog</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">About</span></li>
              <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">Blog</span></li>
              <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">Careers</span></li>
              <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">Contact</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">Privacy</span></li>
              <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">Terms</span></li>
              <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">Security</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Database Shield. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
