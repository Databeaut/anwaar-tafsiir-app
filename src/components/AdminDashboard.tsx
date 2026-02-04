import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Search, Loader2, LogOut, Key, Send, MessageCircle, Users, BookOpen, Trophy, Unlock, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const StudentAccessRow = ({
    k,
    sendToWhatsApp,
    handleDelete,
    onAccessUpdate
}: {
    k: AccessKey;
    sendToWhatsApp: (k: AccessKey) => void;
    handleDelete: (id: string) => void;
    onAccessUpdate: () => void;
}) => {
    const [selectedSurah, setSelectedSurah] = useState<number>(114);
    const [isUpdating, setIsUpdating] = useState(false);
    const { toast } = useToast();

    // Check if currently unlocked
    const isUnlocked = k.student_surah_access?.some(r => r.surah_id === selectedSurah && r.is_unlocked) || false;

    const handleToggleAccess = async () => {
        setIsUpdating(true);
        // Toggle Logic: If unlocked, set to false. If locked, set to true.
        const newState = !isUnlocked;

        const { error } = await supabase.from('student_surah_access').upsert({
            student_key_id: k.id,
            surah_id: selectedSurah,
            is_unlocked: newState
        }, { onConflict: 'student_key_id, surah_id' });

        if (error) {
            toast({ title: "Error", description: "Failed to update access", variant: "destructive" });
        } else {
            toast({
                title: newState ? "Unlocked" : "Locked",
                description: `Surah ${selectedSurah} access ${newState ? 'granted' : 'revoked'}.`,
                variant: newState ? "default" : "destructive"
            });
            onAccessUpdate(); // Refresh parent data
        }
        setIsUpdating(false);
    };

    return (
        <TableRow className="border-white/5 hover:bg-white/[0.02] flex flex-col p-4 gap-3 bg-white/[0.01]">
            <div className="flex justify-between items-start">
                <div>
                    <div className="font-medium text-white text-base">{k.student_name}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{k.access_code}</div>
                </div>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => sendToWhatsApp(k)}
                        className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10"
                        title="Send via WhatsApp"
                    >
                        <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(k.id)}
                        className="h-8 w-8 text-red-400 hover:bg-red-500/10"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Access Control */}
            <div className="flex items-center gap-2 mt-1 bg-black/20 p-2 rounded-lg border border-white/5">
                <select
                    className="bg-[#0f0f0f] text-xs text-gray-300 border border-white/10 rounded px-2 py-1 focus:ring-1 focus:ring-emerald-500 outline-none h-7 flex-1"
                    value={selectedSurah}
                    onChange={(e) => setSelectedSurah(Number(e.target.value))}
                >
                    <option value="113">Surah Al-Falaq (113)</option>
                    <option value="114">Surah An-Naas (114)</option>
                    <option value="1">Surah Al-Fatiha (1)</option>
                </select>

                <Button
                    size="sm"
                    className={`h-7 px-2 text-xs border transition-colors group relative overflow-hidden ${isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30'
                        : 'bg-red-500/10 text-gray-400 border-red-500/10 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30'
                        }`}
                    onClick={handleToggleAccess}
                    disabled={isUpdating}
                    title={isUnlocked ? "Click to Lock" : "Click to Unlock"}
                >
                    {isUpdating ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : isUnlocked ? (
                        <>
                            <Unlock className="w-3 h-3 mr-1" />
                            <span className="hidden group-hover:inline ml-1 font-bold">LOCK</span>
                        </>
                    ) : (
                        <>
                            <Lock className="w-3 h-3 mr-1" />
                            <span>Locked</span>
                        </>
                    )}
                </Button>
            </div>

            <div className="text-[10px] text-gray-600 font-mono text-right">
                Created: {new Date(k.created_at).toLocaleDateString()}
            </div>
        </TableRow>
    );
};

