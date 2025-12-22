import { useState, useEffect } from 'react';
import { Home, TrendingUp, Users, PlusCircle } from 'lucide-react';
import HomeScreen from './components/screens/HomeScreen';
import AnalyticsScreen from './components/screens/AnalyticsScreen';
import MembersScreen from './components/screens/MembersScreen';
import ExpensesScreen from './components/screens/ExpensesScreen';
import AuthScreen from './components/screens/AuthScreen';
import ExpenseModal from './components/modals/ExpenseModal';
import AddMemberModal from './components/modals/AddMemberModal';
import { supabase } from './lib/supabase';
import type { Expense, Member } from './lib/types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchData(selectedDate);
      else setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData(selectedDate);
    });
  }, []);

  useEffect(() => {
    if (session) fetchData(selectedDate);
  }, [selectedDate, session]);

  const fetchData = async (date: Date) => {
    try {
      setLoading(true);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();

      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('id', { ascending: true });

      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (membersError) throw membersError;
      if (expensesError) throw expensesError;

      if (membersData) setMembers(membersData);
      if (expensesData) setExpenses(expensesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback/Mock data if Supabase fails (e.g. invalid credentials)
      // so the UI is visible for demonstration
      if (members.length === 0) {
        // Keep empty or add mock if desired
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleSaveExpense = async (expense: { id?: number; member_id: number; member_name: string; category: string; amount: number; note: string; date: string }) => {
    try {
      if (expense.id) {
        // Update existing
        // @ts-ignore
        const { error } = await (supabase
          .from('expenses') as any)
          .update({
            member_id: expense.member_id,
            member_name: expense.member_name,
            category: expense.category,
            amount: expense.amount,
            note: expense.note,
            date: expense.date
          } as any)
          .eq('id', expense.id);

        if (error) throw error;
      } else {
        // Insert new
        // @ts-ignore
        const { error } = await (supabase
          .from('expenses') as any)
          .insert([{
            member_id: expense.member_id,
            member_name: expense.member_name,
            category: expense.category,
            amount: expense.amount,
            note: expense.note,
            date: expense.date,
            user_id: session?.user?.id
          }] as any);

        if (error) throw error;
      }

      fetchData(selectedDate);
      setShowExpenseModal(false);
      setEditingExpense(undefined);

    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error saving expense. Check console.');
    }
  };

  const handleDeleteExpense = async (expenseId: number) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;

      fetchData(selectedDate);
      setShowExpenseModal(false);
      setEditingExpense(undefined);
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Error deleting expense. Check console.');
    }
  };

  const handleAddMember = async (member: Omit<Member, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const { data, error } = await (supabase
        .from('members') as any)
        .insert([{ ...member, user_id: session?.user?.id }] as any)
        .select();

      if (error) throw error;

      if (data) {
        setMembers([...members, data[0]]);
        setShowAddMember(false);
      }
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Error saving member. Check console.');
    }
  };

  const handleDeleteMember = async (memberId: number) => {
    try {
      const adminMember = members.find(m => m.role === 'Admin');
      const targetMember = members.find(m => m.id === memberId);

      if (!adminMember) throw new Error('No Admin found to reassign expenses to.');
      if (!targetMember) throw new Error('Member not found.');
      if (targetMember.role === 'Admin') {
        alert('Cannot remove the main Admin account.');
        return;
      }

      const confirmDelete = window.confirm(
        `Are you sure you want to remove ${targetMember.name}? All their expenses will be moved to ${adminMember.name}.`
      );
      if (!confirmDelete) return;

      // 1. Reassign expenses to Admin
      // @ts-ignore
      const { error: updateError } = await (supabase
        .from('expenses') as any)
        .update({
          member_id: adminMember.id,
          member_name: adminMember.name, // Important to update denormalized name
        })
        .eq('member_id', memberId);

      if (updateError) throw updateError;

      // 2. Delete the member
      const { error: deleteError } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId);

      if (deleteError) throw deleteError;

      // 3. Update UI
      fetchData(selectedDate);
    } catch (error: any) {
      console.error('Error deleting member:', error);
      alert(`Error reducing family: ${error.message}`);
    }
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  if (loading && expenses.length === 0 && members.length === 0) {
    return <div className="h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative shadow-2xl">
      {/* Main Content */}
      {currentScreen === 'home' && (
        <HomeScreen
          expenses={expenses}
          members={members}
          selectedDate={selectedDate}
          onMonthChange={handleMonthChange}
          onExpenseClick={(expense) => {
            setEditingExpense(expense);
            setShowExpenseModal(true);
          }}
          onViewAll={() => setCurrentScreen('expenses')}
        />
      )}
      {currentScreen === 'expenses' && (
        <ExpensesScreen
          expenses={expenses}
          selectedDate={selectedDate}
          onMonthChange={handleMonthChange}
          onBack={() => setCurrentScreen('home')}
          onExpenseClick={(expense) => {
            setEditingExpense(expense);
            setShowExpenseModal(true);
          }}
        />
      )}
      {currentScreen === 'analytics' && (
        <AnalyticsScreen
          expenses={expenses}
          selectedDate={selectedDate}
          onMonthChange={handleMonthChange}
        />
      )}
      {currentScreen === 'members' && (
        <MembersScreen
          members={members}
          expenses={expenses}
          onAddMember={() => setShowAddMember(true)}
          onDeleteMember={handleDeleteMember}
        />
      )}

      {/* Modals */}
      {showExpenseModal && (
        <ExpenseModal
          members={members}
          selectedDate={selectedDate}
          expense={editingExpense}
          onClose={() => {
            setShowExpenseModal(false);
            setEditingExpense(undefined);
          }}
          onSave={handleSaveExpense}
          onDelete={handleDeleteExpense}
        />
      )}

      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onAdd={handleAddMember}
        />
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setEditingExpense(undefined);
          setShowExpenseModal(true);
        }}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
        style={{ right: 'max(1.5rem, calc(50% - 224px + 1.5rem))' }} // Keep inside max-w-md
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 max-w-md mx-auto z-40">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentScreen === 'home' ? 'text-blue-600' : 'text-gray-400'
              }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => setCurrentScreen('analytics')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentScreen === 'analytics' ? 'text-blue-600' : 'text-gray-400'
              }`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-medium">Analytics</span>
          </button>
          <button
            onClick={() => setCurrentScreen('members')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentScreen === 'members' ? 'text-blue-600' : 'text-gray-400'
              }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs font-medium">Members</span>
          </button>

          <button
            onClick={handleSignOut}
            className={`flex flex-col items-center gap-1 transition-colors text-gray-400 hover:text-red-500`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out w-6 h-6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
            <span className="text-xs font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
