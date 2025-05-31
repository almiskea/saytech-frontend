import { useLanguage } from '../../App';
import { motion } from 'framer-motion';
import { Button, Card, CardHeader, CardTitle, CardContent } from '../common/ui-utils';
import { Store } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { cn } from '../../utils/helpers';
import { Tag, ListFilter, FileText, Truck, Wrench, Send, Users, SmartphoneNfc, X, CheckCircle, Star, MessageSquare } from 'lucide-react';
import LoadingIndicator from '../common/LoadingIndicator';

// --- Page Components ---
const WelcomePage = ({ navigateTo }) => {
    const { t, language } = useLanguage();
    const [testimonials, setTestimonials] = useState([]);
    const [loadingTestimonials, setLoadingTestimonials] = useState(true);
    const [beforeAfterCases, setBeforeAfterCases] = useState([]);
    const [loadingBeforeAfter, setLoadingBeforeAfter] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                setLoadingTestimonials(true);
                const data = await api.getTestimonials();
                setTestimonials(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch testimonials:", error);
                setTestimonials([]);
            } finally {
                setLoadingTestimonials(false);
            }
        };

        const fetchBeforeAfter = async () => {
            try {
                setLoadingBeforeAfter(true);
                const data = await api.getBeforeAfterCases();
                setBeforeAfterCases(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch before/after cases:", error);
                setBeforeAfterCases([]);
            } finally {
                setLoadingBeforeAfter(false);
            }
        };

        fetchTestimonials();
        fetchBeforeAfter();
    }, []);


    return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
    >
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl shadow-2xl px-6">
            <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                className="text-5xl md:text-6xl font-extrabold"
            >
                {t('welcomeTitle').split(' ')[0]} <span className="text-blue-300">{t('welcomeTitle').split(' ')[1]}</span>
            </motion.h1>
            <motion.p 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
                className="text-xl md:text-2xl text-blue-100"
            >
                {t('welcomeSubtitle')}
            </motion.p>
            <motion.p 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
                className="text-md md:text-lg text-blue-200 max-w-2xl mx-auto"
            >
                {t('welcomeDescription')}
            </motion.p>
            <motion.p 
                 initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 120 }}
                className="text-md md:text-lg text-blue-100 font-semibold"
            >
                {t('welcomeCommitment')}
            </motion.p>
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 150 }}
            >
                <Button 
                    variant="ghost" 
                    size="lg" 
                    onClick={() => navigateTo('request')} 
                    className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-8 py-3 text-lg shadow-lg transform hover:scale-105 transition-transform duration-150 rounded-md"
                >
                    {t('getQuoteButton')}
                </Button>
            </motion.div>
            <div className="flex items-center justify-center gap-2 pt-6">
                <Store className="w-6 h-6 text-blue-300" />
                <a 
                    href="https://www.google.com/maps/search/?api=1&query=Saihat,Saudi+Arabia" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-200 font-semibold hover:text-white hover:underline"
                >
                    {t('ourLocation')}
                </a>
            </div>
        </section>

        {/* Pricing Offer Section */}
        <section className="py-12 px-4">
            <Card className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-6 md:p-8 text-center border-2 border-blue-500">
                <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl font-bold text-blue-600 flex items-center justify-center">
                        <Tag className={cn("w-8 h-8", language === 'ar' ? 'ml-3' : 'mr-3')} />
                        {t('pricingOfferTitle')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xl md:text-2xl text-gray-800 font-semibold mb-3">{t('pricingOfferText')}</p>
                    <p className="text-gray-600 text-sm">{t('pricingOfferDetails')}</p>
                </CardContent>
            </Card>
        </section>

         {/* Our Process Section */}
        <section className="py-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 flex items-center justify-center">
                <ListFilter className={cn("w-10 h-10 text-blue-600", language === 'ar' ? 'ml-3' : 'mr-3')} />
                {t('ourProcessTitle')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-8">
                {[
                    { icon: <FileText className="w-12 h-12 text-blue-500 mb-4"/>, titleKey: "processStep1Title", descKey: "processStep1Desc" },
                    { icon: <Truck className="w-12 h-12 text-blue-500 mb-4"/>, titleKey: "processStep2Title", descKey: "processStep2Desc" },
                    { icon: <Wrench className="w-12 h-12 text-blue-500 mb-4"/>, titleKey: "processStep3Title", descKey: "processStep3Desc" },
                    { icon: <Send className="w-12 h-12 text-blue-500 mb-4"/>, titleKey: "processStep4Title", descKey: "processStep4Desc" }
                ].map((step, index) => (
                    <motion.div
                        key={step.titleKey}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: index * 0.15 }}
                        className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center"
                    >
                        {step.icon}
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{t(step.titleKey)}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{t(step.descKey)}</p>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* Our Expertise Section */}
        <section className="py-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 flex items-center justify-center">
                <Wrench className={cn("w-10 h-10 text-blue-600", language === 'ar' ? 'ml-3' : 'mr-3')} />
                {t('ourExpertiseTitle')}
            </h2>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl overflow-hidden">
                <img 
                    src="https://placehold.co/1200x600/3B82F6/FFFFFF?text=Expert+Technician+Analyzing+Device&font=lato" 
                    alt={t('expertAtWorkAlt')} 
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x600/CCCCCC/FFFFFF?text=Image+Not+Available'; }}
                />
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 bg-gray-50 rounded-xl shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 flex items-center justify-center">
                <Users className={cn("w-10 h-10 text-blue-600", language === 'ar' ? 'ml-3' : 'mr-3')} />
                {t('testimonialsTitle')}
            </h2>
            {loadingTestimonials ? (
                <LoadingIndicator message={t('loadingTestimonials')} />
            ) : (
                <div className="flex overflow-x-auto space-x-4 md:space-x-8 pb-6 px-4 md:px-8 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100">
                    {testimonials.map((testimonial, index) => (
                        <motion.div 
                            key={testimonial.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col flex-shrink-0 w-80 md:w-96"
                        >
                            <div className="flex items-center mb-4">
                                <img src={testimonial.avatar} alt={t(testimonial.nameKey)} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" />
                                <div className={cn("flex-1", language === 'ar' ? 'mr-4' : 'ml-4')}>
                                    <h3 className="text-lg font-semibold text-gray-900">{t(testimonial.nameKey)}</h3>
                                    <p className="text-sm text-blue-600">{t(testimonial.deviceKey)}</p>
                                </div>
                            </div>
                            <MessageSquare className={cn("w-8 h-8 text-blue-200 mb-2", language === 'ar' ? 'self-end' : 'self-start')} />
                            <p className="text-gray-600 italic flex-grow text-sm leading-relaxed">"{t(testimonial.quoteKey)}"</p>
                            <div className="mt-4 flex">
                                {[...Array(testimonial.rating || 5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>

        {/* Before & After Section */}
        <section className="py-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 flex items-center justify-center">
                <SmartphoneNfc className={cn("w-10 h-10 text-blue-600", language === 'ar' ? 'ml-3' : 'mr-3')} />
                {t('beforeAfterTitle')}
            </h2>
            {loadingBeforeAfter ? (
                <LoadingIndicator message={t('loadingBeforeAfter')} />
            ) : (
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-8">
                    {beforeAfterCases.map((bAc, index) => (
                        <motion.div 
                            key={bAc.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="bg-white rounded-xl shadow-xl overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-red-600 mb-3 flex items-center">
                                        <X className={cn("w-6 h-6", language === 'ar' ? 'ml-2' : 'mr-2')} />
                                        {t(bAc.beforeTitleKey)}
                                    </h3>
                                    <img 
                                        src={bAc.beforeImage}
                                        alt={t(bAc.beforeImageAltKey)} 
                                        className="w-full h-48 object-contain rounded-md mb-3 bg-gray-100 p-2"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/CCCCCC/FFFFFF?text=Image+Error'; }}
                                    />
                                    <p className="text-gray-600 text-sm">{t(bAc.beforeDescriptionKey)}</p>
                                </div>
                                <div className="p-6 bg-green-50">
                                    <h3 className="text-xl font-semibold text-green-600 mb-3 flex items-center">
                                        <CheckCircle className={cn("w-6 h-6", language === 'ar' ? 'ml-2' : 'mr-2')} />
                                        {t(bAc.afterTitleKey)}
                                    </h3>
                                     <img 
                                        src={bAc.afterImage} 
                                        alt={t(bAc.afterImageAltKey)} 
                                        className="w-full h-48 object-contain rounded-md mb-3 bg-gray-100 p-2"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/CCCCCC/FFFFFF?text=Image+Error'; }}
                                    />
                                    <p className="text-gray-600 text-sm">{t(bAc.afterDescriptionKey)}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>

    </motion.div>
    );
};

export default WelcomePage;