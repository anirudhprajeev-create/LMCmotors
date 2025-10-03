
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KeyRound } from 'lucide-react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const auth = getAuth(app);
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed.');
        }
    };

    return (
        <div className="container flex min-h-[80vh] items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Admin Login</CardTitle>
                    <CardDescription>Sign in with your admin email and password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>Login Failed</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full"><KeyRound className="mr-2 h-4 w-4" /> Login</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
