import React from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    Heart, 
    Target, 
    Shield, 
    Award, 
    Lightbulb,
    CheckCircle,
    Star
} from 'lucide-react';

// Simple UI components
const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 pt-0 ${className}`}>
        {children}
    </div>
);

const AboutUsPage = ({ navigateTo, t, language }) => {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto space-y-12"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    {t('aboutUsTitle')}
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    {t('aboutUsSubtitle')}
                </p>
            </motion.div>

            {/* Our Story Section */}
            <motion.section variants={itemVariants}>
                <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                        <div className="flex items-center space-x-4">
                            <Users className="h-8 w-8" />
                            <h2 className="text-3xl font-bold">{t('ourStoryTitle')}</h2>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    {t('ourStoryParagraph1')}
                                </p>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    {t('ourStoryParagraph2')}
                                </p>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    {t('ourStoryParagraph3')}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    {t('companyHighlights')}
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-gray-700">{t('highlight1')}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-gray-700">{t('highlight2')}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-gray-700">{t('highlight3')}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-gray-700">{t('highlight4')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.section>

            {/* Our Values Section */}
            <motion.section variants={itemVariants}>
                <Card>
                    <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                        <div className="flex items-center space-x-4">
                            <Heart className="h-8 w-8" />
                            <h2 className="text-3xl font-bold">{t('ourValuesTitle')}</h2>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {t('value1Title')}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {t('value1Description')}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {t('value2Title')}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {t('value2Description')}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lightbulb className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {t('value3Title')}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {t('value3Description')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.section>

            {/* Our Mission Section */}
            <motion.section variants={itemVariants}>
                <Card>
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                        <div className="flex items-center space-x-4">
                            <Target className="h-8 w-8" />
                            <h2 className="text-3xl font-bold">{t('ourMissionTitle')}</h2>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-6">
                                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                                    {t('missionStatement')}
                                </p>
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {t('missionGoalsTitle')}
                                    </h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-start space-x-3">
                                            <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{t('missionGoal1')}</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{t('missionGoal2')}</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{t('missionGoal3')}</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{t('missionGoal4')}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                                    {t('whyChooseUsTitle')}
                                </h3>
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-600">99%</div>
                                        <div className="text-sm text-gray-600">{t('successRate')}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">24/7</div>
                                        <div className="text-sm text-gray-600">{t('supportAvailable')}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600">5+</div>
                                        <div className="text-sm text-gray-600">{t('yearsExperience')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.section>

            {/* Call to Action */}
            <motion.section variants={itemVariants} className="text-center">
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <CardContent className="p-8">
                        <h3 className="text-2xl font-bold mb-4">
                            {t('readyToRecover')}
                        </h3>
                        <p className="text-lg mb-6 opacity-90">
                            {t('readyToRecoverSubtext')}
                        </p>
                        <button
                            onClick={() => navigateTo('request')}
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            {t('startRecoveryButton')}
                        </button>
                    </CardContent>
                </Card>
            </motion.section>
        </motion.div>
    );
};

export default AboutUsPage;
