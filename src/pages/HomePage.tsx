import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Sparkles, Users, Calendar, Trophy, MessageCircle, ArrowRight, Star, Zap } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-200 via-white to-purple-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full z-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-indigo-600 animate-pulse" />
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                CampusConnect
              </span>
            </div>
            <div className="flex space-x-4">
              <Link to="/auth">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block animate-bounce mb-4">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              <Star className="h-4 w-4 mr-2" /> New Features Released!
            </span>
          </div>
          <h1 className="text-6xl sm:text-7xl font-bold mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            Your Campus Life,
            <br />
            Leveled Up! 🚀
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who are already connecting, sharing, and growing together on the most exciting campus platform!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline" className="group">
                See Features
                <Zap className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/30 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="10K+" label="Active Students" />
            <StatCard number="50+" label="Universities" />
            <StatCard number="1000+" label="Events Hosted" />
            <StatCard number="100K+" label="Messages Sent" />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
          <p className="text-xl text-gray-600">Discover all the amazing features that make CampusConnect unique</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Users className="h-8 w-8 text-indigo-600" />}
            title="Connect with Peers"
            description="Find and connect with students who share your interests and academic goals."
          />
          <FeatureCard 
            icon={<Calendar className="h-8 w-8 text-indigo-600" />}
            title="Campus Events"
            description="Never miss out on important events. Stay updated with our smart calendar."
          />
          <FeatureCard 
            icon={<Trophy className="h-8 w-8 text-indigo-600" />}
            title="Earn & Compete"
            description="Level up your profile, earn badges, and compete on leaderboards."
          />
          <FeatureCard 
            icon={<MessageCircle className="h-8 w-8 text-indigo-600" />}
            title="Real-time Chat"
            description="Instant messaging with classmates and group chats for team projects."
          />
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-gradient-to-b from-white/50 to-indigo-50/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Join Your Fellow Students</h2>
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&h=150&fit=crop&crop=faces" alt="Student 1" className="w-16 h-16 rounded-full ring-4 ring-white shadow-lg transform hover:scale-110 transition-transform" />
            <img src="https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=150&h=150&fit=crop&crop=faces" alt="Student 2" className="w-16 h-16 rounded-full ring-4 ring-white shadow-lg transform hover:scale-110 transition-transform" />
            <img src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=150&h=150&fit=crop&crop=faces" alt="Student 3" className="w-16 h-16 rounded-full ring-4 ring-white shadow-lg transform hover:scale-110 transition-transform" />
            <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=faces" alt="Student 4" className="w-16 h-16 rounded-full ring-4 ring-white shadow-lg transform hover:scale-110 transition-transform" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TestimonialCard
              text="CampusConnect has completely transformed how I interact with my classmates. The events feature is amazing!"
              name="Alex Chen"
              role="Computer Science, '24"
              image="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces"
            />
            <TestimonialCard
              text="I love how easy it is to find study groups and connect with other students in my major. Game changer!"
              name="Sarah Johnson"
              role="Business Admin, '25"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces"
            />
            <TestimonialCard
              text="The gamification makes networking actually fun! I've earned so many badges and met amazing people."
              name="Miguel Rodriguez"
              role="Engineering, '23"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to Transform Your Campus Experience?</h2>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
              Join CampusConnect Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="mb-4 transform hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StatCard = ({ number, label }: { number: string, label: string }) => (
  <div className="group">
    <div className="text-4xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform">
      {number}
    </div>
    <div className="text-gray-600">{label}</div>
  </div>
);

const TestimonialCard = ({ text, name, role, image }: { text: string, name: string, role: string, image: string }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
    <p className="text-gray-600 mb-4 italic">"{text}"</p>
    <div className="flex items-center">
      <img src={image} alt={name} className="w-12 h-12 rounded-full mr-4" />
      <div>
        <div className="font-semibold text-gray-900">{name}</div>
        <div className="text-sm text-gray-600">{role}</div>
      </div>
    </div>
  </div>
);

export default HomePage;