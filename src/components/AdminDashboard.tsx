import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
    Trash2, Search, Loader2, LogOut, Key, Send,
    MessageCircle, Users, BookOpen, Trophy, Unlock, Lock,
    Plus, UserPlus, Phone, CheckCircle2, XCircle, MoreHorizontal,
    Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// --- TYPES ---
interface AccessRecord {
    surah_id: number;
    is_unlocked: boolean;
}

interface AccessKey {
    id: string;
    access_code: string;
    student_name: string;
    phone: string | null;
    is_active: boolean;
    created_at: string;
    student_surah_access: AccessRecord[];
}

interface AdminStats {
    total_students: number;
    lessons_completed: number;
    top_students: {
        student_name: string;
        points: number;
        last_active: string;
    }[];
}

// --- CONSTANTS ---
import { surahManifest } from '@/data/surah-manifest';

// --- CONSTANTS ---
const LESSONS = surahManifest
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(surah => ({
        id: surah.id,
        label: `Lesson ${surah.displayOrder}: ${surah.nameSomali.replace('Surah ', '')}`
    }));

const AdminDashboard = () => {
    // Data State
    const [keys, setKeys] = useState<AccessKey[]>([]);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [bulkActionLesson, setBulkActionLesson] = useState<number>(114);
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);

    // Form State
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentPhone, setNewStudentPhone] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const { toast } = useToast();

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // Fetch Keys
            const { data: keysData, error: keysError } = await supabase
                .from('access_keys')
                .select('*, student_surah_access(surah_id, is_unlocked)')
                .order('created_at', { ascending: false });

            if (keysError) {
                console.error(keysError);
                toast({ title: "Error", description: "Failed to fetch student data", variant: "destructive" });
            } else {
                setKeys(keysData as unknown as AccessKey[] || []);
            }

            // Fetch Stats
            const { data: statsData } = await supabase.rpc('get_admin_stats');
            if (statsData) setStats(statsData as unknown as AdminStats);

            setLoading(false);
        };
        fetchData();
    }, [refreshTrigger]);

    // --- ACTIONS ---

    const handleCreateKey = async () => {
        if (!newStudentName.trim() || !newStudentPhone.trim()) {
            toast({ title: "Validation Error", description: "Name and Phone are required", variant: "destructive" });
            return;
        }

        setIsGenerating(true);
        const newCode = "ANWAAR" + Math.floor(1000 + Math.random() * 9000).toString();

        const { error } = await supabase.from('access_keys').insert([{
            student_name: newStudentName,
            phone: newStudentPhone,
            access_code: newCode,
            is_active: true
        }]);

        if (error) {
            toast({ title: "Error", description: "Failed to create key", variant: "destructive" });
        } else {
            toast({ title: "Success", description: `Student ${newStudentName} created!` });
            setIsCreateModalOpen(false);
            setNewStudentName('');
            setNewStudentPhone('');
            setRefreshTrigger(prev => prev + 1);
        }
        setIsGenerating(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This action is irreversible.")) return;
        const { error } = await supabase.from('access_keys').delete().eq('id', id);
        if (!error) {
            toast({ title: "Deleted", description: "Student record removed." });
            setRefreshTrigger(prev => prev + 1);
            // Remove from selection if present
            const newSet = new Set(selectedIds);
            newSet.delete(id);
            setSelectedIds(newSet);
        }
    };

    const handleToggleAccess = async (studentId: string, surahId: number, currentStatus: boolean) => {
        const newState = !currentStatus;
        const { error } = await supabase.from('student_surah_access').upsert({
            student_key_id: studentId,
            surah_id: surahId,
            is_unlocked: newState
        }, { onConflict: 'student_key_id, surah_id' });

        if (!error) {
            toast({ title: newState ? "Unlocked" : "Locked", description: `Access updated.` });
            setRefreshTrigger(prev => prev + 1);
        }
    };

    const handleBulkUnlock = async () => {
        if (selectedIds.size === 0) return;
        setIsBulkProcessing(true);

        const updates = Array.from(selectedIds).map(studentId => ({
            student_key_id: studentId,
            surah_id: bulkActionLesson,
            is_unlocked: true
        }));

        const { error } = await supabase.from('student_surah_access').upsert(updates, { onConflict: 'student_key_id, surah_id' });

        if (error) {
            toast({ title: "Bulk Error", description: "Failed to update some records", variant: "destructive" });
        } else {
            toast({ title: "Bulk Success", description: `Unlocked Lesson for ${selectedIds.size} students.` });
            setRefreshTrigger(prev => prev + 1);
            setSelectedIds(new Set());
        }
        setIsBulkProcessing(false);
    };

    const sendWhatsApp = (key: AccessKey) => {
        if (!key.phone) return;
        const cleanPhone = key.phone.replace(/\D/g, '');
        const msg = `Asalaamu Calaykum ${key.student_name}, your Anwaar Access Code is: *${key.access_code}*. Login: ${window.location.origin}`;
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    // --- FILTERING ---
    const filteredKeys = keys.filter(k =>
        k.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.access_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (k.phone && k.phone.includes(searchTerm))
    );

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredKeys.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(filteredKeys.map(k => k.id)));
    };

    const handleLogout = () => {
        localStorage.removeItem("anwaar_admin_session");
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
            {/* --- TOP HEADER --- */}
            <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
                <div className="container max-w-[1600px] mx-auto h-16 flex items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <span className="font-bold text-white">A</span>
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                            Command Center
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-6 mr-4 text-sm text-zinc-400">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-emerald-500" />
                                <span>{stats?.total_students || 0} Students</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-500" />
                                <span>{stats?.lessons_completed || 0} Completions</span>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleLogout} className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container max-w-[1600px] mx-auto p-6 space-y-6">

                {/* --- TOOLBAR --- */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02] p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input
                            placeholder="Find student by name, code or phone..."
                            className="pl-10 bg-black/40 border-white/10 text-white focus:ring-emerald-500/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button onClick={() => setIsCreateModalOpen(true)} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
                            <UserPlus className="w-4 h-4 mr-2" />
                            New Student
                        </Button>
                    </div>
                </div>

                {/* --- BULK ACTIONS --- */}
                {selectedIds.size > 0 && (
                    <div className="sticky top-20 z-30 animate-in slide-in-from-top-4 fade-in duration-300">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-emerald-500 text-black font-bold h-6 px-3">{selectedIds.size} Selected</Badge>
                                <span className="text-sm text-emerald-200">Manage access for selected students</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    className="bg-black/40 border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-emerald-500/50"
                                    value={bulkActionLesson}
                                    onChange={(e) => setBulkActionLesson(Number(e.target.value))}
                                >
                                    {LESSONS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                                </select>
                                <Button
                                    size="sm"
                                    onClick={handleBulkUnlock}
                                    disabled={isBulkProcessing}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                                >
                                    {isBulkProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4 mr-2" />}
                                    Unlock All
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setSelectedIds(new Set())}
                                    className="text-zinc-400 hover:text-white"
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- DATA TABLE --- */}
                <div className="rounded-2xl border border-white/5 bg-black/20 backdrop-blur-sm overflow-hidden shadow-xl">
                    <Table>
                        <TableHeader className="bg-white/[0.02]">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={selectedIds.size === filteredKeys.length && filteredKeys.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                        className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                    />
                                </TableHead>
                                <TableHead className="text-zinc-400">Student Identity</TableHead>
                                <TableHead className="text-zinc-400">Contact</TableHead>
                                <TableHead className="text-zinc-400">Access Record</TableHead>
                                <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                        Loading Records...
                                    </TableCell>
                                </TableRow>
                            ) : filteredKeys.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                                        No students found matching "{searchTerm}"
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredKeys.map((student) => {
                                    const isSelected = selectedIds.has(student.id);
                                    return (
                                        <TableRow
                                            key={student.id}
                                            className={cn(
                                                "group border-white/5 transition-colors cursor-default",
                                                isSelected ? "bg-emerald-500/[0.03] hover:bg-emerald-500/[0.05]" : "hover:bg-white/[0.02]"
                                            )}
                                        >
                                            <TableCell>
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => toggleSelection(student.id)}
                                                    className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-zinc-200 text-base">{student.student_name}</span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Key className="w-3 h-3 text-emerald-500" />
                                                        <code className="text-xs font-mono text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded">{student.access_code}</code>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {student.phone ? (
                                                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                        <Phone className="w-3 h-3" />
                                                        {student.phone}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-zinc-700 italic">No phone</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {/* Access Grid - Only visible on hover/select or always visible but low contrast */}
                                                <div className="flex items-center gap-1.5">
                                                    {LESSONS.map(lesson => {
                                                        const hasAccess = student.student_surah_access?.some(r => r.surah_id === lesson.id && r.is_unlocked);
                                                        return (
                                                            <button
                                                                key={lesson.id}
                                                                onClick={() => handleToggleAccess(student.id, lesson.id, hasAccess || false)}
                                                                title={`${lesson.label}: ${hasAccess ? "Unlocked" : "Locked"}`}
                                                                className={cn(
                                                                    "w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-200",
                                                                    hasAccess
                                                                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400"
                                                                        : "bg-white/5 border-white/10 text-zinc-600 hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-500"
                                                                )}
                                                            >
                                                                {hasAccess ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => sendWhatsApp(student)}
                                                        className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
                                                        title="Send WhatsApp"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(student.id)}
                                                        className="h-8 w-8 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                                                        title="Delete Student"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </main>

            {/* --- CREATE STUDENT MODAL --- */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="bg-[#121212] border-white/10 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-emerald-500" />
                            Enroll New Student
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Create a new access key for a student to access the platform.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Student Name</label>
                            <Input
                                value={newStudentName}
                                onChange={(e) => setNewStudentName(e.target.value)}
                                placeholder="e.g. Abdullahi Ahmed"
                                className="bg-black/40 border-white/10 focus:border-emerald-500/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Phone Number (WhatsApp)</label>
                            <Input
                                value={newStudentPhone}
                                onChange={(e) => setNewStudentPhone(e.target.value)}
                                placeholder="e.g. 252..."
                                className="bg-black/40 border-white/10 focus:border-emerald-500/50"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="text-zinc-400 hover:text-white hover:bg-white/5">Cancel</Button>
                        <Button onClick={handleCreateKey} disabled={isGenerating} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Create Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminDashboard;
