export interface Member {
    id: number;
    user_id: string;
    name: string;
    email?: string;
    role: 'Member' | 'Admin';
    created_at?: string;
}

export interface Expense {
    id: number;
    user_id: string;
    member_id: number;
    member_name: string; // Denormalized for simpler display or could be joined
    category: string;
    amount: number;
    date: string;
    note?: string;
    created_at?: string;
}

export type Database = {
    public: {
        Tables: {
            members: {
                Row: Member;
                Insert: Omit<Member, 'id' | 'created_at'>;
                Update: Partial<Omit<Member, 'id' | 'created_at'>>;
            };
            expenses: {
                Row: Expense;
                Insert: Omit<Expense, 'id' | 'created_at'>;
                Update: Partial<Omit<Expense, 'id' | 'created_at'>>;
            };
        };
    };
};
