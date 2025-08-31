import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageProvider';
import { Button, Input, Textarea, Label, Card, CardHeader, CardTitle, CardContent } from '../common/ui-utils';
import Message from '../common/Message';
import { cn } from '../../utils/helpers';

const ContactUsPage = () => {
    const { t, language } = useLanguage();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [formState, setFormState] = useState({ loading: false, error: null, success: null });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormState({ loading: true, error: null, success: null });
        try {
            // This is a placeholder for the API call.
            // You would replace this with a real API endpoint.
            await new Promise(resolve => setTimeout(resolve, 1500));
            // const response = await api.sendContactMessage(formData);
            console.log('Form submitted:', formData);
            setFormState({ loading: false, error: null, success: t('messageSentSuccess') });
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            setFormState({ loading: false, error: t('messageSentError'), success: null });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900">{t('contactUsTitle')}</h1>
                <p className="mt-2 text-lg text-gray-600">{t('contactUsSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Mail className={cn("h-6 w-6 text-blue-600", language === 'ar' ? 'ml-2' : 'mr-2')} />
                            {t('contactFormTitle')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">{t('nameLabel')}</Label>
                                <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <Label htmlFor="email">{t('emailLabel')}</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <Label htmlFor="message">{t('messageLabel')}</Label>
                                <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows="5" />
                            </div>
                            <div>
                                <Button type="submit" className="w-full" disabled={formState.loading}>
                                    {formState.loading ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('sendingMessage')}</>
                                    ) : (
                                        <><Send className="mr-2 h-4 w-4" /> {t('sendMessageButton')}</>
                                    )}
                                </Button>
                            </div>
                        </form>
                        {formState.success && <Message type="success" message={formState.success} />}
                        {formState.error && <Message type="error" message={formState.error} />}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Phone className={cn("h-6 w-6 text-blue-600", language === 'ar' ? 'ml-2' : 'mr-2')} />
                                {t('contactInfoTitle')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-700">
                            <p className="flex items-center"><Mail className="mr-2 h-5 w-5 text-gray-500" /> info@say.tech</p>
                            <p className="flex items-center"><Phone className="mr-2 h-5 w-5 text-gray-500" /> +966 55 555 5555</p>
                            <p className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-gray-500" /> {t('contactAddress')}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MapPin className={cn("h-6 w-6 text-blue-600", language === 'ar' ? 'ml-2' : 'mr-2')} />
                                {t('ourLocation')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.537524806933!2d46.675296515000005!3d24.70825498412594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f038d8a0a0a0b%3A0x1b1b1b1b1b1b1b1b!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1620826058341!5m2!1sen!2sus"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Google Maps Location"
                                ></iframe>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};

export default ContactUsPage;
