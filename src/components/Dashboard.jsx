import React from "react";
import Chart from "./Chart";
import { ArrowLeftRight, Clock4, Wallet } from "lucide-react";

function Dashboard() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your financial overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">₹10,000</p>
            <p className="text-sm text-gray-500 mt-2">This month</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Savings</h3>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">₹1,00,000</p>
            <p className="text-sm text-green-600 mt-2">+12% from last month</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Expenses Overview</h3>
          <div className="h-80">
            <Chart />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <ArrowLeftRight className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sent to Mother</p>
                    <p className="text-sm text-gray-500">2 days ago</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">₹10,000</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Bills</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Clock4 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Broadband Bill</p>
                    <p className="text-sm text-red-600">Due in 3 days</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">₹1,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;