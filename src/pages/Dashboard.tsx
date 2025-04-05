import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">CampusConnect</h1>
          <Button onClick={handleSignOut} variant="outline">
            Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Welcome, {user.email}</h2>
          <p className="mt-2 text-gray-600">Your dashboard is being set up...</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;