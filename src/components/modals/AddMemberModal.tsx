import { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { Member } from '../../lib/types';

interface AddMemberModalProps {
    onClose: () => void;
    onAdd: (member: Omit<Member, 'id' | 'created_at' | 'user_id'>) => void;
}

export default function AddMemberModal({ onClose, onAdd }: AddMemberModalProps) {
    const [newMember, setNewMember] = useState({
        name: '',
        email: '',
        role: 'Member' as 'Member' | 'Admin'
    });

    const handleSubmit = () => {
        if (newMember.name.trim()) {
            onAdd({
                name: newMember.name.trim(),
                email: newMember.email,
                role: newMember.role
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Add Family Member</h2>
                    <button onClick={onClose} className="text-gray-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                        <input
                            type="text"
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            placeholder="Enter member name"
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email (optional)</label>
                        <input
                            type="email"
                            value={newMember.email}
                            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                            placeholder="member@example.com"
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select
                            value={newMember.role}
                            onChange={(e) => setNewMember({ ...newMember, role: e.target.value as 'Member' | 'Admin' })}
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                        >
                            <option value="Member">Member</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Admins can manage family members and settings</p>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!newMember.name.trim()}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Check className="w-5 h-5" />
                        Add Member
                    </button>
                </div>
            </div>
        </div>
    );
}
