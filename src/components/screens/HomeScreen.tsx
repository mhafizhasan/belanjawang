
import { Receipt, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Expense, Member } from '../../lib/types';

interface HomeScreenProps {
    expenses: Expense[];
    members: Member[];
    selectedDate: Date;
    onMonthChange: (direction: 'prev' | 'next') => void;
    onExpenseClick: (expense: Expense) => void;
    onViewAll: () => void;
}

export default function HomeScreen({ expenses, members, selectedDate, onMonthChange, onExpenseClick, onViewAll }: HomeScreenProps) {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const memberTotals = expenses.reduce((acc, exp) => {
        acc[exp.member_name] = (acc[exp.member_name] || 0) + exp.amount;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="flex-1 overflow-y-auto pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => onMonthChange('prev')} className="text-blue-100 hover:text-white transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-1">Family Expenses</h1>
                        <p className="text-blue-100 text-sm">
                            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <button onClick={() => onMonthChange('next')} className="text-blue-100 hover:text-white transition-colors">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
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
                    <p className="text-2xl font-bold text-green-900">{members.length}</p>
                    <p className="text-xs text-green-600">Active Members</p>
                </div>
            </div>

            {/* Recent Expenses */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-gray-800">Recent Expenses</h2>
                    <button onClick={onViewAll} className="text-sm text-blue-600 font-medium">View All</button>
                </div>
                <div className="space-y-2">
                    {expenses.slice(0, 5).map(expense => (
                        <div
                            key={expense.id}
                            onClick={() => onExpenseClick(expense)}
                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:scale-95 transition-transform"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-gray-800">{expense.category}</span>
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{expense.member_name}</span>
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
}
