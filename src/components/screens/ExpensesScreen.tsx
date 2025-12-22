import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import type { Expense } from '../../lib/types';

interface ExpensesScreenProps {
    expenses: Expense[];
    selectedDate: Date;
    onMonthChange: (direction: 'prev' | 'next') => void;
    onBack: () => void;
    onExpenseClick: (expense: Expense) => void;
}

export default function ExpensesScreen({
    expenses,
    selectedDate,
    onMonthChange,
    onBack,
    onExpenseClick
}: ExpensesScreenProps) {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
        <div className="flex-1 overflow-y-auto pb-20 bg-gray-50 h-full">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm">
                <div className="p-4 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">All Expenses</h1>
                    <div className="w-9" /> {/* Spacer for centering */}
                </div>

                {/* Month Navigation */}
                <div className="px-4 pb-4">
                    <div className="bg-gray-100 rounded-xl p-2 flex items-center justify-between">
                        <button
                            onClick={() => onMonthChange('prev')}
                            className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-gray-800">
                                {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </p>
                            <p className="text-xs text-gray-500">
                                Total: ${totalExpenses.toFixed(2)}
                            </p>
                        </div>
                        <button
                            onClick={() => onMonthChange('next')}
                            className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Expenses List */}
            <div className="p-4 space-y-3">
                {expenses.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-400">No expenses for this month.</p>
                    </div>
                ) : (
                    expenses.map(expense => (
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
                    ))
                )}
            </div>
        </div>
    );
}
