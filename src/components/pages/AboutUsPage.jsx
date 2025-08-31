import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageProvider';
import { Building, Users, Target } from 'lucide-react';

const AboutUsPage = () => {
    const { t } = useLanguage();

    const features = [
        {
            icon: <Building className="h-10 w-10 text-blue-500" />,
            title: t('aboutFeature1Title'),
            description: t('aboutFeature1Desc'),
        },
        {
            icon: <Users className="h-10 w-10 text-blue-500" />,
            title: t('aboutFeature2Title'),
            description: t('aboutFeature2Desc'),
        },
        {
            icon: <Target className="h-10 w-10 text-blue-500" />,
            title: t('aboutFeature3Title'),
            description: t('aboutFeature3Desc'),
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
        >
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('aboutTitle')}</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('aboutSubtitle')}</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">{t('aboutOurStoryTitle')}</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    {t('aboutOurStoryP1')}
                </p>
                <p className="text-gray-700 leading-relaxed">
                    {t('aboutOurStoryP2')}
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center mb-12">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <div className="flex justify-center mb-4">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                    </motion.div>
                ))}
            </div>

            <div className="text-center">
                 <h2 className="text-3xl font-semibold text-gray-800 mb-6">{t('aboutJoinUsTitle')}</h2>
                 <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    {t('aboutJoinUsDesc')}
                </p>
            </div>
        </motion.div>
    );
};

export default AboutUsPage;
