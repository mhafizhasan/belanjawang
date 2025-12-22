
import { Settings } from 'lucide-react';
import type { Member, Expense } from '../../lib/types';

interface MembersScreenProps {
    members: Member[];
    expenses: Expense[];
    onAddMember: () => void;
}

export default function MembersScreen({ members, expenses, onAddMember }: MembersScreenProps) {
    const memberTotals = expenses.reduce((acc, exp) => {
        acc[exp.member_name] = (acc[exp.member_name] || 0) + exp.amount;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="flex-1 overflow-y-auto pb-20">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-b-3xl shadow-lg">
                <h1 className="text-2xl font-bold mb-2">Family Members</h1>
                <p className="text-green-100 text-sm">Manage family access</p>
            </div>

            <div className="p-4 space-y-3">
                {members.map((member, idx) => (
                    <div key={member.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${idx % 3 === 0 ? 'bg-blue-500' : idx % 3 === 1 ? 'bg-purple-500' : 'bg-pink-500'
                                    }`}>
                                    {member.name[0]}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{member.name}</p>
                                    <p className="text-sm text-gray-500">${(memberTotals[member.name] || 0).toFixed(2)} spent</p>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                <button className="w-full bg-green-50 border-2 border-dashed border-green-300 rounded-xl p-4 text-green-600 font-medium hover:bg-green-100 transition-colors"
                    onClick={onAddMember}>
                    + Add Family Member
                </button>
            </div>
        </div>
    );
}
