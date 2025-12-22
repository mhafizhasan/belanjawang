import { useState, useEffect } from 'react';
import { X, DollarSign, Check, Trash2 } from 'lucide-react';
import type { Member, Expense } from '../../lib/types';

interface ExpenseModalProps {
    members: Member[];
    selectedDate: Date;
    expense?: Expense;
    onClose: () => void;
    onSave: (expense: { id?: number; member_id: number; member_name: string; category: string; amount: number; note: string; date: string }) => void;
    onDelete?: (expenseId: number) => void;
}

export default function ExpenseModal({ members, selectedDate, expense, onClose, onSave, onDelete }: ExpenseModalProps) {
    const [formData, setFormData] = useState({
        member_id: '',
        category: '',
        amount: '',
        note: ''
    });

    useEffect(() => {
        if (expense) {
            setFormData({
                member_id: expense.member_id.toString(),
                category: expense.category,
                amount: expense.amount.toString(),
                note: expense.note || ''
            });
        }
    }, [expense]);

    const categories = ['Meal', 'Groceries', 'Eco Shop', 'Transport', 'Entertainment', 'Education'];

    const handleSubmit = () => {
        if (formData.member_id && formData.category && formData.amount) {
            const selectedMember = members.find(m => m.id === parseInt(formData.member_id));
            if (!selectedMember) return;

            // Determine the date for the new expense if not editing
            let expenseDateString = '';

            if (expense) {
                // If editing, preserve original date by default
                // IMPROVEMENT: If we wanted to allow date editing, we would need a date picker.
                // For now, based on requirements, we just keep the date or use the original logic if it was missing.
                expenseDateString = expense.date;
            } else {
                const now = new Date();
                const year = selectedDate.getFullYear();
                const month = selectedDate.getMonth();

                let day = now.getDate();
                // Check if current day exceeds days in selected month
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                if (day > daysInMonth) {
                    day = daysInMonth;
                }

                const expenseDate = new Date(year, month, day);
                // timezone offset handling simple approach:
                expenseDateString = expenseDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
            }

            onSave({
                id: expense?.id,
                member_id: parseInt(formData.member_id),
                member_name: selectedMember.name,
                category: formData.category,
                amount: parseFloat(formData.amount),
                note: formData.note,
                date: expenseDateString
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        {expense ? 'Edit Expense' : 'Add Expense'}
                        {!expense && (
                            <span className="block text-sm font-normal text-gray-500 mt-1">
                                for {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </span>
                        )}
                    </h2>
                    <button onClick={onClose} className="text-gray-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Who paid?</label>
                        <div className="grid grid-cols-3 gap-2">
                            {members.map(member => (
                                <button
                                    key={member.id}
                                    onClick={() => setFormData({ ...formData, member_id: member.id.toString() })}
                                    className={`p-3 rounded-xl border-2 font-medium transition-all ${formData.member_id === member.id.toString()
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 text-gray-600'
                                        }`}
                                >
                                    {member.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Note (optional)</label>
                        <input
                            type="text"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            placeholder="What was this for?"
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex gap-3">
                        {expense && onDelete && (
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this expense?')) {
                                        onDelete(expense.id);
                                    }
                                }}
                                className="bg-red-50 text-red-600 p-4 rounded-xl hover:bg-red-100 transition-all flex items-center justify-center"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={handleSubmit}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            {expense ? 'Update Expense' : 'Add Expense'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
