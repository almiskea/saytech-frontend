import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   Phone, Mail, MessageCircle, Store, Globe, Loader2, X,
   Lock, CheckCircle, KeyRound, CreditCard, UploadCloud, FileCheck2, Tag, ListFilter, 
   FileText, Truck, Wrench, Send, Users, SmartphoneNfc, Star, Check, ChevronUp, ChevronDown,
   AlertCircle, ShieldCheck, MessageSquare, User, AtSign, ExternalLink
} from 'lucide-react';
import api from './services/api';
import { Auth0Provider, useAuth0 } from './context/Auth0Provider';
import AdminDashboardPage from './components/pages/AdminDashboardPage';
import AboutUsPage from './components/pages/AboutUsPage';
// --- Utility Functions ---
const cn = (...inputs) => inputs.filter(Boolean).join(' ');

// --- Translations ---
const translations = {
    en: {
        // Navbar
        navHome: "Home",
        navNewRequest: "New Request",
        navCheckStatus: "Check Status",
        navAboutUs: "About Us",
        navAdminDashboard: "Dashboard",
        navAdminLogin: "Admin",
        navLogout: "Logout",
        languageSwitch: "العربية",
        previousPage: "Previous",
        nextPage: "Next",

        // Welcome Page
        welcomeTitle: "Say Tech",
        welcomeSubtitle: "Your Trusted Data Recovery Experts",
        welcomeDescription: "Located in Saihat, Saudi Arabia, we specialize in recovering precious data from iPhones. Our lead technician brings 14 years of experience in aviation mechanics and electricity, ensuring meticulous care and expertise for your device.",
        welcomeCommitment: "We understand the value of your data and are committed to delivering it back to you safely.",
        getQuoteButton: "Get Your Data Back",
        ourLocation: "Our Location: Saihat, Saudi Arabia",
        ourExpertiseTitle: "Our Expertise in Action",
        expertAtWorkAlt: "Technician carefully working on data recovery from a smartphone.",
        testimonialsTitle: "What Our Customers Say",
        loadingTestimonials: "Loading testimonials...",
        testimonial1Name: "Ahmed Al-Mansoori", 
        testimonial1Quote: "Say Tech recovered all my precious family photos from my broken iPhone! I thought they were lost forever. Amazing service and very professional.",
        testimonial1Device: "iPhone 13 Pro",
        testimonial2Name: "Fatima Al-Zahrani",
        testimonial2Quote: "My business data was on my water-damaged phone. Say Tech saved the day! Quick turnaround and excellent communication throughout the process.",
        testimonial2Device: "iPhone 12",
        testimonial3Name: "John D.",
        testimonial3Quote: "Incredible skill! They managed to retrieve data from a phone other shops said was unrecoverable. Highly recommended!",
        testimonial3Device: "iPhone X",
        beforeAfterTitle: "From Broken to Recovered",
        loadingBeforeAfter: "Loading recovery examples...",
        beforeTitle: "Before: Data Seemed Lost",
        beforeDescription1: "A severely damaged iPhone, unresponsive and seemingly beyond repair. Precious memories and important files trapped inside.",
        beforeImageAlt1: "Severely damaged smartphone with cracked screen.",
        afterTitle: "After: Data Successfully Retrieved!",
        afterDescription1: "Thanks to Say Tech's expertise, all critical data was recovered, bringing relief and joy to the owner.",
        afterImageAlt1: "Smartphone displaying a success message or recovered files.",
        beforeDescription2: "Water-damaged device, refusing to power on. Critical business contacts and project files were at stake.",
        beforeImageAlt2: "Smartphone with signs of water damage.",
        afterDescription2: "Say Tech's meticulous work brought the data back, ensuring business continuity.",
        afterImageAlt2: "Smartphone showing a list of recovered contacts or files.",
        pricingOfferTitle: "Transparent Pricing",
        pricingOfferText: "Recover your precious data for 2000 Saudi Riyals, plus shipping costs (both ways).",
        pricingOfferDetails: "This flat rate covers most common iPhone data recovery scenarios. Complex cases may require a custom quote after initial evaluation. Contact us for more details.",
        ourProcessTitle: "Our Simple Recovery Process",
        processStep1Title: "1. Submit & Pay",
        processStep1Desc: "Fill out our secure online form with your device details and complete the initial payment.",
        processStep2Title: "2. Easy Shipping",
        processStep2Desc: "Our shipping partner will contact you to arrange a convenient pickup of your device.",
        processStep3Title: "3. Expert Recovery",
        processStep3Desc: "Our experienced technicians will meticulously work to recover your valuable data.",
        processStep4Title: "4. Data Returned",
        processStep4Desc: "Once recovered, we'll securely return your data and device to you.",

        // About Us Page
        aboutUsTitle: "About Say Tech",
        aboutUsSubtitle: "Your trusted partner in data recovery, bringing precious memories and critical information back to life.",
        
        // Our Story Section
        ourStoryTitle: "Our Story",
        ourStoryParagraph1: "Founded in the heart of Saihat, Saudi Arabia, Say Tech emerged from a simple belief: that everyone deserves to have their precious data recovered when technology fails them.",
        ourStoryParagraph2: "Our journey began when our founder, with 14 years of experience in aviation mechanics and electricity, witnessed firsthand how devastating data loss can be for individuals and businesses alike.",
        ourStoryParagraph3: "Today, we stand as the region's trusted data recovery specialists, combining technical expertise with genuine care for our customers' digital lives.",
        companyHighlights: "Company Highlights",
        highlight1: "Founded in Saihat, Saudi Arabia",
        highlight2: "14+ years of technical expertise",
        highlight3: "Specializing in iPhone data recovery",
        highlight4: "Serving customers across the Kingdom",
        
        // Our Values Section
        ourValuesTitle: "Our Values",
        value1Title: "Trust & Security",
        value1Description: "Your data's security and privacy are our top priorities. We handle every device with the utmost care and confidentiality.",
        value2Title: "Excellence",
        value2Description: "We strive for perfection in every recovery attempt, using the latest techniques and maintaining the highest standards.",
        value3Title: "Innovation",
        value3Description: "We continuously invest in cutting-edge technology and training to stay ahead in the rapidly evolving field of data recovery.",
        
        // Our Mission Section
        ourMissionTitle: "Our Mission",
        missionStatement: "To provide reliable, professional, and compassionate data recovery services that reunite people with their digital memories and critical information.",
        missionGoalsTitle: "What We Aim to Achieve:",
        missionGoal1: "Deliver industry-leading data recovery success rates",
        missionGoal2: "Provide transparent, honest communication throughout the process",
        missionGoal3: "Offer affordable solutions without compromising on quality",
        missionGoal4: "Build lasting relationships based on trust and reliability",
        whyChooseUsTitle: "Why Choose Say Tech?",
        successRate: "Success Rate",
        supportAvailable: "Support Available",
        yearsExperience: "Years Experience",
        readyToRecover: "Ready to Recover Your Data?",
        readyToRecoverSubtext: "Join hundreds of satisfied customers who trusted us with their precious data.",
        startRecoveryButton: "Start Your Recovery",

        // Request Form Page
        requestServiceTitle: "Request Data Recovery Service",
        requestServiceSubtitle: "Fill out the form below. We'll contact you via WhatsApp to arrange device shipment.",
        yourInformationTitle: "Your Information",
        yourInformationDescription: "Please provide your contact and device details.",
        fullNameLabel: "Full Name",
        fullNamePlaceholder: "Your Full Name",
        countryCodeLabel: "Country Code",
        countryCodePlaceholder: "Select Code",
        localPhoneNumberLabel: "Phone Number (WhatsApp)",
        localPhoneNumberPlaceholder: "5XXXXXXXX",
        emailLabel: "Email",
        emailPlaceholder: "youremail@example.com",
        cityLabel: "City",
        cityPlaceholder: "e.g., Dammam",
        regionLabel: "Region/Province",
        regionPlaceholder: "e.g., Eastern Province",
        phoneModelLabel: "Phone Model",
        phoneModelSelectPlaceholder: "Select Phone Model",
        previouslyRepairedLabel: "Has device been repaired before?",
        previouslyRepairedPlaceholder: "Select an option",
        yesOption: "Yes",
        noOption: "No",
        deviceConditionLabel: "Current Device Condition",
        deviceConditionPlaceholder: "Select condition",
        conditionFellInWater: "Fell in water",
        conditionPhysicalDamage: "Physical damage (hit/dropped)",
        conditionNoPower: "Won't turn on / No power",
        conditionScreenIssue: "Screen issue (no physical damage)",
        conditionBatteryIssue: "Battery issue",
        conditionSoftwareIssue: "Software issue / Stuck on logo",
        conditionOther: "Other",
        issueDescriptionLabel: "Issue Description",
        issueDescriptionPlaceholder: "Describe the issue with your iPhone in detail",
        deviceImageLabel: "Upload Picture of Device",
        deviceImagePlaceholder: "Choose file...",
        fileNameLabel: "Selected file:",
        agreementCheckboxLabel: "I have read and agree to the terms and conditions.",
        viewAgreementLink: "View Agreement",
        errorAgreementRequiredTitle: "Agreement Required",
        errorAgreementRequiredText: "You must agree to the terms and conditions to proceed.",
        agreementModalTitle: "Terms and Conditions",
        agreementTextLine1: "Welcome to Say Tech! These terms and conditions outline the rules and regulations for the use of Say Tech's Data Recovery Services.",
        agreementTextLine2: "By accessing this website and/or submitting a service request, we assume you accept these terms and conditions. Do not continue to use Say Tech's services if you do not agree to all of the terms and conditions stated on this page.",
        agreementServiceTitle: "Service Provision",
        agreementServiceText1: "Say Tech agrees to perform data recovery services on the device(s) submitted by you. We will use our best efforts to recover your data. However, data recovery is not guaranteed and depends on the condition of the device and data.",
        agreementServiceText2: "An initial non-refundable evaluation fee (if applicable and communicated) and the agreed service fee must be paid. Shipping costs for sending the device to us and returning it to you are your responsibility.",
        agreementPaymentTitle: "Payment",
        agreementPaymentText1: "The full service fee is due upon successful data recovery, prior to the return of your data and device. If data recovery is unsuccessful, only the evaluation fee (if any) and return shipping costs will be charged.",
        agreementUserResponsibilityTitle: "Your Responsibilities",
        agreementUserResponsibilityText1: "You confirm that you are the legal owner of the device and the data contained therein, or have obtained explicit consent from the legal owner to submit the device for data recovery.",
        agreementUserResponsibilityText2: "You are responsible for accurately describing the device's condition and the issue. Misrepresentation may affect the recovery process and costs.",
        agreementLimitationTitle: "Limitation of Liability",
        agreementLimitationText1: "Say Tech is not liable for any damage to the device that may occur during the evaluation or recovery process, especially if the device was previously tampered with or severely damaged. We are not liable for any loss of profits, data, or any indirect, special, incidental, or consequential damages.",
        agreementConfidentialityTitle: "Confidentiality",
        agreementConfidentialityText1: "We will treat your data with the utmost confidentiality and will not disclose it to third parties, except as required by law.",
        agreementShippingTitle: "Shipping & Device Return",
        agreementShippingText1: "You are responsible for all shipping costs. Devices not claimed or for which return shipping is not paid within 60 days of notification may be disposed of.",
        agreementChangesTitle: "Changes to Terms",
        agreementChangesText1: "Say Tech reserves the right to revise these terms at any time. By using this service, you are expected to review these terms on a regular basis.",
        agreementContactTitle: "Contact Us",
        agreementContactText1: "If you have any questions about these Terms, please contact us.",
        iAgreeButton: "I Agree",
        proceedToPaymentButton: "Proceed to Payment",
        submittingButton: "Submitting...",
        errorMissingInfoTitle: "Missing Information",
        errorMissingInfoText: "Please fill in all required fields.",
        errorInvalidEmailTitle: "Invalid Email",
        errorInvalidEmailText: "Please enter a valid email address.",
        errorInvalidPhoneTitle: "Invalid Phone Number",
        errorInvalidPhoneText: "Please enter a valid phone number, including country code.",
        submissionFailedTitle: "Submission Failed",
        submissionFailedText: "An unexpected error occurred. Please try again.",
        requestSubmittedTitle: "Request Submitted!",
        requestSubmittedText: "Your service request and payment have been successfully processed.",
        importantSaveInfoTitle: "Important: Save This Information!",
        importantSaveInfoText: "Please save your Request ID and Verification Code. You'll need them to check your request status.",
        requestIdLabel: "Request ID:",
        transactionIdLabel: "Order ID:",
        contactWhatsAppText: "We will contact you via WhatsApp at {phoneNumber} to arrange the shipment of your device.",
        checkStatusNowButton: "Check Status Now",
        paymentFailedTitle: "Payment Failed",
        paymentFailedText: "The payment could not be completed. Please try submitting the form again.",
        paymentFailedWithReason: "Payment failed: {reason}. Please try again.",
        popupBlockedTitle: "Popup Blocked",
        popupBlockedText: "Your browser blocked the payment window. Please allow popups for this site and try again.",
        closeButton: "Close",
        
        // Status Check Page
        checkRequestStatusTitle: "Check Request Status",
        checkRequestStatusSubtitle: "Enter your name, phone, and email to view your request status.",
        phoneNumberInputLabel: "Phone Number (including country code)",
        phoneNumberInputPlaceholder: "+966XXXXXXXXX",
        checkStatusButton: "Check Status",
        checkingStatusButton: "Checking Status...",
        statusCheckFailedTitle: "Status Check Failed",
        statusCheckFailedTextDefault: "Could not retrieve status.",
        errorNotFoundTitle: "Not Found",
        errorRequestNotFound: "No matching request found for the provided details.",
        errorGenericTitle: "Error",
        statusForRequestId: "Status for Request ID: {requestId}",
        requestStatusTitle: "Request Status",
        multipleRequestsStatusTitle: "Status for Your Requests",
        statusPaid: "Paid. Waiting for device shipment.",
        statusShipped: "Device shipped to our store.",
        statusDelivered: "Device delivered to our store. Under inspection.",
        statusEvaluatingDevice: "Device under evaluation.",
        statusDataRecovered: "Data recovery successful! Ready for return.",
        statusDataCantRecover: "Unfortunately, data recovery was unsuccessful.",
        statusPending: "Pending Payment. Please complete payment to proceed.",
        statusErrorInRequest: "Error in request.",
        statusUnknown: "Unknown Status",

        // Admin Login Page
        adminLoginTitle: "Admin Login",
        usernameLabel: "Username",
        usernamePlaceholder: "admin",
        passwordLabel: "Password",
        passwordPlaceholder: "admin123",
        loginButton: "Login",
        loggingInButton: "Logging In...",
        loginFailedText: "Login failed.",
        
        // Admin Dashboard Page
        adminDashboardTitle: "Admin Dashboard",
        refreshRequestsButton: "Refresh Requests",
        loadingAdminDashboard: "Loading Admin Dashboard...",
        errorLoadingDashboardTitle: "Error Loading Dashboard",
        failedToFetchRequests: "Failed to fetch requests.",
        tableHeaderRequestId: "Request ID",
        tableHeaderCustomer: "Customer",
        tableHeaderPhoneModel: "Phone Model",
        tableHeaderStatus: "Status",
        tableHeaderActions: "Actions",
        viewEditButton: "View/Edit",
        requestDetailsTitle: "Request Details: {requestId}",
        customerLabel: "Customer:",
        emailLabelModal: "Email:",
        phoneModelLabelModal: "Phone Model:",
        issueLabelModal: "Issue:",
        paymentInfoLabelModal: "Payment Info:",
        currentStatusLabelModal: "Current Status:",
        updateStatusLabelModal: "Update Status:",
        selectNewStatusPlaceholder: "Select new status",
        saveStatusChangeButton: "Save Status Change",
        updatingButtonModal: "Updating...",
        statusUpdateSuccessText: "Status for {requestId} updated to {newStatus}",
        statusUpdateFailedText: "Failed to update status.",
        statusUpdateErrorText: "Error updating status.",
        statusOptionPending: "Pending",
        statusOptionPaid: "Paid",
        statusOptionShipped: "Shipped",
        statusOptionDelivered: "Delivered",
        statusOptionEvaluatingDevice: "Evaluating Device",
        statusOptionDataRecovered: "Data Recovered",
        statusOptionDataCantRecover: "Data Can't Recover",
        page: "Page",
        of: "of",
        loadingRequests: "Loading requests...",
        noRequestsFound: "No requests found.",
        searchPlaceholder: "Search by ID, Name, Email, Phone, Status...",
        searchButton: "Search",
        clearSearchButton: "Clear",
        filterAll: "All",
        filterInProgress: "In Progress",
        filterDone: "Done",
        filterByStatus: "Filter by Status:",

        // Footer
        footerRightsReserved: "© {year} Say Tech. All rights reserved.",
        footerServiceLocation: "Data Recovery Services, Saihat, Saudi Arabia.",
        footerContactUs: "Contact Us",
        footerEmail: "Email:",
        footerPhone: "Phone:",
        footerFollowUs: "Follow Us",

        // General
        loadingMessage: "Loading...",
        loadingAuth: "Checking authentication...",
        authenticationRequired: "Authentication Required",
        pleaseLoginToAccessAdmin: "Please log in to access the admin dashboard.",
        goToHomePage: "Go to Home Page",
        requiredFieldIndicator: "*",
    },
    ar: {
        // Navbar
        navHome: "الرئيسية",
        navNewRequest: "طلب جديد",
        navCheckStatus: "تحقق من الحالة",
        navAboutUs: "من نحن",
        navAdminDashboard: "لوحة التحكم",
        navAdminLogin: "دخول المسؤول",
        navLogout: "تسجيل الخروج",
        languageSwitch: "English",
        previousPage: "السابق",
        nextPage: "التالي",

        // Welcome Page
        welcomeTitle: "ساي تك",
        welcomeSubtitle: "خبراء استعادة البيانات الموثوق بهم",
        welcomeDescription: "موقعنا في سيهات، المملكة العربية السعودية، متخصصون في استعادة البيانات الثمينة من أجهزة آيفون. يتمتع فنينا بخبرة 14 عامًا في ميكانيكا وكهرباء الطيران، مما يضمن رعاية فائقة وخبرة لجهازك.",
        welcomeCommitment: "نحن نتفهم قيمة بياناتك ونلتزم بإعادتها إليك بأمان.",
        getQuoteButton: "استرجع بياناتك",
        ourLocation: "موقعنا: سيهات، المملكة العربية السعودية",
        ourExpertiseTitle: "خبرتنا في العمل",
        expertAtWorkAlt: "فني يعمل بعناية على استعادة البيانات من هاتف ذكي.",
        testimonialsTitle: "ماذا يقول عملاؤنا",
        loadingTestimonials: "جاري تحميل آراء العملاء...",
        testimonial1Name: "أحمد المنصوري",
        testimonial1Quote: "ساي تك استعادوا جميع صور عائلتي الثمينة من جهاز آيفون المكسور! ظننت أنها ضاعت إلى الأبد. خدمة مذهلة واحترافية عالية.",
        testimonial1Device: "آيفون 13 برو",
        testimonial2Name: "فاطمة الزهراني",
        testimonial2Quote: "بيانات عملي كانت على هاتفي المتضرر من الماء. ساي تك أنقذوا الموقف! سرعة في الإنجاز وتواصل ممتاز طوال العملية.",
        testimonial2Device: "آيفون 12",
        testimonial3Name: "جون د.",
        testimonial3Quote: "مهارة لا تصدق! تمكنوا من استرداد البيانات من هاتف قالت عنه متاجر أخرى أنه غير قابل للاسترداد. موصى به بشدة!",
        testimonial3Device: "آيفون X",
        beforeAfterTitle: "من مكسور إلى مُستعاد",
        loadingBeforeAfter: "جاري تحميل أمثلة الاسترداد...",
        beforeTitle: "قبل: بيانات بدت مفقودة",
        beforeDescription1: "آيفون متضرر بشدة، لا يستجيب ويبدو أنه لا يمكن إصلاحه. ذكريات ثمينة وملفات هامة محتجزة بداخله.",
        beforeImageAlt1: "هاتف ذكي متضرر بشدة مع شاشة مكسورة.",
        afterTitle: "بعد: تم استعادة البيانات بنجاح!",
        afterDescription1: "بفضل خبرة ساي تك، تم استرداد جميع البيانات الهامة، مما جلب الراحة والفرح لصاحبه.",
        afterImageAlt1: "هاتف ذكي يعرض رسالة نجاح أو ملفات مستردة.",
        beforeDescription2: "جهاز متضرر من الماء، يرفض التشغيل. جهات اتصال عمل هامة وملفات مشاريع كانت على المحك.",
        beforeImageAlt2: "هاتف ذكي تظهر عليه علامات التلف بسبب الماء.",
        afterDescription2: "عمل ساي تك الدقيق أعاد البيانات، مما ضمن استمرارية العمل.",
        afterImageAlt2: "هاتف ذكي يعرض قائمة بجهات الاتصال أو الملفات المستردة.",
        pricingOfferTitle: "أسعار شفافة",
        pricingOfferText: "استرجع بياناتك الثمينة مقابل 2000 ريال سعودي، بالإضافة إلى تكاليف الشحن (ذهابًا وإيابًا).",
        pricingOfferDetails: "هذا السعر الثابت يغطي معظم حالات استعادة بيانات آيفون الشائعة. الحالات المعقدة قد تتطلب عرض سعر مخصص بعد التقييم الأولي. اتصل بنا لمزيد من التفاصيل.",
        ourProcessTitle: "عملية الاسترداد البسيطة لدينا",
        processStep1Title: "1. إرسال الطلب والدفع",
        processStep1Desc: "املأ نموذجنا الآمن عبر الإنترنت بتفاصيل جهازك وأكمل الدفع المبدئي.",
        processStep2Title: "2. شحن سهل",
        processStep2Desc: "سيتصل بك شريك الشحن لترتيب استلام جهازك بشكل مناسب.",
        processStep3Title: "3. استرداد احترافي",
        processStep3Desc: "سيعمل فنيونا ذوو الخبرة بدقة لاستعادة بياناتك القيمة.",
        processStep4Title: "4. إعادة البيانات",
        processStep4Desc: "بمجرد استردادها، سنعيد بياناتك وجهازك إليك بأمان.",

        // About Us Page
        aboutUsTitle: "عن ساي تك",
        aboutUsSubtitle: "شريكك الموثوق في استعادة البيانات، نعيد الذكريات الثمينة والمعلومات الحيوية إلى الحياة.",
        
        // Our Story Section
        ourStoryTitle: "قصتنا",
        ourStoryParagraph1: "تأسست في قلب سيهات، المملكة العربية السعودية، انطلقت ساي تك من إيمان بسيط: أن كل شخص يستحق أن تُستعاد بياناته الثمينة عندما تخذله التكنولوجيا.",
        ourStoryParagraph2: "بدأت رحلتنا عندما شاهد مؤسسنا، بخبرته التي تمتد لـ 14 عامًا في ميكانيكا وكهرباء الطيران، كم يمكن أن يكون فقدان البيانات مدمرًا للأفراد والشركات على حد سواء.",
        ourStoryParagraph3: "اليوم، نقف كمتخصصين موثوقين في استعادة البيانات في المنطقة، نجمع بين الخبرة التقنية والاهتمام الحقيقي بالحياة الرقمية لعملائنا.",
        companyHighlights: "معالم الشركة",
        highlight1: "تأسست في سيهات، المملكة العربية السعودية",
        highlight2: "أكثر من 14 عامًا من الخبرة التقنية",
        highlight3: "متخصصون في استعادة بيانات الآيفون",
        highlight4: "نخدم العملاء في جميع أنحاء المملكة",
        
        // Our Values Section
        ourValuesTitle: "قيمنا",
        value1Title: "الثقة والأمان",
        value1Description: "أمان وخصوصية بياناتك هما أولويتنا القصوى. نتعامل مع كل جهاز بأقصى درجات العناية والسرية.",
        value2Title: "التميز",
        value2Description: "نسعى للكمال في كل محاولة استرداد، مستخدمين أحدث التقنيات ومحافظين على أعلى المعايير.",
        value3Title: "الابتكار",
        value3Description: "نستثمر باستمرار في التكنولوجيا المتطورة والتدريب للبقاء في المقدمة في مجال استعادة البيانات سريع التطور.",
        
        // Our Mission Section
        ourMissionTitle: "مهمتنا",
        missionStatement: "تقديم خدمات استعادة البيانات الموثوقة والمهنية والمتعاطفة التي تعيد الناس إلى ذكرياتهم الرقمية ومعلوماتهم الحيوية.",
        missionGoalsTitle: "ما نسعى لتحقيقه:",
        missionGoal1: "تحقيق معدلات نجاح رائدة في استعادة البيانات",
        missionGoal2: "توفير تواصل شفاف وصادق طوال العملية",
        missionGoal3: "تقديم حلول ميسورة التكلفة دون التنازل عن الجودة",
        missionGoal4: "بناء علاقات دائمة قائمة على الثقة والموثوقية",
        whyChooseUsTitle: "لماذا تختار ساي تك؟",
        successRate: "معدل النجاح",
        supportAvailable: "الدعم متاح",
        yearsExperience: "سنوات الخبرة",
        readyToRecover: "مستعد لاستعادة بياناتك؟",
        readyToRecoverSubtext: "انضم إلى المئات من العملاء الراضين الذين وثقوا بنا ببياناتهم الثمينة.",
        startRecoveryButton: "ابدأ الاستعادة",

        // Request Form Page
        requestServiceTitle: "طلب خدمة استعادة البيانات",
        requestServiceSubtitle: "املأ النموذج أدناه. سنتواصل معك عبر الواتساب لترتيب شحن الجهاز.",
        yourInformationTitle: "معلوماتك",
        yourInformationDescription: "يرجى تقديم تفاصيل الاتصال والجهاز الخاصة بك.",
        fullNameLabel: "الاسم الكامل",
        fullNamePlaceholder: "اسمك الكامل",
        countryCodeLabel: "رمز الدولة",
        countryCodePlaceholder: "اختر الرمز",
        localPhoneNumberLabel: "رقم الهاتف (واتساب)",
        localPhoneNumberPlaceholder: "5XXXXXXXX",
        emailLabel: "البريد الإلكتروني",
        emailPlaceholder: "youremail@example.com",
        cityLabel: "المدينة",
        cityPlaceholder: "مثال: الدمام",
        regionLabel: "المنطقة/المحافظة",
        regionPlaceholder: "مثال: المنطقة الشرقية",
        phoneModelLabel: "طراز الهاتف",
        phoneModelSelectPlaceholder: "اختر طراز الهاتف",
        previouslyRepairedLabel: "هل تم إصلاح الجهاز من قبل؟",
        previouslyRepairedPlaceholder: "اختر إجابة",
        yesOption: "نعم",
        noOption: "لا",
        deviceConditionLabel: "حالة الجهاز الحالية",
        deviceConditionPlaceholder: "اختر الحالة",
        conditionFellInWater: "سقط في الماء",
        conditionPhysicalDamage: "ضرر مادي (صدمة/سقوط)",
        conditionNoPower: "لا يعمل / لا يوجد طاقة",
        conditionScreenIssue: "مشكلة في الشاشة (بدون ضرر مادي)",
        conditionBatteryIssue: "مشكلة في البطارية",
        conditionSoftwareIssue: "مشكلة برمجية / عالق على الشعار",
        conditionOther: "أخرى",
        issueDescriptionLabel: "وصف المشكلة",
        issueDescriptionPlaceholder: "صف المشكلة في جهاز آيفون الخاص بك بالتفصيل",
        deviceImageLabel: "تحميل صورة للجهاز",
        deviceImagePlaceholder: "اختر ملف...",
        fileNameLabel: "الملف المحدد:",
        agreementCheckboxLabel: "لقد قرأت ووافقت على الشروط والأحكام.",
        viewAgreementLink: "عرض الاتفاقية",
        errorAgreementRequiredTitle: "الموافقة مطلوبة",
        errorAgreementRequiredText: "يجب عليك الموافقة على الشروط والأحكام للمتابعة.",
        agreementModalTitle: "الشروط والأحكام",
        agreementTextLine1: "مرحبًا بك في ساي تك! تحدد هذه الشروط والأحكام القواعد واللوائح الخاصة باستخدام خدمات استعادة البيانات الخاصة بـ ساي تك.",
        agreementTextLine2: "من خلال الوصول إلى هذا الموقع و/أو إرسال طلب خدمة، نفترض أنك تقبل هذه الشروط والأحكام. لا تستمر في استخدام خدمات ساي تك إذا كنت لا توافق على جميع الشروط والأحكام المذكورة في هذه الصفحة.",
        agreementServiceTitle: "تقديم الخدمة",
        agreementServiceText1: "توافق ساي تك على أداء خدمات استعادة البيانات على الجهاز (الأجهزة) المقدمة من قبلك. سنبذل قصارى جهدنا لاستعادة بياناتك. ومع ذلك، فإن استعادة البيانات ليست مضمونة وتعتمد على حالة الجهاز والبيانات.",
        agreementServiceText2: "يجب دفع رسوم تقييم أولية غير قابلة للاسترداد (إذا كانت مطبقة وتم إبلاغها) ورسوم الخدمة المتفق عليها. تكاليف الشحن لإرسال الجهاز إلينا وإعادته إليك هي مسؤوليتك.",
        agreementPaymentTitle: "الدفع",
        agreementPaymentText1: "تستحق رسوم الخدمة كاملة عند نجاح استعادة البيانات، قبل إعادة بياناتك وجهازك. إذا لم تنجح عملية استعادة البيانات، فسيتم فرض رسوم التقييم فقط (إن وجدت) وتكاليف إعادة الشحن.",
        agreementUserResponsibilityTitle: "مسؤولياتك",
        agreementUserResponsibilityText1: "أنت تؤكد أنك المالك القانوني للجهاز والبيانات الموجودة فيه، أو أنك حصلت على موافقة صريحة من المالك القانوني لتقديم الجهاز لاستعادة البيانات.",
        agreementUserResponsibilityText2: "أنت مسؤول عن وصف حالة الجهاز والمشكلة بدقة. قد يؤثر التحريف على عملية الاسترداد والتكاليف.",
        agreementLimitationTitle: "تحديد المسؤولية",
        agreementLimitationText1: "ساي تك ليست مسؤولة عن أي ضرر يلحق بالجهاز قد يحدث أثناء عملية التقييم أو الاسترداد، خاصة إذا تم العبث بالجهاز مسبقًا أو تعرض لأضرار جسيمة. نحن لسنا مسؤولين عن أي خسارة في الأرباح أو البيانات أو أي أضرار غير مباشرة أو خاصة أو عرضية أو تبعية.",
        agreementConfidentialityTitle: "السرية",
        agreementConfidentialityText1: "سنتعامل مع بياناتك بمنتهى السرية ولن نكشف عنها لأطراف ثالثة، إلا وفقًا لما يقتضيه القانون.",
        agreementShippingTitle: "الشحن وإرجاع الجهاز",
        agreementShippingText1: "أنت مسؤول عن جميع تكاليف الشحن. الأجهزة التي لم تتم المطالبة بها أو التي لم يتم دفع رسوم شحن إعادتها في غضون 60 يومًا من الإخطار قد يتم التخلص منها.",
        agreementChangesTitle: "التغييرات على الشروط",
        agreementChangesText1: "تحتفظ ساي تك بالحق في مراجعة هذه الشروط في أي وقت. باستخدام هذه الخدمة، من المتوقع أن تراجع هذه الشروط بشكل منتظم.",
        agreementContactTitle: "اتصل بنا",
        agreementContactText1: "إذا كان لديك أي أسئلة حول هذه الشروط، يرجى الاتصال بنا.",
        iAgreeButton: "أوافق",
        proceedToPaymentButton: "المتابعة إلى الدفع",
        submittingButton: "جاري الإرسال...",
        errorMissingInfoTitle: "معلومات ناقصة",
        errorMissingInfoText: "يرجى ملء جميع الحقول المطلوبة.",
        errorInvalidEmailTitle: "بريد إلكتروني غير صالح",
        errorInvalidEmailText: "يرجى إدخال عنوان بريد إلكتروني صالح.",
        errorInvalidPhoneTitle: "رقم هاتف غير صالح",
        errorInvalidPhoneText: "يرجى إدخال رقم هاتف صالح، بما في ذلك رمز الدولة.",
        submissionFailedTitle: "فشل الإرسال",
        submissionFailedText: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        requestSubmittedTitle: "تم إرسال الطلب!",
        requestSubmittedText: "تمت معالجة طلب الخدمة والدفع بنجاح.",
        importantSaveInfoTitle: "هام: احفظ هذه المعلومات!",
        importantSaveInfoText: "يرجى حفظ معرف الطلب ورمز التحقق الخاص بك. ستحتاج إليهما للتحقق من حالة طلبك.",
        requestIdLabel: "معرف الطلب:",
        transactionIdLabel: "معرف المعاملة:",
        contactWhatsAppText: "سنتواصل معك عبر الواتساب على الرقم {phoneNumber} لترتيب شحن الجهاز.",
        checkStatusNowButton: "تحقق من الحالة الآن",
        paymentFailedTitle: "فشل الدفع",
        paymentFailedText: "تعذر إتمام الدفع. يرجى محاولة إرسال النموذج مرة أخرى.",
        paymentFailedWithReason: "فشل الدفع: {reason}. يرجى المحاولة مرة أخرى.",
        popupBlockedTitle: "تم حظر النافذة المنبثقة",
        popupBlockedText: "قام متصفحك بحظر نافذة الدفع. يرجى السماح بالنوافذ المنبثقة لهذا الموقع والمحاولة مرة أخرى.",
        closeButton: "إغلاق",

        // Status Check Page
        checkRequestStatusTitle: "التحقق من حالة الطلب",
        checkRequestStatusSubtitle: "أدخل اسمك ورقم هاتفك وبريدك الإلكتروني لعرض حالة طلبك.",
        phoneNumberInputLabel: "رقم الهاتف (مع رمز الدولة)",
        phoneNumberInputPlaceholder: "XXXXXXXXX966+",
        checkStatusButton: "تحقق من الحالة",
        checkingStatusButton: "جاري التحقق...",
        statusCheckFailedTitle: "فشل التحقق من الحالة",
        statusCheckFailedTextDefault: "تعذر استرداد الحالة.",
        errorNotFoundTitle: "غير موجود",
        errorRequestNotFound: "لم يتم العثور على طلب مطابق للتفاصيل المقدمة.",
        errorGenericTitle: "خطأ",
        statusForRequestId: "حالة الطلب رقم: {requestId}",
        requestStatusTitle: "حالة الطلب",
        multipleRequestsStatusTitle: "حالة طلباتك",
        statusPaid: "مدفوع. في انتظار شحن الجهاز.",
        statusShipped: "تم شحن الجهاز إلى متجرنا.",
        statusDelivered: "تم تسليم الجهاز إلى متجرنا. قيد الفحص.",
        statusEvaluatingDevice: "الجهاز قيد التقييم.",
        statusDataRecovered: "نجحت استعادة البيانات! جاهز للإرجاع.",
        statusDataCantRecover: "للأسف، لم تنجح عملية استعادة البيانات.",
        statusPending: "في انتظار الدفع. يرجى إكمال الدفع للمتابعة.",
        statusErrorInRequest: "خطأ في الطلب.",
        statusUnknown: "حالة غير معروفة",

        // Admin Login Page
        adminLoginTitle: "دخول المسؤول",
        usernameLabel: "اسم المستخدم",
        usernamePlaceholder: "admin",
        passwordLabel: "كلمة المرور",
        passwordPlaceholder: "admin123",
        loginButton: "تسجيل الدخول",
        loggingInButton: "جاري تسجيل الدخول...",
        loginFailedText: "فشل تسجيل الدخول.",

        // Admin Dashboard Page
        adminDashboardTitle: "لوحة تحكم المسؤول",
        refreshRequestsButton: "تحديث الطلبات",
        loadingAdminDashboard: "جاري تحميل لوحة التحكم...",
        errorLoadingDashboardTitle: "خطأ في تحميل لوحة التحكم",
        failedToFetchRequests: "فشل في جلب الطلبات.",
        tableHeaderRequestId: "معرف الطلب",
        tableHeaderCustomer: "العميل",
        tableHeaderPhoneModel: "طراز الهاتف",
        tableHeaderStatus: "الحالة",
        tableHeaderActions: "الإجراءات",
        viewEditButton: "عرض/تعديل",
        requestDetailsTitle: "تفاصيل الطلب: {requestId}",
        customerLabel: "العميل:",
        emailLabelModal: "البريد الإلكتروني:",
        phoneModelLabelModal: "طراز الهاتف:",
        issueLabelModal: "المشكلة:",
        paymentInfoLabelModal: "معلومات الدفع:",
        currentStatusLabelModal: "الحالة الحالية:",
        updateStatusLabelModal: "تحديث الحالة:",
        selectNewStatusPlaceholder: "اختر الحالة الجديدة",
        saveStatusChangeButton: "حفظ تغيير الحالة",
        updatingButtonModal: "جاري التحديث...",
        statusUpdateSuccessText: "تم تحديث حالة الطلب {requestId} إلى {newStatus}",
        statusUpdateFailedText: "فشل تحديث الحالة.",
        statusUpdateErrorText: "خطأ في تحديث الحالة.",
        statusOptionPending: "قيد الانتظار",
        statusOptionPaid: "مدفوع",
        statusOptionShipped: "تم الشحن",
        statusOptionDelivered: "تم التسليم",
        statusOptionEvaluatingDevice: "جاري تقييم الجهاز",
        statusOptionDataRecovered: "تم استرداد البيانات",
        statusOptionDataCantRecover: "لا يمكن استرداد البيانات",
        page: "صفحة",
        of: "من",
        loadingRequests: "جاري تحميل الطلبات...",
        noRequestsFound: "لم يتم العثور على طلبات.",
        searchPlaceholder: "ابحث بالمعرف، الاسم، البريد، الهاتف، الحالة...",
        searchButton: "بحث",
        clearSearchButton: "مسح",
        filterAll: "الكل",
        filterInProgress: "قيد التنفيذ",
        filterDone: "مكتمل",
        filterByStatus: "تصفية حسب الحالة:",

        // Footer
        footerRightsReserved: "© {year} ساي تك. جميع الحقوق محفوظة.",
        footerServiceLocation: "خدمات استعادة البيانات، سيهات، المملكة العربية السعودية.",
        footerContactUs: "اتصل بنا",
        footerEmail: "البريد الإلكتروني:",
        footerPhone: "الهاتف:",
        footerFollowUs: "تابعنا",

        // General
        loadingMessage: "جاري التحميل...",
        loadingAuth: "جاري التحقق من الهوية...",
        authenticationRequired: "مطلوب تسجيل الدخول",
        pleaseLoginToAccessAdmin: "يرجى تسجيل الدخول للوصول إلى لوحة التحكم.",
        goToHomePage: "العودة للصفحة الرئيسية",
        requiredFieldIndicator: "*",
    }
};

