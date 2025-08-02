import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListFilter, FileText, Truck, Wrench, Send, Users, MessageSquare, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageProvider';
import api from '../../services/api';
import { Button } from '../common/ui-utils';
import LoadingIndicator from '../common/LoadingIndicator';
import { cn } from '../../utils/helpers';

const WelcomePage = ({ navigateTo }) => {
    const { t, language } = useLanguage();
    const [testimonials, setTestimonials] = useState([]);
    const [loadingTestimonials, setLoadingTestimonials] = useState(true);

    useEffect(() => { 
        api.getTestimonials().then(d => setTestimonials(Array.isArray(d) ? d : [])).catch(e => console.error(e)).finally(() => setLoadingTestimonials(false)); 
        api.getBeforeAfterCases().then(d => { /* Handled elsewhere or deprecated */ }).catch(e => console.error(e)); 
    }, []);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 sm:space-y-12">
            <section className="text-center space-y-4 sm:space-y-6 py-8 sm:py-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl shadow-2xl px-4 sm:px-6">
                <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 120 }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">{t('welcomeTitle').split(' ')[0]} <span className="text-blue-300">{t('welcomeTitle').split(' ')[1]}</span></motion.h1><motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 120 }} className="text-lg sm:text-xl md:text-2xl text-blue-100">{t('welcomeSubtitle')}</motion.p><motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, type: "spring", stiffness: 120 }} className="text-sm sm:text-base md:text-lg text-blue-200 max-w-2xl mx-auto px-2">{t('welcomeDescription')}</motion.p><motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1, type: "spring", stiffness: 150 }}><Button variant="ghost" size="lg" onClick={() => navigateTo('request')} className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg shadow-lg transform hover:scale-105 transition-transform duration-150 rounded-md">{t('getQuoteButton')}</Button></motion.div>
            </section>
            <section className="py-8 sm:py-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12 flex items-center justify-center gap-2 px-4"><ListFilter className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" /><span>{t('ourProcessTitle')}</span></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 md:px-8">
                    {[
                        { icon: <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mb-3 sm:mb-4"/>, titleKey: "processStep1Title", descKey: "processStep1Desc" }, 
                        { icon: <Truck className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mb-3 sm:mb-4"/>, titleKey: "processStep2Title", descKey: "processStep2Desc" }, 
                        { icon: <Wrench className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mb-3 sm:mb-4"/>, titleKey: "processStep3Title", descKey: "processStep3Desc" }, 
                        { icon: <Send className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mb-3 sm:mb-4"/>, titleKey: "processStep4Title", descKey: "processStep4Desc" }
                    ].map((step, index) => (
                        <motion.div key={step.titleKey} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: index * 0.15 }} className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center flex flex-col items-center">
                            {step.icon}
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{t(step.titleKey)}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{t(step.descKey)}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
            <section className="py-8 sm:py-12 bg-gray-50 rounded-xl shadow-lg">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12 flex items-center justify-center gap-2 px-4"><Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" /><span>{t('testimonialsTitle')}</span></h2>
                {loadingTestimonials ? <LoadingIndicator message={t('loadingTestimonials')} /> : <div className="flex overflow-x-auto space-x-4 pb-4 sm:pb-6 px-4 md:px-8 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100">{testimonials.map((testimonial, index) => (<motion.div key={testimonial.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.1 }} className="bg-white p-4 sm:p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col flex-shrink-0 w-72 sm:w-80 md:w-96"><div className="flex items-center mb-3 sm:mb-4"><img src={testimonial.avatar} alt={t(testimonial.nameKey)} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-500" /><div className={cn("flex-1", language === 'ar' ? 'mr-3 sm:mr-4' : 'ml-3 sm:ml-4')}><h3 className="text-base sm:text-lg font-semibold text-gray-900">{t(testimonial.nameKey)}</h3><p className="text-xs sm:text-sm text-blue-600">{t(testimonial.deviceKey)}</p></div></div><MessageSquare className={cn("w-6 h-6 sm:w-8 sm:h-8 text-blue-200 mb-2", language === 'ar' ? 'self-end' : 'self-start')} /><p className="text-gray-600 italic flex-grow text-xs sm:text-sm leading-relaxed">"{t(testimonial.quoteKey)}"</p><div className="mt-3 sm:mt-4 flex">{[...Array(testimonial.rating || 5)].map((_, i) => <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />)}</div></motion.div>))}</div>}
            </section>
        </motion.div>
    );
};

export default WelcomePage;
