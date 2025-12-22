import React, { useState } from 'react';
import { PlusCircle, TrendingUp, Users, Calendar, DollarSign, Home, Receipt, Settings, X, Check } from 'lucide-react';

export default function FamilyExpenseTracker() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [expenses, setExpenses] = useState([
    { id: 1, member: 'John', category: 'Groceries', amount: 125.50, date: '2024-12-18', note: 'Weekly shopping' },
    { id: 2, member: 'Sarah', category: 'Utilities', amount: 89.00, date: '2024-12-17', note: 'Electric bill' },
    { id: 3, member: 'John', category: 'Transport', amount: 45.00, date: '2024-12-17', note: 'Gas' },
    { id: 4, member: 'Emma', category: 'Entertainment', amount: 60.00, date: '2024-12-16', note: 'Movie night' },
  ]);

  const [newExpense, setNewExpense] = useState({
    member: '',
    category: '',
    amount: '',
    note: ''
  });

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Member'
  });

  const categories = ['Groceries', 'Utilities', 'Transport', 'Entertainment', 'Healthcare', 'Education', 'Other'];
  const [members, setMembers] = useState(['John', 'Sarah', 'Emma']);

  const addExpense = () => {
    if (newExpense.member && newExpense.category && newExpense.amount) {
      const expense = {
        id: expenses.length + 1,
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        date: new Date().toISOString().split('T')[0]
      };
      setExpenses([expense, ...expenses]);
      setNewExpense({ member: '', category: '', amount: '', note: '' });
      setShowAddExpense(false);
    }
  };

  const addMember = () => {
    if (newMember.name.trim()) {
      setMembers([...members, newMember.name.trim()]);
      setNewMember({ name: '', email: '', role: 'Member' });
      setShowAddMember(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const memberTotals = expenses.reduce((acc, exp) => {
    acc[exp.member] = (acc[exp.member] || 0) + exp.amount;
    return acc;
  }, {});

  // Home Screen
  const HomeScreen = () => (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Family Expenses</h1>
        <p className="text-blue-100 text-sm mb-4">December 2024</p>
        <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-3">
          <p className="text-blue-100 text-sm mb-1">Total This Month</p>
          <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(memberTotals).map(([member, amount]) => (
            <div key={member} className="bg-white/10 backdrop-blur rounded-lg p-2">
              <p className="text-blue-100 text-xs mb-0.5">{member}</p>
              <p className="text-white font-semibold text-sm">${amount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Receipt className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-900">{expenses.length}</p>
          <p className="text-xs text-purple-600">Transactions</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">{Object.keys(memberTotals).length}</p>
          <p className="text-xs text-green-600">Active Members</p>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">Recent Expenses</h2>
          <button className="text-sm text-blue-600 font-medium">View All</button>
        </div>
        <div className="space-y-2">
          {expenses.slice(0, 5).map(expense => (
            <div key={expense.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-800">{expense.category}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{expense.member}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{expense.note}</p>
                  <p className="text-xs text-gray-400">{expense.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${expense.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Analytics Screen
  const AnalyticsScreen = () => (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Analytics</h1>
        <p className="text-purple-100 text-sm">Monthly breakdown</p>
      </div>

      <div className="p-4 space-y-4">
        {/* By Category */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">By Category</h3>
          <div className="space-y-3">
            {Object.entries(categoryTotals).map(([category, amount]) => {
              const percentage = (amount / totalExpenses) * 100;
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{category}</span>
                    <span className="font-semibold text-gray-900">${amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Member */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">By Member</h3>
          <div className="space-y-3">
            {Object.entries(memberTotals).map(([member, amount]) => {
              const percentage = (amount / totalExpenses) * 100;
              return (
                <div key={member}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{member}</span>
                    <span className="font-semibold text-gray-900">${amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // Members Screen
  const MembersScreen = () => (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Family Members</h1>
        <p className="text-green-100 text-sm">Manage family access</p>
      </div>

      <div className="p-4 space-y-3">
        {members.map((member, idx) => (
          <div key={member} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-purple-500' : 'bg-pink-500'
                }`}>
                  {member[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{member}</p>
                  <p className="text-sm text-gray-500">${(memberTotals[member] || 0).toFixed(2)} spent</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        
        <button className="w-full bg-green-50 border-2 border-dashed border-green-300 rounded-xl p-4 text-green-600 font-medium hover:bg-green-100 transition-colors"
          onClick={() => setShowAddMember(true)}>
          + Add Family Member
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative">
      {/* Main Content */}
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'analytics' && <AnalyticsScreen />}
      {currentScreen === 'members' && <MembersScreen />}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add Expense</h2>
              <button onClick={() => setShowAddExpense(false)} className="text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Who paid?</label>
                <div className="grid grid-cols-3 gap-2">
                  {members.map(member => (
                    <button
                      key={member}
                      onClick={() => setNewExpense({...newExpense, member})}
                      className={`p-3 rounded-xl border-2 font-medium transition-all ${
                        newExpense.member === member
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {member}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Note (optional)</label>
                <input
                  type="text"
                  value={newExpense.note}
                  onChange={(e) => setNewExpense({...newExpense, note: e.target.value})}
                  placeholder="What was this for?"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                onClick={addExpense}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add Family Member</h2>
              <button onClick={() => setShowAddMember(false)} className="text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  placeholder="Enter member name"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email (optional)</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="member@example.com"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Admins can manage family members and settings</p>
              </div>

              <button
                onClick={addMember}
                disabled={!newMember.name.trim()}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddExpense(true)}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 max-w-md mx-auto">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'home' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => setCurrentScreen('analytics')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'analytics' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-medium">Analytics</span>
          </button>
          <button
            onClick={() => setCurrentScreen('members')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'members' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs font-medium">Members</span>
          </button>
        </div>
      </div>
    </div>
  );
}