// --- Context ---
const LanguageContext = createContext();
export const SelectContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);
    const t = (key, params = {}) => {
        let translation = translations[language][key] || translations['en'][key] || key;
        Object.keys(params).forEach(paramKey => {
            translation = translation.replace(`{${paramKey}}`, params[paramKey]);
        });
        return translation;
    };
    const toggleLanguage = () => setLanguage(prevLang => prevLang === 'en' ? 'ar' : 'en');
    return <LanguageContext.Provider value={{ language, toggleLanguage, t }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);


// --- Navbar Component ---
const Navbar = ({ navigateTo }) => {
    const { t, language, toggleLanguage } = useLanguage();
    const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const handleNavigate = (page) => {
        navigateTo(page);
        setIsMobileMenuOpen(false);
    };
    
    const handleAdminAction = () => {
        console.log('Admin action clicked, Auth0 state:', { isAuthenticated, isLoading });
        if (isAuthenticated) {
            // If authenticated with Auth0, go to admin dashboard
            console.log('User authenticated, navigating to adminDashboard');
            navigateTo('adminDashboard');
        } else {
            // If not authenticated, trigger Auth0 login
            console.log('User not authenticated, triggering Auth0 login');
            loginWithRedirect();
        }
    };
    
    const handleLogout = () => {
        // Logout from Auth0
        logout();
    };
    return (
        <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-40">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="text-xl sm:text-2xl font-bold cursor-pointer flex items-center" onClick={() => handleNavigate('welcome')}>
                        <Store className={cn("w-6 h-6 sm:w-7 sm:h-7 text-blue-400", language === 'ar' ? 'ml-2' : 'mr-2')} />
                        <span className="text-blue-400">{t('welcomeTitle').split(' ')[0]}</span>
                        <span className="text-white">{t('welcomeTitle').split(' ')[1]}</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
                        <button onClick={() => navigateTo('welcome')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navHome')}</button>
                        <button onClick={() => navigateTo('about')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navAboutUs')}</button>
                        <button onClick={() => navigateTo('request')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navNewRequest')}</button>
                        <button onClick={() => navigateTo('status')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navCheckStatus')}</button>
                        
                        {/* Admin Section with Auth0 Integration */}
                        {!isLoading && (
                            isAuthenticated ? (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-300">
                                        <User className="h-4 w-4 inline mr-1" />
                                        {user?.name || user?.email}
                                    </span>
                                    <Button onClick={handleAdminAction} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm">
                                        {t('navAdminDashboard')}
                                    </Button>
                                    <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm">
                                        {t('navLogout')}
                                    </Button>
                                </div>
                            ) : (
                                <Button onClick={handleAdminAction} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm">
                                    <Lock className="h-4 w-4 mr-1" />
                                    {t('navAdminLogin')}
                                </Button>
                            )
                        )}
                        
                        <Button onClick={toggleLanguage} className="text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white px-3 py-1.5 rounded-md text-sm flex items-center">
                            <Globe className={cn("h-4 w-4", language === 'ar' ? 'ml-1.5' : 'mr-1.5')} /> {t('languageSwitch')}
                        </Button>
                    </div>
                    <div className="md:hidden flex items-center">
                        <Button onClick={toggleLanguage} className="text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white px-2 py-1 rounded-md text-xs mr-2"><Globe className="h-4 w-4" /></Button>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800">
                            {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
                        </button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800">
                            <button onClick={() => handleNavigate('welcome')} className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">{t('navHome')}</button>
                            <button onClick={() => handleNavigate('about')} className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">{t('navAboutUs')}</button>
                            <button onClick={() => handleNavigate('request')} className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">{t('navNewRequest')}</button>
                            <button onClick={() => handleNavigate('status')} className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">{t('navCheckStatus')}</button>
                            
                            {/* Admin Section with Auth0 Integration */}
                            {!isLoading && (
                                isAuthenticated ? (
                                    <>
                                        <div className="text-gray-300 px-3 py-2 text-sm">
                                            <User className="h-4 w-4 inline mr-1" />
                                            {user?.name || user?.email}
                                        </div>
                                        <button onClick={() => { handleAdminAction(); setIsMobileMenuOpen(false); }} className="text-blue-400 hover:text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                                            {t('navAdminDashboard')}
                                        </button>
                                        <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-red-400 hover:text-white hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                                            {t('navLogout')}
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => { handleAdminAction(); setIsMobileMenuOpen(false); }} className="text-blue-400 hover:text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                                        <Lock className="h-4 w-4 inline mr-1" />
                                        {t('navAdminLogin')}
                                    </button>
                                )
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

// --- Main App Component ---
function AppInternal() {
    const { t, language } = useLanguage(); // FIXED: Added 't' here
    const { getAccessToken, isAuthenticated, isLoading } = useAuth0(); // Add Auth0 hook with loading state
    const [currentPage, setCurrentPage] = useState('welcome');

    // Set up Auth0 token getter for API service
    useEffect(() => {
        api.getAuth0Token = getAccessToken;
    }, [getAccessToken]);

    const navigateTo = useCallback((page) => {
        const validPage = (page || 'welcome').trim();
        console.log('navigateTo called with:', page, 'resolved to:', validPage, 'current page:', currentPage);
        setCurrentPage(validPage);
        // Update URL without reloading page for better UX
        window.history.pushState({}, '', `/${validPage}`);
        window.scrollTo(0, 0);
    }, [currentPage]);

    // Handle Auth0 authentication flow
    useEffect(() => {
        console.log('Auth0 state changed:', { isAuthenticated, currentPage, isLoading });
        
        // If user is authenticated and on welcome page, but they were trying to access admin
        // (this can happen after Auth0 redirect), navigate to admin dashboard
        if (isAuthenticated && currentPage === 'welcome' && !isLoading) {
            // Check if we came from Auth0 redirect by looking for previous admin intent
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('code') && urlParams.has('state')) {
                // User just authenticated via Auth0, redirect to admin dashboard
                console.log('Redirecting to admin dashboard after Auth0 callback');
                navigateTo('adminDashboard');
                return;
            }
        }
        
        // If user is authenticated and trying to access admin dashboard, ensure they stay there
        if (isAuthenticated && currentPage === 'adminDashboard') {
            // User is properly authenticated, no need to redirect
            console.log('User authenticated and on admin dashboard - staying here');
            return;
        }
        
        // If user is not authenticated and trying to access admin dashboard, 
        // they should see the authentication error message (handled in renderPage)
    }, [isAuthenticated, currentPage, isLoading, navigateTo]); 

    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname.substring(1) || 'welcome';
            console.log('handlePopState triggered, path:', path);
            setCurrentPage(path);
        };
        window.addEventListener('popstate', handlePopState);
        
        // Set initial page based on URL only on mount
        console.log('Setting initial page based on URL');
        const initialPath = window.location.pathname.substring(1) || 'welcome';
        console.log('Initial path from URL:', initialPath);
        setCurrentPage(initialPath);

        return () => window.removeEventListener('popstate', handlePopState);
    }, []); // Remove currentPage dependency to avoid infinite loops

    const renderPage = () => {
        console.log('renderPage called with currentPage:', currentPage, 'isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
        switch (currentPage) {
            case 'request': return <RequestFormPage navigateTo={navigateTo} />;
            case 'status': return <StatusCheckPage navigateTo={navigateTo} />;
            case 'about': return <AboutUsPage navigateTo={navigateTo} t={t} language={language} />;
            case 'adminLogin': 
                // Redirect to welcome since we now use Auth0 for authentication
                return <WelcomePage navigateTo={navigateTo} />;
            case 'adminDashboard': 
                // Handle Auth0 loading state and authentication for admin dashboard
                if (isLoading) {
                    return <LoadingIndicator message={t('loadingAuth')} />;
                }
                
                return isAuthenticated ? 
                    <AdminDashboardPage navigateTo={navigateTo} /> : 
                    <div className="text-center">
                        <Message type="error" title={t('authenticationRequired')} message={t('pleaseLoginToAccessAdmin')} />
                        <Button onClick={() => navigateTo('welcome')} className="mt-4">
                            {t('goToHomePage')}
                        </Button>
                    </div>;
            case 'payment-callback': return <PaymentCallbackPage />;
            case 'welcome': default: return <WelcomePage navigateTo={navigateTo} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <Navbar navigateTo={navigateTo} />
            <main className="container mx-auto p-4 sm:p-6 md:p-8 mt-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage + language} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderPage()}
                    </motion.div>
                </AnimatePresence>
            </main>
            <footer className="text-center py-8 mt-12 border-t border-gray-300 bg-gray-50">
                <div className="container mx-auto px-6 text-gray-600">
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{t('footerFollowUs')}</h4>
                        <div className="flex justify-center space-x-4">
                            <a href="https://www.snapchat.com/add/saytech" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-yellow-400"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.99 0 1.95-.14 2.85-.41-.09-.26-.15-.54-.15-.84V12h-2.5v-2H14.7v-1.61c0-1.3.62-2.61 1.77-3.19.58-.29 1.28-.4 2.03-.4.88 0 1.7.13 2.4.39v1.98h-1.15c-.61 0-1.05.26-1.05.82V10h2.4l-.39 2H17.7v8.75c2.56-.95 4.3-3.53 4.3-6.75 0-5.52-4.48-10-10-10zm7.5 4.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22-.5-.5-.22-.5-.5-.5z"/></svg></a>
                            <a href="https://www.youtube.com/@saytech" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582 7.416A2.486 2.486 0 0019.515 5.5H4.485A2.486 2.486 0 002.418 7.416 25.018 25.018 0 002 12a25.018 25.018 0 00.418 4.584A2.486 2.486 0 004.485 18.5h15.03a2.486 2.486 0 002.067-1.916A25.018 25.018 0 0022 12a25.018 25.018 0 00-.418-4.584zM9.75 15.5V8.5l6 3.5-6 3.5z"/></svg></a>
                            <a href="https://www.instagram.com/@saytech" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.023.047 1.351.058 3.807.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207-1.857-.344.467-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353-.3-.882-.344-1.857.047-1.023.058-1.351-.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg></a>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-8">© {new Date().getFullYear()} {t('footerRightsReserved', { year: ''})}</p> 
                    <p className="text-sm text-gray-500">{t('footerServiceLocation')}</p>
                </div>
            </footer>
        </div>
    );
}

export default function App() {
    return (
        <Auth0Provider>
            <LanguageProvider>
                <AppInternal />
            </LanguageProvider>
        </Auth0Provider>
    );
}

// --- New Payment Callback Page ---
const PaymentCallbackPage = () => {
    useEffect(() => {
        // This page runs inside the popup.
        // It reads the URL parameters from PayFort's redirect.
        const params = new URLSearchParams(window.location.search);
        const paymentResult = {
            status: params.get('status'),
            response_message: params.get('response_message'),
            transaction_id: params.get('transaction_id'), // Example param, might differ
            fort_id: params.get('fort_id'), // Example param, might differ
        };
        
        // It sends the result to the main window that opened it.
        if (window.opener) {
            // The second argument is the target origin. For security, this should be specific.
            // Using '*' is okay for local dev, but for production, use your actual domain.
            window.opener.postMessage(paymentResult, '*');
        }
        
        // It then closes itself.
        window.close();
    }, []);

    // Display a simple message while the script runs.
    return (
        <div style={{ fontFamily: 'sans-serif', textAlign: 'center', paddingTop: '50px' }}>
            <p>Processing payment... Please do not close this window.</p>
        </div>
    );
};

const MOCK_SERVICE_FEE = 2000;

const RequestFormPage = ({ navigateTo }) => {
    const { t, language } = useLanguage();
    const [submissionStatus, setSubmissionStatus] = useState('idle'); // idle, paying, success, error
    const [finalSubmissionInfo, setFinalSubmissionInfo] = useState(null);
    const [formMessage, setFormMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '', countryCode: '+966', localPhoneNumber: '', email: '', city: '',
        region: '', phoneModel: '', previouslyRepaired: '', deviceCondition: '',
        issueDescription: '', deviceImage: null,
    });
    const [isAgreementChecked, setIsAgreementChecked] = useState(false);
    const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    
    // This effect handles the response from the payment popup
    
    useEffect(() => {
        const handlePaymentMessage = async (event) => {
            // Optional: Check event.origin for security
            // if (event.origin !== "http://your-backend-domain.com") return;
            const { status, response_message, transaction_id, fort_id } = event.data;
            console.log("Payment response received:", event);
            if (status === "14" || (response_message && response_message.toLowerCase().includes('success'))) {
                const savedDataString = localStorage.getItem('pendingRequestData');
                if (savedDataString) {
                    try {
                        const savedData = JSON.parse(savedDataString);
                        const fullPhoneNumber = savedData.countryCode + savedData.localPhoneNumber;
                        
                        const serviceRequestData = {
                            ...savedData,
                            fullPhoneNumber,
                            transactionId: transaction_id,
                            fortId: fort_id,
                            deviceImageName: savedData.deviceImage ? savedData.deviceImage.name : null,
                        };
                        
                        delete serviceRequestData.countryCode;
                        delete serviceRequestData.localPhoneNumber;
                        delete serviceRequestData.deviceImage;

                        const requestResponse = await api.submitRequest(serviceRequestData);
                        setFinalSubmissionInfo({ ...requestResponse.request, phoneNumber: fullPhoneNumber });
                        setSubmissionStatus('success');
                    } catch (err) {
                        setFormMessage({ type: 'error', title: t('submissionFailedTitle'), text: err.message });
                        setSubmissionStatus('error');
                    } finally {
                        localStorage.removeItem('pendingRequestData');
                    }
                } else {
                    setFormMessage({ type: 'error', title: t('submissionFailedTitle'), text: "Missing request data." });
                    setSubmissionStatus('error');
                }
            } else {
                setFormMessage({ type: 'error', title: t('paymentFailedTitle'), text: t('paymentFailedWithReason', { reason: response_message || 'Unknown reason' }) });
                setSubmissionStatus('error');
                localStorage.removeItem('pendingRequestData');
            }
        };

        window.addEventListener('message', handlePaymentMessage);
        return () => window.removeEventListener('message', handlePaymentMessage);
    }, [t]);


    const handleProceedToPayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormMessage(null);
        setSubmissionStatus('paying');
        
        if (!isAgreementChecked) {
            setFormMessage({ type: 'error', title: t('errorAgreementRequiredTitle'), text: t('errorAgreementRequiredText') });
            setLoading(false);
            setSubmissionStatus('idle');
            return;
        }

        const requiredFields = ['fullName', 'countryCode', 'localPhoneNumber', 'email', 'city', 'region', 'phoneModel', 'previouslyRepaired', 'deviceCondition', 'issueDescription'];
        if (requiredFields.some(field => !formData[field])) {
            setFormMessage({ type: 'error', title: t('errorMissingInfoTitle'), text: t('errorMissingInfoText') });
            setLoading(false);
            setSubmissionStatus('idle');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setFormMessage({ type: 'error', title: t('errorInvalidEmailTitle'), text: t('errorInvalidEmailText') });
            setLoading(false);
            setSubmissionStatus('idle');
            return;
        }

        try {
            localStorage.setItem('pendingRequestData', JSON.stringify(formData));
            const paymentHtml = await api.initiatePayFortPayment({
                email: formData.email,
                amount: MOCK_SERVICE_FEE,
            });
            
            const paymentWindow = window.open('', '_blank', 'width=800,height=600');
            if (paymentWindow) {
                paymentWindow.document.write(paymentHtml);
                paymentWindow.document.close();
            } else {
                setFormMessage({ type: 'error', title: t('popupBlockedTitle'), text: t('popupBlockedText') });
                setSubmissionStatus('idle');
            }
        } catch(error) {
             setFormMessage({ type: 'error', title: t('submissionFailedTitle'), text: error.message || t('submissionFailedText') });
             localStorage.removeItem('pendingRequestData');
             setSubmissionStatus('idle');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "deviceImage") {
            setFormData(prev => ({ ...prev, [name]: files ? files[0] : null }));
            setFileName(files && files[0] ? files[0].name : "");
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const requiredStar = <span className="text-red-500">{t('requiredFieldIndicator')}</span>;

    // Final success/error view
    if (submissionStatus === 'success' && finalSubmissionInfo) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto text-center">
                 <Message type="success" title={t('requestSubmittedTitle')} message={t('requestSubmittedText')} />
                 <Alert variant="success" className="mt-6 text-left">
                    <CheckCircle className="h-5 w-5" />
                    <AlertTitle>{t('importantSaveInfoTitle')}</AlertTitle>
                    <AlertDescription>
                        <p className="mb-2">{t('importantSaveInfoText')}</p>
                        <ul className={cn("list-inside space-y-1 bg-green-100 p-3 rounded-md", language === 'ar' ? 'list-disc text-right' : 'list-disc text-left')}>
                            <li><strong>{t('requestIdLabel')}</strong> <span className="font-mono text-green-700">{finalSubmissionInfo.fortId}</span></li>
                            <li><strong>{t('transactionIdLabel')}</strong> <span className="font-mono text-green-700">{finalSubmissionInfo.transactionId}</span></li>
                        </ul>
                        <p className="mt-3">{t('contactWhatsAppText', {phoneNumber: finalSubmissionInfo.phoneNumber})}</p>
                         <Button variant="outline" size="sm" className="mt-4" onClick={() => navigateTo('status')}>{t('checkStatusNowButton')}</Button>
                    </AlertDescription>
                </Alert>
            </motion.div>
        );
    }
    
    if (submissionStatus === 'error') {
         return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto text-center">
                <Message type="error" title={formMessage.title} message={formMessage.text} />
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setSubmissionStatus('idle')}>
                    Try Again
                </Button>
            </motion.div>
        );
    }
    
    const countryCodes = [
        { value: '+966', label: '🇸🇦 +966 (KSA)' }, { value: '+971', label: '🇦🇪 +971 (UAE)' }, { value: '+974', label: '🇶🇦 +974 (Qatar)' },
        { value: '+973', label: '🇧🇭 +973 (Bahrain)' }, { value: '+968', label: '🇴🇲 +968 (Oman)' }, { value: '+965', label: '🇰🇼 +965 (Kuwait)' },
    ];
    const phoneModels = [
        { value: 'iPhone X', label: 'iPhone X / XR / XS' }, { value: 'iPhone 11', label: 'iPhone 11 / Pro / Max' },
        { value: 'iPhone 12', label: 'iPhone 12 / Mini / Pro / Max' }, { value: 'iPhone 13', label: 'iPhone 13 / Mini / Pro / Max' },
        { value: 'iPhone 14', label: 'iPhone 14 / Plus / Pro / Max' }, { value: 'iPhone 15', label: 'iPhone 15 / Plus / Pro / Max' },
        { value: 'iPhone SE (2nd Gen)', label: 'iPhone SE (2nd Gen)' }, { value: 'iPhone SE (3rd Gen)', label: 'iPhone SE (3rd Gen)' }, { value: 'Other', label: 'Other iPhone Model' },
    ];
    const deviceConditions = [
        { value: 'fell_in_water', labelKey: 'conditionFellInWater' }, { value: 'physical_damage', labelKey: 'conditionPhysicalDamage' },
        { value: 'no_power', labelKey: 'conditionNoPower' }, { value: 'screen_issue', labelKey: 'conditionScreenIssue' },
        { value: 'battery_issue', labelKey: 'conditionBatteryIssue' }, { value: 'software_issue', labelKey: 'conditionSoftwareIssue' }, { value: 'other', labelKey: 'conditionOther' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 max-w-2xl mx-auto"
        >
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">{t('requestServiceTitle')}</h2>
                <p className="text-gray-600 mt-2">{t('requestServiceSubtitle')}</p>
            </div>

            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle>{t('yourInformationTitle')}</CardTitle>
                    <CardDescription>{t('yourInformationDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProceedToPayment} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><Label htmlFor="fullName">{t('fullNameLabel')} {requiredStar}</Label><Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder={t('fullNamePlaceholder')} required className="mt-1" /></div>
                            <div><Label htmlFor="email">{t('emailLabel')} {requiredStar}</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder={t('emailPlaceholder')} required className="mt-1" /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="md:col-span-1"><Label htmlFor="countryCode">{t('countryCodeLabel')} {requiredStar}</Label><Select onValueChange={(v) => handleSelectChange('countryCode', v)} value={formData.countryCode}><SelectTrigger className="mt-1 w-full"><SelectValue placeholder={t('countryCodePlaceholder')} /></SelectTrigger><SelectContent>{countryCodes.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></div>
                            <div className="md:col-span-2"><Label htmlFor="localPhoneNumber">{t('localPhoneNumberLabel')} {requiredStar}</Label><Input id="localPhoneNumber" name="localPhoneNumber" value={formData.localPhoneNumber} onChange={handleChange} placeholder={t('localPhoneNumberPlaceholder')} required className="mt-1" /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div><Label htmlFor="city">{t('cityLabel')} {requiredStar}</Label><Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder={t('cityPlaceholder')} required className="mt-1" /></div>
                             <div><Label htmlFor="region">{t('regionLabel')} {requiredStar}</Label><Input id="region" name="region" value={formData.region} onChange={handleChange} placeholder={t('regionPlaceholder')} required className="mt-1" /></div>
                        </div>
                        <div className="pt-4 border-t mt-6 space-y-6">
                            <div><Label htmlFor="phoneModel">{t('phoneModelLabel')} {requiredStar}</Label><Select onValueChange={(v) => handleSelectChange('phoneModel', v)} value={formData.phoneModel}><SelectTrigger className="mt-1 w-full"><SelectValue placeholder={t('phoneModelSelectPlaceholder')} /></SelectTrigger><SelectContent>{phoneModels.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent></Select></div>
                            <div><Label htmlFor="previouslyRepaired">{t('previouslyRepairedLabel')} {requiredStar}</Label><Select onValueChange={(v) => handleSelectChange('previouslyRepaired', v)} value={formData.previouslyRepaired}><SelectTrigger className="mt-1 w-full"><SelectValue placeholder={t('previouslyRepairedPlaceholder')} /></SelectTrigger><SelectContent><SelectItem value="no">{t('noOption')}</SelectItem><SelectItem value="yes">{t('yesOption')}</SelectItem></SelectContent></Select></div>
                            <div><Label htmlFor="deviceCondition">{t('deviceConditionLabel')} {requiredStar}</Label><Select onValueChange={(v) => handleSelectChange('deviceCondition', v)} value={formData.deviceCondition}><SelectTrigger className="mt-1 w-full"><SelectValue placeholder={t('deviceConditionPlaceholder')} /></SelectTrigger><SelectContent>{deviceConditions.map(c => <SelectItem key={c.value} value={c.value}>{t(c.labelKey)}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                        <div><Label htmlFor="issueDescription">{t('issueDescriptionLabel')} {requiredStar}</Label><Textarea id="issueDescription" name="issueDescription" value={formData.issueDescription} onChange={handleChange} placeholder={t('issueDescriptionPlaceholder')} required className="mt-1" rows={4} /></div>
                        <div><Label htmlFor="deviceImage" className="flex items-center gap-2"><UploadCloud className="w-5 h-5 text-gray-500" />{t('deviceImageLabel')} {requiredStar}</Label><Input id="deviceImage" name="deviceImage" type="file" accept="image/*" onChange={handleChange} required className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>{fileName && <p className="text-xs text-gray-500 mt-1">{t('fileNameLabel')} {fileName}</p>}</div>
                        <div className="pt-4 border-t mt-6">
                            <p className="text-sm text-gray-600">{t('paymentCreditCard')}</p>
                        </div>
                        <div className={cn("flex items-start mt-6 pt-6 border-t", language === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2')}>
                            <input type="checkbox" id="agreement" checked={isAgreementChecked} onChange={(e) => setIsAgreementChecked(e.target.checked)} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0" />
                            <Label htmlFor="agreement" className="text-sm text-gray-700">{t('agreementCheckboxLabel')}{' '}<button type="button" onClick={() => setIsAgreementModalOpen(true)} className="text-blue-600 hover:underline font-medium">{t('viewAgreementLink')}</button></Label>
                        </div>
                        <AnimatePresence>{formMessage && <Message type={formMessage.type} title={formMessage.title} message={formMessage.text} />}</AnimatePresence>
                        <Button type="submit" className="w-full text-lg py-3" disabled={loading || !isAgreementChecked} size="lg">
                            {loading ? (<><Loader2 className={cn("h-5 w-5 animate-spin", language === 'ar' ? 'ml-2' : 'mr-2')} /> {t('submittingButton')}</>) : (<><CreditCard className={cn("h-5 w-5", language === 'ar' ? 'ml-2' : 'mr-2')} /> {t('proceedToPaymentButton')}</>)}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <AnimatePresence>{isAgreementModalOpen && <AgreementModal isOpen={isAgreementModalOpen} onClose={() => setIsAgreementModalOpen(false)} />}</AnimatePresence>
        </motion.div>
    );
};

const StatusCheckPage = ({ navigateTo }) => {
    const { t, language } = useLanguage();
    const [orderId, setOrderId] = useState('');
    const [statusData, setStatusData] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 

    const handleCheckStatus = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setStatusData(null);
        
        if (!orderId.trim()) { 
            setError({ title: t('errorMissingInfoTitle'), text: t('errorOrderIdRequired') }); 
            setLoading(false); 
            return; 
        }
        
        try {
            const result = await api.checkStatus(orderId.trim());
            if (result) { 
                setStatusData(result); 
                setError(null); 
            } else { 
                setError({ title: t('errorNotFoundTitle'), text: t('errorRequestNotFound') }); 
                setStatusData(null); 
            }
        } catch (err) {
            setError({ title: t('statusCheckFailedTitle'), text: err.message || t('statusCheckFailedTextDefault') });
            setStatusData(null);
        } finally { 
            setLoading(false); 
        }
    };
    
    const getStatusDisplay = (statusKey) => {
        const statusMap = {
            'paid': { text: t('statusPaid'), color: 'text-blue-600', icon: <Loader2 className="h-5 w-5 animate-spin" /> },
            'shipped': { text: t('statusShipped'), color: 'text-blue-600', icon: <Loader2 className="h-5 w-5 animate-spin" /> },
            'delivered': { text: t('statusDelivered'), color: 'text-purple-600', icon: <Loader2 className="h-5 w-5 animate-spin" /> },
            'evaluating_device': { text: t('statusEvaluatingDevice'), color: 'text-yellow-500', icon: <Loader2 className="h-5 w-5 animate-spin" /> },
            'data_recovered': { text: t('statusDataRecovered'), color: 'text-green-600', icon: <CheckCircle className="h-5 w-5" /> },
            'data_cant_recover': { text: t('statusDataCantRecover'), color: 'text-red-600', icon: <X className="h-5 w-5" /> },
            'pending': { text: t('statusPending'), color: 'text-yellow-600', icon: <Loader2 className="h-5 w-5 animate-spin" /> },
        };
        const display = statusMap[statusKey] || { text: t('statusUnknown'), color: 'text-gray-500', icon: <AlertCircle className="h-5 w-5" /> };
        display.icon = React.cloneElement(display.icon, { className: cn(display.icon.props.className, language === 'ar' ? 'ml-2' : 'mr-2') });
        return display;
    };

    return (
        <motion.div initial={{ opacity: 0, x: language === 'ar' ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-lg mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">{t('checkRequestStatusTitle')}</h2>
                <p className="text-gray-600 mt-2">{t('checkRequestStatusSubtitle')}</p>
            </div>
            <Card className="shadow-xl">
                <CardContent className="p-6">
                    <form onSubmit={handleCheckStatus} className="space-y-6">
                        <div>
                            <Label htmlFor="orderId">{t('orderIdLabel')}</Label>
                            <div className="relative mt-1">
                                <FileText className={cn("absolute h-5 w-5 text-gray-400 top-1/2 -translate-y-1/2", language === 'ar' ? "right-3" : "left-3")} />
                                <Input 
                                    id="orderId" 
                                    value={orderId} 
                                    onChange={(e) => setOrderId(e.target.value)} 
                                    placeholder={t('orderIdPlaceholder')} 
                                    className={cn(language === 'ar' ? "pr-10" : "pl-10")} 
                                    required 
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className={cn("h-4 w-4 animate-spin", language === 'ar' ? 'ml-2' : 'mr-2')} /> 
                                    {t('checkingStatusButton')}
                                </>
                            ) : (
                                t('checkStatusButton')
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <AnimatePresence>
                {error && <Message type="error" title={error.title} message={error.text} />}
            </AnimatePresence>
            {statusData && !error && (
                <Card className="shadow-lg mt-6">
                    <CardHeader>
                        <CardTitle>{t('requestStatusTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="py-3">
                            <h3 className="text-md font-semibold mb-2 text-blue-700">
                                {t('statusForRequestId', {requestId: statusData.requestId})}
                            </h3>
                            <div className={`flex items-center text-lg font-semibold p-3 rounded-md ${getStatusDisplay(statusData.status).color} bg-opacity-10 bg-${getStatusDisplay(statusData.status).color.split('-')[1]}-100`}>
                                {getStatusDisplay(statusData.status).icon}
                                {getStatusDisplay(statusData.status).text}
                            </div>
                            {statusData.message && (
                                <p className="text-sm text-gray-600 mt-2">{statusData.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </motion.div>
    );
};

const WelcomePage = ({ navigateTo }) => {
    const { t, language } = useLanguage();
    const [testimonials, setTestimonials] = useState([]);
    const [loadingTestimonials, setLoadingTestimonials] = useState(true);
    const [beforeAfterCases, setBeforeAfterCases] = useState([]);
    const [loadingBeforeAfter, setLoadingBeforeAfter] = useState(true);
    useEffect(() => { 
        api.getTestimonials().then(d => setTestimonials(Array.isArray(d) ? d : [])).catch(e => console.error(e)).finally(() => setLoadingTestimonials(false)); 
        api.getBeforeAfterCases().then(d => setBeforeAfterCases(Array.isArray(d) ? d : [])).catch(e => console.error(e)).finally(() => setLoadingBeforeAfter(false)); 
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

// --- UI Components ---
const Button = React.forwardRef(({ children, variant = 'default', size = 'default', className, ...props }, ref) => (<button ref={ref} className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", { default: "bg-blue-600 text-white hover:bg-blue-700/90", destructive: "bg-red-500 text-destructive-foreground hover:bg-red-600/90", outline: "border border-gray-300 bg-white hover:bg-gray-100 hover:text-accent-foreground", secondary: "bg-gray-200 text-secondary-foreground hover:bg-gray-300/80", ghost: "hover:bg-gray-100 hover:text-accent-foreground", link: "text-blue-600 underline-offset-4 hover:underline" }[variant], { default: "h-10 px-4 py-2", sm: "h-9 rounded-md px-3", lg: "h-11 rounded-md px-8", icon: "h-10 w-10" }[size], className)} {...props}>{children}</button>));
const Input = React.forwardRef(({ className, ...props }, ref) => { const { language } = useLanguage(); return <input ref={ref} className={cn("flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", language === 'ar' ? 'text-right' : 'text-left', className)} {...props} /> });
const Textarea = React.forwardRef(({ className, ...props }, ref) => { const { language } = useLanguage(); return <textarea ref={ref} className={cn("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", language === 'ar' ? 'text-right' : 'text-left', className)} {...props} /> });
const Label = React.forwardRef((props, ref) => <label ref={ref} className={cn("block text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", props.className)} {...props} />);
const Card = React.forwardRef((props, ref) => <div ref={ref} className={cn("rounded-lg border bg-white text-card-foreground shadow-sm", props.className)} {...props} />);
const CardHeader = React.forwardRef((props, ref) => <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", props.className)} {...props} />);
const CardTitle = React.forwardRef((props, ref) => <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", props.className)} {...props} />);
const CardDescription = React.forwardRef((props, ref) => <p ref={ref} className={cn("text-sm text-gray-500", props.className)} {...props} />);
const CardContent = React.forwardRef((props, ref) => <div ref={ref} className={cn("p-6 pt-0", props.className)} {...props} />);
const CardFooter = React.forwardRef((props, ref) => <div ref={ref} className={cn("flex items-center p-6 pt-0", props.className)} {...props} />);
const Alert = React.forwardRef(({ variant = 'default', ...props }, ref) => { const { language } = useLanguage(); return <div ref={ref} role="alert" className={cn("relative w-full rounded-lg border p-4", language === 'ar' ? "[&>svg~*]:pr-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:right-4 [&>svg]:top-4" : "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4", { default: "bg-background text-foreground", destructive: "border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500", success: "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600" }[variant], props.className)} {...props} /> });
const AlertDescription = React.forwardRef((props, ref) => <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", props.className)} {...props} />);
const AlertTitle = React.forwardRef((props, ref) => <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", props.className)} {...props} />);

const Select = ({ children, onValueChange, value: controlledValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(controlledValue || '');
    const [displayValue, setDisplayValue] = useState('');
    const selectRef = useRef(null);
    const { language } = useLanguage();
    useEffect(() => { if (controlledValue !== undefined) setSelectedValue(controlledValue); }, [controlledValue]);
    useEffect(() => {
        let foundDisplay = '';
        React.Children.forEach(children, child => { if (child.type === SelectContent) React.Children.forEach(child.props.children, item => { if (item.type === SelectItem && item.props.value === selectedValue) foundDisplay = item.props.children; }); });
        if (foundDisplay) setDisplayValue(foundDisplay);
        else React.Children.forEach(children, child => { if (child.type === SelectTrigger) React.Children.forEach(child.props.children, triggerChild => { if (triggerChild.type === SelectValue) setDisplayValue(triggerChild.props.placeholder); }); });
    }, [selectedValue, children, language]);
    const handleSelect = (val, display) => { setSelectedValue(val); if (onValueChange) onValueChange(val); setIsOpen(false); };
    useEffect(() => {
        const handleClickOutside = (event) => { if (selectRef.current && !selectRef.current.contains(event.target)) setIsOpen(false); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return <SelectContext.Provider value={{ isOpen, setIsOpen, selectedValue, handleSelect, displayValue, language }}><div className="relative" ref={selectRef}>{children}</div></SelectContext.Provider>;
};
const SelectContent = ({ children, className }) => { const { isOpen } = useContext(SelectContext); if (!isOpen) return null; return <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className={cn("absolute z-50 min-w-[8rem] w-full overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md mt-1", className)}>{children}</motion.div>; };
const SelectItem = ({ children, value, className }) => { const { handleSelect, selectedValue, language } = useContext(SelectContext); const isSelected = selectedValue === value; return <div onClick={() => handleSelect(value, children)} className={cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-100", language === 'ar' ? "pr-8 pl-2 text-right" : "pl-8 pr-2 text-left", isSelected && "font-semibold bg-gray-100", className)}>{children}{isSelected && <Check className={cn("absolute h-4 w-4", language === 'ar' ? "right-2" : "left-2")} />}</div>; };
const SelectTrigger = ({ children, className }) => { const { setIsOpen, isOpen, language } = useContext(SelectContext); return <button type="button" onClick={() => setIsOpen(!isOpen)} className={cn("flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}>{language === 'ar' && (isOpen ? <ChevronUp className="h-4 w-4 opacity-50 me-auto" /> : <ChevronDown className="h-4 w-4 opacity-50 me-auto" />)}{children}{language === 'en' && (isOpen ? <ChevronUp className="h-4 w-4 opacity-50 ms-auto" /> : <ChevronDown className="h-4 w-4 opacity-50 ms-auto" />)}</button>; };
const SelectValue = ({ placeholder }) => { const { displayValue, selectedValue } = useContext(SelectContext); return <span className={cn(!selectedValue && placeholder ? "text-gray-500" : "", "truncate")}>{displayValue || placeholder}</span>; };
const LoadingIndicator = ({ message }) => { const { t, language } = useLanguage(); return <div className="flex items-center justify-center p-4 my-4"><Loader2 className="animate-spin h-6 w-6 text-blue-600" /><span className={cn("text-gray-600 text-lg", language === 'ar' ? 'mr-3' : 'ms-3')}>{message || t('loadingMessage')}</span></div>; };
const Message = ({ type, title, message, children }) => { const { language } = useLanguage(); return <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={cn('p-4 rounded-md my-4 border', type === 'success' ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800')}><div className="flex"><div className="flex-shrink-0">{type === 'success' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}</div><div className={language === 'ar' ? "mr-3" : "ml-3"}>{title && <h3 className="text-sm font-medium">{title}</h3>}<div className={cn("text-sm", title && "mt-2")}>{message}{children}</div></div></div></motion.div>; };
const AgreementModal = ({ isOpen, onClose }) => { const { t, language } = useLanguage(); if (!isOpen) return null; return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[60]" onClick={onClose}><Card className="w-full max-w-2xl bg-white shadow-2xl rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}><CardHeader className="bg-gray-100 border-b"><div className="flex justify-between items-center"><CardTitle className="flex items-center text-xl md:text-2xl"><FileCheck2 className={cn("h-6 w-6 text-blue-600", language === 'ar' ? 'ml-2' : 'mr-2')} />{t('agreementModalTitle')}</CardTitle><Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5"/></Button></div></CardHeader><CardContent className="p-6 max-h-[70vh] overflow-y-auto prose prose-sm max-w-none"><p>{t('agreementTextLine1')}</p><h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementServiceTitle')}</h3><p>{t('agreementServiceText1')}</p></CardContent><CardFooter className="bg-gray-100 border-t"><Button onClick={onClose} className="w-full" size="lg"><CheckCircle className={cn("h-5 w-5", language === 'ar' ? 'ml-2' : 'mr-2')} />{t('iAgreeButton')}</Button></CardFooter></Card></motion.div>; };
