import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import {
  FiTarget, FiShield, FiUsers, FiCpu, FiTrendingUp, FiPackage, FiCheckCircle, FiBriefcase, FiMail, FiMapPin, FiTwitter
} from 'react-icons/fi';

const AboutNew = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto p-6">

          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">About LAWATA</h1>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
              Revolutionizing crowdfunding with intelligent risk assessment, transparent milestone funding, and unmatched investor protection.
            </p>
          </div>

          {/* Mission & Values Section */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Our Mission</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-50 p-6 rounded-lg">
                <FiTarget className="w-8 h-8 mx-auto text-color-b mb-3" />
                <h3 className="text-base font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-sm text-gray-600">Pioneering the future of crowdfunding with AI-powered risk analysis and smart contract technology.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <FiShield className="w-8 h-8 mx-auto text-color-b mb-3" />
                <h3 className="text-base font-semibold text-gray-900 mb-2">Trust</h3>
                <p className="text-sm text-gray-600">Building unbreakable trust through transparency, security, and accountability in every transaction.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <FiUsers className="w-8 h-8 mx-auto text-color-b mb-3" />
                <h3 className="text-base font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-sm text-gray-600">Fostering a vibrant ecosystem where creators and investors can connect and thrive together.</p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Why Choose LAWATA?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<FiCpu className="w-6 h-6 text-gray-600" />}
                title="AI Risk Intelligence"
                description="Advanced algorithms analyze project viability, market trends, and creator credibility to provide accurate risk assessments."
              />
              <FeatureCard
                icon={<FiPackage className="w-6 h-6 text-gray-600" />}
                title="Milestone Escrow"
                description="Funds are released progressively as projects achieve predetermined milestones, ensuring accountability."
              />
              <FeatureCard
                icon={<FiShield className="w-6 h-6 text-gray-600" />}
                title="Investor Protection"
                description="Comprehensive refund policies and project monitoring ensure your investment is protected."
              />
              <FeatureCard
                icon={<FiTrendingUp className="w-6 h-6 text-gray-600" />}
                title="Real-time Analytics"
                description="Live project tracking, funding progress, and market insights to help you make informed investment decisions."
              />
              <FeatureCard
                icon={<FiUsers className="w-6 h-6 text-gray-600" />}
                title="Community Driven"
                description="Connect with like-minded creators and investors in a thriving ecosystem of innovation and collaboration."
              />
              <FeatureCard
                icon={<FiCheckCircle className="w-6 h-6 text-gray-600" />}
                title="Transparent Reporting"
                description="Complete project transparency with detailed progress reports, budget breakdowns, and milestone achievements."
              />
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Meet the Team</h2>
              <p className="text-gray-600 mt-2">The visionaries behind LAWATA's mission to revolutionize crowdfunding.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <TeamMemberCard
                name="Sarah Johnson"
                role="Chief Executive Officer"
                description="15+ years in fintech innovation, former VP at major crowdfunding platforms."
              />
              <TeamMemberCard
                name="Michael Chen"
                role="Chief Technology Officer"
                description="AI/ML expert with a PhD in Computer Science and a passion for blockchain technology."
              />
              <TeamMemberCard
                name="Emily Rodriguez"
                role="Chief Financial Officer"
                description="Former investment banker with expertise in risk assessment and portfolio management."
              />
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Ready to Start?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Join thousands of creators and investors who are already building the future with LAWATA.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/create"
                className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all text-sm"
              >
                Launch Your Project
              </Link>
              <Link 
                to="/browse"
                className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all text-sm"
              >
                Explore Projects
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-800 transition-all duration-200">
    <div className="flex items-start gap-4">
      <div className="bg-gray-100 p-2 rounded-lg mt-1">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

const TeamMemberCard = ({ name, role, description }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-gray-800 transition-all duration-200">
    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
      <FiBriefcase className="w-8 h-8 text-gray-600" />
    </div>
    <h3 className="text-base font-semibold text-gray-900">{name}</h3>
    <p className="text-color-b text-sm font-medium mb-2">{role}</p>
    <p className="text-xs text-gray-600">{description}</p>
  </div>
);

export default AboutNew;
