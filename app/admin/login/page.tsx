
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KeyRound } from 'lucide-react';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
    const handleGoogleLogin = async () => {
        setError('');
        try {
            const auth = getAuth(app);
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.message || 'Google login failed.');
        }
    };
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
                        <Button type="submit" className="w-full mb-2"><KeyRound className="mr-2 h-4 w-4" /> Login</Button>
                        <Button type="button" className="w-full" variant="outline" onClick={handleGoogleLogin}>
                            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.19C12.13 13.7 17.57 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.74H24v9.04h12.39c-.53 2.84-2.13 5.24-4.54 6.87l7.02 5.46C43.98 37.36 46.1 31.36 46.1 24.5z"/><path fill="#FBBC05" d="M9.67 28.28c-1.13-3.36-1.13-6.98 0-10.34l-7.98-6.19C-1.13 17.18-1.13 31.82 1.69 39.91l7.98-6.19z"/><path fill="#EA4335" d="M24 46c6.18 0 11.64-2.36 15.85-6.5l-7.02-5.46c-2.01 1.35-4.6 2.13-8.83 2.13-6.43 0-11.87-4.2-13.33-9.78l-7.98 6.19C6.73 42.18 14.82 46 24 46z"/></g></svg>
                            Sign in with Google
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
