
'use client';
import { useActionState } from 'react';
import { login } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from '@/components/submit-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KeyRound } from 'lucide-react';

export default function LoginPage() {
    const initialState = { message: null, errors: {} };
    const [state, formAction] = useActionState(login, initialState);

    return (
        <div className="container flex min-h-[80vh] items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Admin Login</CardTitle>
                    <CardDescription>Enter the password to access the dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                            {state?.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
                        </div>
                        
                        {state?.message && (
                            <Alert variant="destructive">
                                <AlertTitle>Login Failed</AlertTitle>
                                <AlertDescription>{state.message}</AlertDescription>
                            </Alert>
                        )}
                        
                        <SubmitButton label="Login" icon={<KeyRound className="mr-2 h-4 w-4" />} />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
