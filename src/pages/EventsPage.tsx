import React from 'react';
import { Calendar, Plus, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';

const EventsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Campus Events</h1>
          <Button className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <Button variant="outline">
              <Calendar className="h-5 w-5 mr-2" />
              Filter by Date
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventCard
            title="Tech Startup Workshop"
            date="March 15, 2024"
            time="2:00 PM - 4:00 PM"
            location="Innovation Hub"
            image="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=500"
            attendees={42}
          />
          <EventCard
            title="Career Fair 2024"
            date="March 20, 2024"
            time="10:00 AM - 5:00 PM"
            location="Main Campus Hall"
            image="https://images.unsplash.com/photo-1511578314322-379afb476865?w=500"
            attendees={156}
          />
          <EventCard
            title="Cultural Festival"
            date="April 1, 2024"
            time="11:00 AM - 8:00 PM"
            location="Campus Square"
            image="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500"
            attendees={89}
          />
        </div>
      </div>
    </div>
  );
};

const EventCard = ({ 
  title, 
  date, 
  time, 
  location, 
  image, 
  attendees 
}: { 
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  attendees: number;
}) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <div className="space-y-2 text-gray-600">
        <p>{date}</p>
        <p>{time}</p>
        <p>{location}</p>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">{attendees} attending</span>
        <Button size="sm">Join Event</Button>
      </div>
    </div>
  </div>
);

export default EventsPage;