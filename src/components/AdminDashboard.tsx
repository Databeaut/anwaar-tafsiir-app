import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Search, RefreshCw, Loader2, LogOut, Key, Send, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccessKey {
    id: string;
    access_code: string;
    student_name: string;
    phone: string | null;
    is_active: boolean;
    created_at: string;
}

const AdminDashboard = () => {
    const [keys, setKeys] = useState<AccessKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [studentName, setStudentName] = useState('');
    const [phone, setPhone] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const { toast } = useToast();

    // 1. Fetch Data
    const fetchKeys = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('access_keys')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast({ title: "Error", description: "Failed to fetch keys", variant: "destructive" });
            console.error(error);
        } else {
            setKeys(data as AccessKey[] || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchKeys();
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
            fetchKeys(); // Refresh the list
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
            fetchKeys();
        }
    };

    // 4. Logout Helper
    const handleLogout = () => {
        localStorage.removeItem("anwaar_admin_session");
        window.location.reload(); // Force reload to trigger auth check in parent
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
        <div className="w-full max-w-4xl mx-auto space-y-8">

            {/* HEADER: Amber Title & Logout */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-amber-500 tracking-wide">
                        Anwaar Command Center
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Manage student access and licenses
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

            {/* SECTION 1: Generate Key (Top Card) */}
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

            {/* SECTION 2: Student Database (Bottom Card) */}
            <Card className="bg-[#121212] border-white/10">
                <CardHeader className="border-b border-white/5 pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <CardTitle className="text-gray-200 text-lg">Student Database</CardTitle>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                            <Input
                                placeholder="Search database..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-black/40 border-white/10 text-white h-9 focus:ring-1 focus:ring-emerald-500/50"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-gray-400 pl-6 h-12">Date Created</TableHead>
                                <TableHead className="text-gray-400 h-12">Student Name</TableHead>
                                <TableHead className="text-gray-400 h-12">Phone</TableHead>
                                <TableHead className="text-gray-400 h-12">Access Key</TableHead>
                                <TableHead className="text-right text-gray-400 pr-6 h-12">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="animate-spin w-5 h-5" /> Loading database...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredKeys.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-gray-500 border-none">
                                        No records found. Start by generating a key above.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredKeys.map((k) => (
                                    <TableRow key={k.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <TableCell className="text-gray-500 text-xs font-mono pl-6">
                                            {new Date(k.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-gray-200 font-medium">
                                            {k.student_name}
                                        </TableCell>
                                        <TableCell className="text-gray-400 text-sm">
                                            {k.phone || '-'}
                                        </TableCell>
                                        <TableCell className="text-emerald-500 font-mono font-bold tracking-wider text-sm">
                                            {k.access_code}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => sendToWhatsApp(k)}
                                                    className="text-gray-600 hover:text-emerald-400 hover:bg-emerald-900/10 transition-colors w-8 h-8"
                                                    title="Send via WhatsApp"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(k.id)}
                                                    className="text-gray-600 hover:text-red-400 hover:bg-red-900/10 transition-colors w-8 h-8"
                                                    title="Delete Key"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
};

export default AdminDashboard;
