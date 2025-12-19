import { Link } from 'react-router-dom';
import { Users, Layers, Receipt, DollarSign, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const features = [
    {
      title: 'Manage Users',
      description: 'Create and view users in the system',
      icon: Users,
      link: '/users',
      color: 'bg-blue-500',
    },
    {
      title: 'Create Groups',
      description: 'Organize expenses by creating groups',
      icon: Layers,
      link: '/groups',
      color: 'bg-green-500',
    },
    {
      title: 'Add Expenses',
      description: 'Track shared expenses with flexible split options',
      icon: Receipt,
      link: '/expenses',
      color: 'bg-orange-500',
    },
    {
      title: 'View Balances',
      description: 'See who owes you and who you owe',
      icon: DollarSign,
      link: '/balances',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to SplitApp
        </h1>
        <p className="text-lg text-gray-600">
          Simplify expense sharing with friends and groups
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.title}
              to={feature.link}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200 hover:border-gray-300"
            >
              <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="flex items-center text-blue-600 font-medium">
                Get started
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-blue-600 mb-3">
              1
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Create a Group</h3>
            <p className="text-gray-700">
              Add members who will share expenses together
            </p>
          </div>
          <div>
            <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-blue-600 mb-3">
              2
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Add Expenses</h3>
            <p className="text-gray-700">
              Record expenses and choose how to split them
            </p>
          </div>
          <div>
            <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-blue-600 mb-3">
              3
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Settle Up</h3>
            <p className="text-gray-700">
              Track balances and settle dues with ease
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