const AdminDashboard = () => {
    const [keys, setKeys] = useState<AccessKey[]>([]);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [studentName, setStudentName] = useState('');
    const [phone, setPhone] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const { toast } = useToast();

    // 1. Fetch Data
    const fetchData = async () => {
        setLoading(true);

        // Fetch Keys with access data
        const { data: keysData, error: keysError } = await supabase
            .from('access_keys')
            .select('*, student_surah_access(surah_id, is_unlocked)')
            .order('created_at', { ascending: false });

        if (keysError) {
            console.error(keysError);
            toast({ title: "Error", description: "Failed to fetch keys", variant: "destructive" });
        } else {
            setKeys(keysData as unknown as AccessKey[] || []);
        }

        // Fetch Stats
        const { data: statsData, error: statsError } = await supabase.rpc('get_admin_stats');

        if (statsError) {
            console.error('Stats Error:', statsError);
        } else if (statsData) {
            setStats(statsData as unknown as AdminStats);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Generate Key
    const handleGenerate = async () => {
        if (!studentName.trim() || !phone.trim()) {
            toast({ title: "Validation Error", description: "Name and Phone are required", variant: "destructive" });
            return;
        }

        setIsGenerating(true);

        // Generate branded code: ANWAAR + 4 digits
        const newCode = "ANWAAR" + Math.floor(1000 + Math.random() * 9000).toString();

        const { error } = await supabase.from('access_keys').insert([
            {
                student_name: studentName,
                phone: phone,
                access_code: newCode,
                is_active: true
            }
        ]);

        if (error) {
            toast({ title: "Error", description: "Failed to create key", variant: "destructive" });
        } else {
            toast({ title: "Success", description: `Key ${newCode} created successfully!` });
            setStudentName('');
            setPhone('');
            fetchData(); // Refresh all
        }
        setIsGenerating(false);
    };

    // 3. Delete Key
    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this access key?")) return;

        const { error } = await supabase.from('access_keys').delete().eq('id', id);
        if (error) {
            toast({ title: "Error", description: "Failed to delete key", variant: "destructive" });
        } else {
            toast({ title: "Deleted", description: "Key has been removed" });
            fetchData();
        }
    };

    // 4. Logout Helper
    const handleLogout = () => {
        localStorage.removeItem("anwaar_admin_session");
        window.location.reload();
    };

    // 5. Send to WhatsApp
    const sendToWhatsApp = (key: AccessKey) => {
        if (!key.phone) {
            toast({ title: "No Phone", description: "This student has no phone number.", variant: "destructive" });
            return;
        }

        const cleanPhone = key.phone.replace(/\D/g, ''); // Remove non-digits
        const message = `Asalaamu Calaykum ${key.student_name}, your access key is: *${key.access_code}*. Login here: ${window.location.origin}`;
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');
    };

    // Filter Logic
    const filteredKeys = keys.filter(k =>
        k.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (k.phone && k.phone.includes(searchTerm)) ||
        k.access_code.includes(searchTerm)
    );

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Anwaar Command Center
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Analytics & Access Management
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 gap-2"
                >
                    <LogOut size={16} />
                    Logout
                </Button>
            </div>

            {/* ANALYTICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Students */}
                <Card className="bg-[#121212] border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="pt-6 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-muted-foreground text-sm font-medium">Total Students</span>
                            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">
                            {stats?.total_students || 0}
                        </div>
                        <p className="text-xs text-emerald-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active Learners
                        </p>
                    </CardContent>
                </Card>

                {/* Lessons Completed */}
                <Card className="bg-[#121212] border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="pt-6 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-muted-foreground text-sm font-medium">Lessons Completed</span>
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                <BookOpen className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">
                            {stats?.lessons_completed || 0}
                        </div>
                        <p className="text-xs text-blue-400">Total video engagements</p>
                    </CardContent>
                </Card>

                {/* Top Performer (Stats Placeholder) */}
                <Card className="bg-[#121212] border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="pt-6 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-muted-foreground text-sm font-medium">Top Performer</span>
                            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                                <Trophy className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1 truncate">
                            {stats?.top_students?.[0]?.student_name || "N/A"}
                        </div>
                        <p className="text-xs text-amber-500">
                            {stats?.top_students?.[0]?.points || 0} XP
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Leaderboard & Chart Placeholder */}
                <div className="lg:col-span-2 space-y-8">

                    {/* LEADERBOARD */}
                    <Card className="bg-[#121212] border-white/10">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <CardTitle className="text-white flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-amber-500" />
                                Top Students
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-white/5">
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="text-gray-400 pl-6 h-10">Rank</TableHead>
                                        <TableHead className="text-gray-400 h-10">Student</TableHead>
                                        <TableHead className="text-right text-gray-400 pr-6 h-10">Points</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats?.top_students?.map((student, idx) => (
                                        <TableRow key={idx} className="border-white/5 hover:bg-white/[0.02]">
                                            <TableCell className="pl-6 font-mono text-xs text-muted-foreground">#{idx + 1}</TableCell>
                                            <TableCell className="font-medium text-gray-200">{student.student_name}</TableCell>
                                            <TableCell className="text-right pr-6 font-mono text-emerald-500">{student.points}</TableCell>
                                        </TableRow>
                                    ))}
                                    {(!stats?.top_students || stats.top_students.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No data yet</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* KEY GENERATOR */}
                    <Card className="bg-[#121212] border-emerald-500/30 shadow-lg shadow-emerald-900/10">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <CardTitle className="text-emerald-400 flex items-center gap-2 text-lg">
                                <Key className="w-5 h-5" />
                                Generate Access Key
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Student Name</label>
                                    <Input
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        placeholder="e.g. Ahmed Omar"
                                        className="bg-black/40 border-white/10 text-white focus:border-emerald-500/50 transition-colors"
                                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Phone Number</label>
                                    <Input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="252..."
                                        className="bg-black/40 border-white/10 text-white focus:border-emerald-500/50 transition-colors"
                                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 tracking-wide shadow-md transition-all active:scale-[0.99]"
                            >
                                {isGenerating ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin w-4 h-4" /> Creating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Send className="w-4 h-4" /> Create & Grant Access
                                    </span>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Database Search */}
                <div className="lg:col-span-1">
                    <Card className="bg-[#121212] border-white/10 h-full flex flex-col">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <div className="flex flex-col gap-4">
                                <CardTitle className="text-gray-200 text-lg">Key Database</CardTitle>
                                <div className="relative w-full">
                                    <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                                    <Input
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 bg-black/40 border-white/10 text-white h-9 focus:ring-1 focus:ring-emerald-500/50"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-auto max-h-[600px]">
                            <Table>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell className="text-center py-8 text-muted-foreground"><Loader2 className="animate-spin inline mr-2" />Loading...</TableCell>
                                        </TableRow>
                                    ) : filteredKeys.length === 0 ? (
                                        <TableRow>
                                            <TableCell className="text-center py-8 text-muted-foreground">No keys found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredKeys.map((k) => (
                                            <StudentAccessRow
                                                key={k.id}
                                                k={k}
                                                sendToWhatsApp={sendToWhatsApp}
                                                handleDelete={handleDelete}
                                                onAccessUpdate={fetchData}
                                            />
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
