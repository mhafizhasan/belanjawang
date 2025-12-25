
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Expense } from '../../lib/types';

interface AnalyticsScreenProps {
    expenses: Expense[];
    selectedDate: Date;
    onMonthChange: (direction: 'prev' | 'next') => void;
}

export default function AnalyticsScreen({ expenses, selectedDate, onMonthChange }: AnalyticsScreenProps) {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const categoryTotals = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {} as Record<string, number>);

    const memberTotals = expenses.reduce((acc, exp) => {
        acc[exp.member_name] = (acc[exp.member_name] || 0) + exp.amount;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="flex-1 overflow-y-auto pb-20">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-b-3xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => onMonthChange('prev')} className="text-purple-100 hover:text-white transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-1">Analytics</h1>
                        <p className="text-purple-100 text-sm">
                            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <button onClick={() => onMonthChange('next')} className="text-purple-100 hover:text-white transition-colors">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
                    <p className="text-purple-100 text-sm mb-1">Total Expenses</p>
                    <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* By Category */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-3">By Category</h3>
                    <div className="space-y-3">
                        {Object.entries(categoryTotals)
                            .sort(([, a], [, b]) => b - a)
                            .map(([category, amount]) => {
                                const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
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
                        {Object.entries(memberTotals)
                            .sort(([, a], [, b]) => b - a)
                            .map(([member, amount]) => {
                                const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
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
}
