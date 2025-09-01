import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageProvider';
import { Button, Card, CardHeader, CardTitle, CardContent } from '../common/ui-utils';
import { cn } from '../../utils/helpers';

const ContactUsPage = () => {
    const { t, language } = useLanguage();

    const handleWhatsAppClick = () => {
        window.open(`https://wa.me/966547399661`, '_blank');
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
                            <MessageCircle className={cn("h-6 w-6 text-green-600", language === 'ar' ? 'ml-2' : 'mr-2')} />
                            {t('contactWhatsApp')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">{t('contactUsSubtitle')}</p>
                        <Button onClick={handleWhatsAppClick} className="w-full bg-green-500 hover:bg-green-600">
                            <MessageCircle className="mr-2 h-4 w-4" /> {t('contactWhatsApp')}
                        </Button>
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
                            <p className="flex items-center"><Phone className="mr-2 h-5 w-5 text-gray-500" /> {t('contactPhone')}</p>
                            <p className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-gray-500" /> {t('contactAddress')}</p>
                            <p className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-gray-500" /> {t('contactPOBox')}</p>
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
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.681111694335!2d49.9925590760911!3d26.14159297711465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e49ffb60ba21ba1%3A0x78e98bd9c127ba12!2siProfessional%20Workshop!5e0!3m2!1sen!2ssa!4v1725224488393!5m2!1sen!2ssa"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Google Maps Location"
                                    referrerpolicy="no-referrer-when-downgrade"
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
