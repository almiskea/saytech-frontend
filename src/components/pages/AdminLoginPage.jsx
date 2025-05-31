import { useLanguage } from '../../App';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../common/ui-utils';
import { Input } from '../common/ui-utils';
import { Label } from '../common/ui-utils';
import { Button } from '../common/ui-utils';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';
import api from '../../services/api';
import Message from '../common/Message';
import { Lock } from 'lucide-react';
import { Store } from 'lucide-react';

const AdminLoginPage = ({ onLoginSuccess, navigateTo }) => {
    const { t, language } = useLanguage();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.loginAdmin(username, password);
            if (response.success) {
                onLoginSuccess(response.token);
                navigateTo('adminDashboard');
            } else {
                setError(response.message || t('loginFailedText'));
            }
        } catch (err) {
            setError(err.message || t('errorGenericTitle'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto mt-10"
        >
            <Card className="shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">{t('adminLoginTitle')}</CardTitle>
                    <Store className="w-12 h-12 text-blue-600 mx-auto mt-2" />
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="username">{t('usernameLabel')}</Label>
                            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t('usernamePlaceholder')} className="mt-1" autoFocus />
                        </div>
                        <div>
                            <Label htmlFor="password">{t('passwordLabel')}</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('passwordPlaceholder')} className="mt-1" />
                        </div>
                        {error && <Message type="error" message={error} />}
                        <Button type="submit" className="w-full text-lg py-3" disabled={loading} size="lg">
                            {loading ? <><Loader2 className={cn("h-5 w-5 animate-spin", language==='ar' ? 'ml-2' : 'mr-2')} /> {t('loggingInButton')}</> : <><Lock className={cn("h-5 w-5", language==='ar' ? 'ml-2' : 'mr-2')} /> {t('loginButton')}</>}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AdminLoginPage;