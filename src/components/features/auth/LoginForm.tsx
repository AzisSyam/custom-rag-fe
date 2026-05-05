import React, { useState } from 'react';
import { TextField } from '../../common/TextField';
import { Button } from '../../common/Button';
import { ApiAuthRepository } from '../../../infrastructure/repositories/ApiAuthRepository';
import { LoginUseCase } from '../../../usecases/auth/LoginUseCase';
import '@material/web/textfield/outlined-text-field.js';
import Cookies from 'js-cookie';

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const repository = new ApiAuthRepository();
        const loginUseCase = new LoginUseCase(repository);

        try {
            const response = await loginUseCase.execute({ email, password });
            
            if (response.success) {
                // Save token to cookies for middleware support (server-side)
                Cookies.set('auth_token', response.data.token, { expires: 7, path: '/' });
                
                // Save user info to localStorage for client-side components
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                window.location.href = '/chat';
            }
        } catch (error: any) {
            console.error("Error Login:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
            <TextField
                type="email"
                placeholder="Enter your email"
                icon="mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
            />

            <TextField
                type="password"
                placeholder="Enter your password"
                icon="lock"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
            />

            {/* Forgot Password */}
            <div className="w-full flex justify-end mt-[-8px]">
                <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium px-2 py-1 rounded-md hover:bg-surface-container-low focus:outline-none">
                    Forgot Password?
                </a>
            </div>

            {/* Submit Button */}
            <Button
                variant="primary"
                size="lg"
                className="w-full mt-2 !rounded-full elevation-1"
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
        </form>
    );
};
