import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   Phone, Mail, MessageCircle, Store, Globe, Loader2, X, ChevronLeft, ChevronRight, Search,
   Lock, CheckCircle, KeyRound, CreditCard, UploadCloud, FileCheck2, Tag, ListFilter, 
   FileText, Truck, Wrench, Send, Users, SmartphoneNfc, Star, Check, ChevronUp, ChevronDown,
   AlertCircle, ShieldCheck, MessageSquare, User, AtSign
} from 'lucide-react';

// --- Utility Functions ---
const cn = (...inputs) => inputs.filter(Boolean).join(' ');

// --- Translations ---
const translations = {
    en: {
        // Navbar
        navHome: "Home",
        navNewRequest: "New Request",
        navCheckStatus: "Check Status",
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
        paymentMethodLabel: "Preferred Payment Method",
        paymentMethodPlaceholder: "Select a payment method",
        paymentCreditCard: "Credit/Debit Card (via Amazon Payment Services)",
        paymentApplePay: "Apple Pay (via Amazon Payment Services)",
        paymentMada: "Mada (via Amazon Payment Services)",
        paymentSTCPay: "STC Pay (via Amazon Payment Services)",
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
        verificationCodeLabel: "Verification Code:",
        transactionIdLabel: "Transaction ID:",
        contactWhatsAppText: "We will contact you via WhatsApp at {phoneNumber} to arrange the shipment of your device.",
        checkStatusNowButton: "Check Status Now",
        paymentConfirmationTitle: "Confirming Your Payment",
        paymentConfirmationText: "Please wait while we confirm your payment status...",
        paymentSuccessfulTitle: "Payment Successful!",
        paymentSuccessfulText: "Your payment was processed successfully. We are now creating your service request.",
        paymentFailedTitle: "Payment Failed",
        paymentFailedText: "The payment could not be completed. Please try submitting the form again.",
        paymentFailedWithReason: "Payment failed: {reason}. Please try again.",
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
        requiredFieldIndicator: "*",
    },
    ar: {
        // Navbar
        navHome: "الرئيسية",
        navNewRequest: "طلب جديد",
        navCheckStatus: "تحقق من الحالة",
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
        paymentMethodLabel: "طريقة الدفع المفضلة",
        paymentMethodPlaceholder: "اختر طريقة الدفع",
        paymentCreditCard: "بطاقة ائتمان/خصم (عبر خدمات أمازون للدفع)",
        paymentApplePay: "آبل باي (عبر خدمات أمازون للدفع)",
        paymentMada: "مدى (عبر خدمات أمازون للدفع)",
        paymentSTCPay: "STC Pay (عبر خدمات أمازون للدفع)",
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
        verificationCodeLabel: "رمز التحقق:",
        transactionIdLabel: "معرف المعاملة:",
        contactWhatsAppText: "سنتواصل معك عبر الواتساب على الرقم {phoneNumber} لترتيب شحن الجهاز.",
        checkStatusNowButton: "تحقق من الحالة الآن",
        paymentConfirmationTitle: "تأكيد الدفع الخاص بك",
        paymentConfirmationText: "يرجى الانتظار بينما نؤكد حالة الدفع الخاصة بك...",
        paymentSuccessfulTitle: "تم الدفع بنجاح!",
        paymentSuccessfulText: "تمت معالجة دفعتك بنجاح. نحن الآن بصدد إنشاء طلب الخدمة الخاص بك.",
        paymentFailedTitle: "فشل الدفع",
        paymentFailedText: "تعذر إتمام الدفع. يرجى محاولة إرسال النموذج مرة أخرى.",
        paymentFailedWithReason: "فشل الدفع: {reason}. يرجى المحاولة مرة أخرى.",
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
        requiredFieldIndicator: "*",
    }
};

// --- API Service ---
const MOCK_TESTIMONIALS = [
    {
        id: 1,
        nameKey: 'testimonial1Name',
        deviceKey: 'testimonial1Device',
        quoteKey: 'testimonial1Quote',
        avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=User1',
        rating: 5
    },
    {
        id: 2,
        nameKey: 'testimonial2Name',
        deviceKey: 'testimonial2Device',
        quoteKey: 'testimonial2Quote',
        avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=User2',
        rating: 5
    },
    {
        id: 3,
        nameKey: 'testimonial3Name',
        deviceKey: 'testimonial3Device',
        quoteKey: 'testimonial3Quote',
        avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=User3',
        rating: 5
    }
];

const MOCK_BEFORE_AFTER_CASES = [
    { id: 'ba1', beforeTitleKey: 'beforeTitle', beforeDescriptionKey: 'beforeDescription1', beforeImageAltKey: 'beforeImageAlt1', beforeImage: 'https://placehold.co/600x400/FF7272/FFFFFF?text=Damaged+Screen&font=roboto', afterTitleKey: 'afterTitle', afterDescriptionKey: 'afterDescription1', afterImageAltKey: 'afterImageAlt1', afterImage: 'https://placehold.co/600x400/72FFB3/FFFFFF?text=Screen+Data+Recovered!&font=roboto' },
    { id: 'ba2', beforeTitleKey: 'beforeTitle', beforeDescriptionKey: 'beforeDescription2', beforeImageAltKey: 'beforeImageAlt2', beforeImage: 'https://placehold.co/600x400/A0AEC0/FFFFFF?text=Water+Damage&font=roboto', afterTitleKey: 'afterTitle', afterDescriptionKey: 'afterDescription2', afterImageAltKey: 'afterImageAlt2', afterImage: 'https://placehold.co/600x400/A0E8FF/FFFFFF?text=Contacts+Restored!&font=roboto' },
    { id: 'ba3', beforeTitleKey: 'beforeTitle', beforeDescriptionKey: 'beforeDescription1', beforeImageAltKey: 'beforeImageAlt1', beforeImage: 'https://placehold.co/600x400/F56565/FFFFFF?text=No+Power&font=roboto', afterTitleKey: 'afterTitle', afterDescriptionKey: 'afterDescription1', afterImageAltKey: 'afterImageAlt1', afterImage: 'https://placehold.co/600x400/9AE6B4/FFFFFF?text=Bootloop+Fixed,+Data+Safe!&font=roboto' },
];

const api = {
    // New function to initiate payment with Amazon Payment Services (PayFort)
    initiatePayFortPayment: async ({ email, amount }) => {
        const response = await fetch('http://localhost:8080/api/payment/initiate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, amount }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to initiate payment' }));
            throw new Error(errorData.message || 'Payment initiation failed');
        }
        
        // Assuming the response contains a redirect_url
        return response.json(); 
    },
    
    submitRequest: async (requestData) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // This would be a real API call to your backend to save the request details
        console.log("Submitting service request to backend:", requestData);
        return {
            requestId: `REQ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            verificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
            transactionId: requestData.transactionId // Pass through the transaction ID
        };
    },
    
    checkStatusByNamePhoneEmail: async (fullName, phoneNumber, email) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log(`Checking status for: ${fullName}, ${phoneNumber}, ${email}`);
        
        const mockRequests = [
            { requestId: 'REQ-ABC123', customerName: 'Ahmed Al-Mansoori', phoneNumber: '+966501234567', email: 'ahmed@example.com', phoneInfo: 'iPhone 13 Pro', status: 'evaluating_device', issue: 'Water damage', paymentInfo: 'Credit Card (Amazon Payment Services)', transactionId: 'TXN-AMZ-123' },
            { requestId: 'REQ-DEF456', customerName: 'Fatima Al-Zahrani', phoneNumber: '+966507654321', email: 'fatima@example.com', phoneInfo: 'iPhone 12', status: 'data_recovered', issue: 'Screen broken', paymentInfo: 'Mada (Amazon Payment Services)', transactionId: 'TXN-AMZ-456' },
        ];

        const foundRequests = mockRequests.filter(req => 
            req.customerName.toLowerCase() === fullName.toLowerCase() &&
            req.phoneNumber === phoneNumber &&
            req.email.toLowerCase() === email.toLowerCase()
        );

        if (foundRequests.length > 0) {
            return foundRequests;
        }

        return [];
    },

    getRequests: async (page = 0, size = 10, searchTerm = '', statusFilter = 'all') => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockRequests = [
            { requestId: 'REQ-ABC123', customerName: 'Ahmed Ali', phoneNumber: '+966501234567', phoneInfo: 'iPhone 13 Pro', status: 'evaluating_device', email: 'ahmed@example.com', issue: 'Water damage', paymentInfo: 'Credit Card (Amazon Payment Services)', transactionId: 'TXN-AMZ-123' },
            { requestId: 'REQ-DEF456', customerName: 'Fatima Hassan', phoneNumber: '+966507654321', phoneInfo: 'iPhone 12', status: 'data_recovered', email: 'fatima@example.com', issue: 'Screen broken', paymentInfo: 'Mada (Amazon Payment Services)', transactionId: 'TXN-AMZ-456' },
            { requestId: 'REQ-GHI789', customerName: 'Omar Khaled', phoneNumber: '+966509876543', phoneInfo: 'iPhone 11', status: 'pending', email: 'omar@example.com', issue: 'Not turning on', paymentInfo: 'N/A', transactionId: 'N/A' },
        ];
        return { 
            requests: mockRequests, 
            currentPage: page, 
            totalPages: 1, 
            totalItems: mockRequests.length 
        };
    },

    updateStatus: async (requestId, newStatus) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
    },

    loginAdmin: async (username, password) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (username === 'admin' && password === 'admin123') {
            return { success: true, token: 'mock-admin-token' };
        }
        return { success: false, message: 'Invalid credentials' };
    },

    getTestimonials: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return MOCK_TESTIMONIALS;
    },

    getBeforeAfterCases: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return MOCK_BEFORE_AFTER_CASES;
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
    
    const toggleLanguage = () => {
        setLanguage(prevLang => prevLang === 'en' ? 'ar' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

// --- Navbar Component ---
const Navbar = ({ navigateTo, adminToken, onLogout }) => {
    const { t, language, toggleLanguage } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const handleNavigate = (page) => {
        navigateTo(page);
        setIsMobileMenuOpen(false);
    };
    
    return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <div className="text-xl sm:text-2xl font-bold cursor-pointer flex items-center" onClick={() => handleNavigate('welcome')}>
                    <Store className={cn("w-6 h-6 sm:w-7 sm:h-7 text-blue-400", language === 'ar' ? 'ml-2' : 'mr-2')} />
                    <span className="text-blue-400">{t('welcomeTitle').split(' ')[0]}</span>
                    <span className="text-white">{t('welcomeTitle').split(' ')[1]}</span>
                </div>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
                    <button onClick={() => navigateTo('welcome')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navHome')}</button>
                    <button onClick={() => navigateTo('request')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navNewRequest')}</button>
                    <button onClick={() => navigateTo('status')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navCheckStatus')}</button>
                    {adminToken ? (
                        <>
                            <button onClick={() => navigateTo('adminDashboard')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navAdminDashboard')}</button>
                            <Button 
                                onClick={onLogout} 
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                            >
                                {t('navLogout')}
                            </Button>
                        </>
                    ) : (
                        <Button 
                            onClick={() => navigateTo('adminLogin')} 
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                        >
                            {t('navAdminLogin')}
                        </Button>
                    )}
                    <Button 
                        onClick={toggleLanguage} 
                        className="text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white px-3 py-1.5 rounded-md text-sm transition-colors flex items-center"
                    >
                         <Globe className={cn("h-4 w-4", language === 'ar' ? 'ml-1.5' : 'mr-1.5')} /> {t('languageSwitch')}
                    </Button>
                </div>
                
                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                    <Button 
                        onClick={toggleLanguage} 
                        className="text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white px-2 py-1 rounded-md text-xs transition-colors flex items-center mr-2"
                    >
                         <Globe className="h-4 w-4" />
                    </Button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    >
                        <span className="sr-only">Open main menu</span>
                        {isMobileMenuOpen ? (
                            <X className="block h-6 w-6" />
                        ) : (
                            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="md:hidden overflow-hidden"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800">
                        <button 
                            onClick={() => handleNavigate('welcome')} 
                            className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                        >
                            {t('navHome')}
                        </button>
                        <button 
                            onClick={() => handleNavigate('request')} 
                            className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                        >
                            {t('navNewRequest')}
                        </button>
                        <button 
                            onClick={() => handleNavigate('status')} 
                            className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                        >
                            {t('navCheckStatus')}
                        </button>
                        {adminToken ? (
                            <>
                                <button 
                                    onClick={() => handleNavigate('adminDashboard')} 
                                    className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                                >
                                    {t('navAdminDashboard')}
                                </button>
                                <button 
                                    onClick={() => {
                                        onLogout();
                                        setIsMobileMenuOpen(false);
                                    }} 
                                    className="text-red-400 hover:text-white hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                                >
                                    {t('navLogout')}
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => handleNavigate('adminLogin')} 
                                className="text-blue-400 hover:text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                            >
                                {t('navAdminLogin')}
                            </button>
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
    const { t, language } = useLanguage();
    const [currentPage, setCurrentPage] = useState('welcome');
    const [adminToken, setAdminToken] = useState(null);

    const navigateTo = useCallback((page) => {
        const validPage = (typeof page === 'string' && page.trim() !== '') ? page.trim() : 'welcome';
        setCurrentPage(validPage);
        window.scrollTo(0, 0);
    }, []); 

    const handleAdminLogin = (token) => {
        setAdminToken(token);
    };

    const handleAdminLogout = () => {
        setAdminToken(null);
        navigateTo('welcome');
    };

    // Simple routing based on currentPage state
    useEffect(() => {
        const path = window.location.pathname;
        if (path.startsWith('/payment-confirmation')) {
            setCurrentPage('payment-confirmation');
        }
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case 'request': return <RequestFormPage navigateTo={navigateTo} />;
            case 'status': return <StatusCheckPage navigateTo={navigateTo} />;
            case 'adminLogin': return <AdminLoginPage onLoginSuccess={handleAdminLogin} navigateTo={navigateTo} />;
            case 'adminDashboard': return adminToken ? <AdminDashboardPage adminToken={adminToken} navigateTo={navigateTo} /> : <AdminLoginPage onLoginSuccess={handleAdminLogin} navigateTo={navigateTo} />;
            case 'payment-confirmation': return <PaymentConfirmationPage navigateTo={navigateTo} />;
            case 'welcome': default: return <WelcomePage navigateTo={navigateTo} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <Navbar navigateTo={navigateTo} adminToken={adminToken} onLogout={handleAdminLogout} />
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
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('footerContactUs')}</h3>
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div className="flex flex-col items-center">
                            <Mail className="w-8 h-8 text-blue-600 mb-2"/>
                            <p className="font-semibold">{t('footerEmail')}</p>
                            <a href="mailto:info@saytech.sa" className="text-blue-500 hover:text-blue-700">info@saytech.sa</a>
                        </div>
                        <div className="flex flex-col items-center">
                            <Phone className="w-8 h-8 text-blue-600 mb-2"/>
                            <p className="font-semibold">{t('footerPhone')}</p>
                            <a href="tel:+966501234567" className="text-blue-500 hover:text-blue-700" dir="ltr">+966 50 123 4567</a>
                        </div>
                        <div className="flex flex-col items-center">
                           <MessageCircle className="w-8 h-8 text-green-500 mb-2"/>
                            <p className="font-semibold">WhatsApp</p>
                            <a href="https://wa.me/966501234567" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700"  dir="ltr">+966 50 123 4567</a>
                        </div>
                    </div>
                     <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{t('footerFollowUs')}</h4>
                        <div className="flex justify-center space-x-4">
                            {/* Snapchat Icon */}
                            <a href="https://www.snapchat.com/add/saytech" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-yellow-400">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.99 0 1.95-.14 2.85-.41-.09-.26-.15-.54-.15-.84V12h-2.5v-2H14.7v-1.61c0-1.3.62-2.61 1.77-3.19.58-.29 1.28-.4 2.03-.4.88 0 1.7.13 2.4.39v1.98h-1.15c-.61 0-1.05.26-1.05.82V10h2.4l-.39 2H17.7v8.75c2.56-.95 4.3-3.53 4.3-6.75 0-5.52-4.48-10-10-10zm7.5 4.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22-.5-.5-.22-.5-.5-.5z"/>
                                </svg>
                                <span className="sr-only">Snapchat</span>
                            </a>
                            {/* YouTube Icon */}
                            <a href="https://www.youtube.com/@saytech" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M21.582 7.416A2.486 2.486 0 0019.515 5.5H4.485A2.486 2.486 0 002.418 7.416 25.018 25.018 0 002 12a25.018 25.018 0 00.418 4.584A2.486 2.486 0 004.485 18.5h15.03a2.486 2.486 0 002.067-1.916A25.018 25.018 0 0022 12a25.018 25.018 0 00-.418-4.584zM9.75 15.5V8.5l6 3.5-6 3.5z"/>
                                </svg>
                                <span className="sr-only">YouTube</span>
                            </a>
                            {/* Instagram Icon */}
                            <a href="https://www.instagram.com/@saytech" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.023.047 1.351.058 3.807.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207-1.857-.344.467-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353-.3-.882-.344-1.857.047-1.023.058-1.351-.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                                <span className="sr-only">Instagram</span>
                            </a>
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
        <LanguageProvider>
            <AppInternal />
        </LanguageProvider>
    );
}

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

const AdminDashboardPage = ({ adminToken, navigateTo }) => {
    const { t, language } = useLanguage();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [tableLoading, setTableLoading] = useState(false); 
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [updateMessage, setUpdateMessage] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const ITEMS_PER_PAGE = 10;
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); 

    const fetchRequests = useCallback(async (pageToFetch = 0, currentSearchTerm = searchTerm, currentStatusFilter = statusFilter) => {
        if (pageToFetch === 0 && requests.length === 0 && !error && !currentSearchTerm && currentStatusFilter === 'all') {
            setLoading(true);
        } else {
            setTableLoading(true);
        }
        setError(null);

        try {
            const response = await api.getRequests(pageToFetch, ITEMS_PER_PAGE, currentSearchTerm, currentStatusFilter);
            setRequests(response.requests || []);
            setTotalPages(response.totalPages || 0);
            setCurrentPage(response.currentPage !== undefined ? response.currentPage : pageToFetch);
        } catch (err) {
            setError(err.message || t('failedToFetchRequests'));
            setRequests([]); 
            setTotalPages(0);
            setCurrentPage(0);
        } finally {
            setLoading(false);
            setTableLoading(false);
        }
    }, [t, ITEMS_PER_PAGE, requests.length, error, searchTerm, statusFilter]);

    useEffect(() => {
        if (!adminToken) {
            navigateTo('adminLogin');
        } else {
            fetchRequests(0, searchTerm, statusFilter);
        }
    }, [adminToken, navigateTo, searchTerm, statusFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(searchInput); 
        setCurrentPage(0); 
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setSearchTerm('');
        setCurrentPage(0);
    };

    const handleFilterChange = (newFilter) => {
        setStatusFilter(newFilter);
        setCurrentPage(0); 
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
            fetchRequests(newPage, searchTerm, statusFilter);
        }
    };
    
    // Calculate statistics
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        inProgress: requests.filter(r => ['paid', 'shipped', 'delivered', 'evaluating_device'].includes(r.status)).length,
        completed: requests.filter(r => ['data_recovered', 'data_cant_recover'].includes(r.status)).length,
        successRate: requests.length > 0 ? 
            Math.round((requests.filter(r => r.status === 'data_recovered').length / 
            requests.filter(r => ['data_recovered', 'data_cant_recover'].includes(r.status)).length) * 100) || 0 : 0
    };
    
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        return (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t bg-gray-50">
                <div className="text-sm text-gray-700">
                    Showing {currentPage * ITEMS_PER_PAGE + 1} to {Math.min((currentPage + 1) * ITEMS_PER_PAGE, requests.length)} of {totalPages * ITEMS_PER_PAGE} results
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0 || tableLoading}
                        className="flex items-center"
                    >
                        <ChevronLeft className={cn("h-4 w-4", language === 'ar' ? 'ml-1' : 'mr-1')} />
                        <span className="hidden sm:inline">{t('previousPage')}</span>
                    </Button>
                    <div className="flex items-center gap-1">
                        {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                            let pageNum = idx;
                            if (totalPages > 5) {
                                if (currentPage < 3) {
                                    pageNum = idx;
                                } else if (currentPage > totalPages - 4) {
                                    pageNum = totalPages - 5 + idx;
                                } else {
                                    pageNum = currentPage - 2 + idx;
                                }
                            }
                            if (pageNum >= 0 && pageNum < totalPages) {
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={pageNum === currentPage ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNum)}
                                        disabled={tableLoading}
                                        className="w-10 h-10"
                                    >
                                        {pageNum + 1}
                                    </Button>
                                );
                            }
                            return null;
                        })}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1 || tableLoading}
                        className="flex items-center"
                    >
                        <span className="hidden sm:inline">{t('nextPage')}</span>
                        <ChevronRight className={cn("h-4 w-4", language === 'ar' ? 'mr-1' : 'ml-1')} />
                    </Button>
                </div>
            </div>
        );
    };

    const handleUpdateRequestStatus = async (requestId) => {
        if (!newStatus || !selectedRequest || selectedRequest.requestId !== requestId) return;
        setUpdatingStatus(true); setUpdateMessage(null);
        try {
            const result = await api.updateStatus(requestId, newStatus);
             if (result.success) {
                setUpdateMessage({type: 'success', text: t('statusUpdateSuccessText', {requestId, newStatus: t(formatStatusKey(newStatus)) || newStatus })});
                fetchRequests(currentPage, searchTerm, statusFilter); 
                setSelectedRequest(prev => prev ? {...prev, status: newStatus} : null);
            } else {
                setUpdateMessage({type: 'error', text: result.message || t('statusUpdateFailedText')});
            }
        } catch (err) {
            setUpdateMessage({type: 'error', text: err.message || t('statusUpdateErrorText')});
        } finally { setUpdatingStatus(false); }
    };
    
    const statusOptions = [
        { value: 'pending', labelKey: 'statusOptionPending' },
        { value: 'paid', labelKey: 'statusOptionPaid' },
        { value: 'evaluating_device', labelKey: 'statusOptionEvaluatingDevice'},
        { value: 'shipped', labelKey: 'statusOptionShipped' },
        { value: 'delivered', labelKey: 'statusOptionDelivered' },
        { value: 'data_recovered', labelKey: 'statusOptionDataRecovered' },
        { value: 'data_cant_recover', labelKey: 'statusOptionDataCantRecover' },
    ];

    const formatStatusKey = (statusValue) => {
        if (!statusValue) return 'statusOptionUnknown';
        return `statusOption${statusValue
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('')}`;
    };

    const getStatusColor = (status) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'data_recovered': return 'bg-green-100 text-green-800 border-green-200';
            case 'data_cant_recover': return 'bg-red-100 text-red-800 border-red-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'paid': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'delivered': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'evaluating_device': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) return <LoadingIndicator message={t('loadingAdminDashboard')} />; 
    if (error && requests.length === 0 && !searchTerm && statusFilter === 'all') return (
        <div className="space-y-6">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">{t('adminDashboardTitle')}</h2>
                 <Button onClick={() => fetchRequests(0, searchTerm, statusFilter)} variant="outline" size="sm" disabled={tableLoading || loading}>
                    <Loader2 className={cn("h-4 w-4", (tableLoading || loading) ? 'animate-spin':'', language === 'ar' ? 'ml-2' : 'mr-2')} /> {t('refreshRequestsButton')}
                </Button>
            </div>
            <Message type="error" title={t('errorLoadingDashboardTitle')} message={error} />
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">{t('adminDashboardTitle')}</h2>
                    <p className="text-gray-600 mt-1">Manage and track all data recovery requests</p>
                </div>
                <Button onClick={() => fetchRequests(currentPage, searchTerm, statusFilter)} variant="outline" size="default" disabled={tableLoading} className="flex-shrink-0">
                    <Loader2 className={cn("h-4 w-4", tableLoading ? 'animate-spin':'', language === 'ar' ? 'ml-2' : 'mr-2')} /> {t('refreshRequestsButton')}
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="border-l-4 border-yellow-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <AlertCircle className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="border-l-4 border-indigo-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">In Progress</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                            </div>
                            <div className="p-3 bg-indigo-100 rounded-full">
                                <Loader2 className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="border-l-4 border-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card className="shadow-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                        <div className="w-full lg:w-auto">
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">{t('filterByStatus')}</Label>
                            <div className="inline-flex rounded-lg shadow-sm" role="group">
                                {['all', 'inProgress', 'done'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => handleFilterChange(filter)}
                                        className={cn(
                                            "px-4 py-2 text-sm font-medium transition-colors",
                                            filter === 'all' ? 'rounded-l-lg' : '',
                                            filter === 'done' ? 'rounded-r-lg' : '',
                                            filter !== 'all' && filter !== 'done' ? 'border-l border-r' : '',
                                            statusFilter === filter 
                                                ? 'bg-blue-600 text-white border-blue-600 z-10' 
                                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                        )}
                                    >
                                        {t(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <form onSubmit={handleSearch} className="flex-grow flex items-end gap-2 w-full lg:w-auto lg:max-w-md">
                             <div className="relative flex-grow">
                                <Label htmlFor="adminSearchInput" className="sr-only">{t('searchPlaceholder')}</Label>
                                <div className="relative">
                                    <Search className={cn("absolute h-5 w-5 text-gray-400 top-1/2 -translate-y-1/2", language === 'ar' ? "right-3" : "left-3")} />
                                    <Input 
                                        id="adminSearchInput"
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        placeholder={t('searchPlaceholder')}
                                        className={cn("h-10", language === 'ar' ? "pr-10 pl-3" : "pl-10 pr-3")}
                                    />
                                </div>
                            </div>
                            <Button type="submit" variant="default" size="default" disabled={tableLoading} className="h-10 px-6">
                                {t('searchButton')}
                            </Button>
                            {searchTerm && (
                                <Button type="button" variant="outline" size="default" onClick={handleClearSearch} disabled={tableLoading} className="h-10">
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </form>
                    </div>
                </CardContent>
            </Card>
            
            {error && <Message type="error" title={t('errorLoadingDashboardTitle')} message={error} />}
            {updateMessage && <Message type={updateMessage.type} message={updateMessage.text} />}

            {/* Table */}
            <Card className="shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className={cn("px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider", language === 'ar' ? 'text-right' : 'text-left')}>{t('tableHeaderRequestId')}</th>
                                <th className={cn("px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider", language === 'ar' ? 'text-right' : 'text-left')}>{t('tableHeaderCustomer')}</th>
                                <th className={cn("px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell", language === 'ar' ? 'text-right' : 'text-left')}>{t('tableHeaderPhoneModel')}</th>
                                <th className={cn("px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider", language === 'ar' ? 'text-right' : 'text-left')}>{t('tableHeaderStatus')}</th>
                                <th className={cn("px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider", language === 'ar' ? 'text-right' : 'text-left')}>{t('tableHeaderActions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tableLoading ? ( 
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                                            <span className="text-gray-600">{t('loadingRequests')}</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : requests.length > 0 ? (
                                requests.map((req) => (
                                    <tr key={req.requestId} className="hover:bg-gray-50 transition-colors">
                                        <td className={cn("px-6 py-4 whitespace-nowrap", language === 'ar' ? 'text-right' : 'text-left')}>
                                            <div className="text-sm font-medium text-gray-900">{req.requestId}</div>
                                            <div className="text-sm text-gray-500 md:hidden">{req.phoneInfo}</div>
                                        </td>
                                        <td className={cn("px-6 py-4 whitespace-nowrap", language === 'ar' ? 'text-right' : 'text-left')}>
                                            <div className="text-sm font-medium text-gray-900">{req.customerName || 'N/A'}</div>
                                            <div className="text-sm text-gray-500">{req.phoneNumber}</div>
                                        </td>
                                        <td className={cn("px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell", language === 'ar' ? 'text-right' : 'text-left')}>{req.phoneInfo}</td>
                                        <td className={cn("px-6 py-4 whitespace-nowrap", language === 'ar' ? 'text-right' : 'text-left')}>
                                            <span className={cn(
                                                "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border",
                                                getStatusColor(req.status)
                                            )}>
                                                {t(formatStatusKey(req.status)) || req.status}
                                            </span>
                                        </td>
                                        <td className={cn("px-6 py-4 whitespace-nowrap text-sm font-medium", language === 'ar' ? 'text-left' : 'text-right')}>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => { setSelectedRequest(req); setNewStatus(req.status); setUpdateMessage(null); }}
                                                className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                                            >
                                                {t('viewEditButton')}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : ( 
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="text-gray-500">
                                            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg font-medium">{t('noRequestsFound')}</p>
                                            <p className="text-sm mt-2">Try adjusting your search or filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {renderPagination()}
            </Card>

            {/* Edit Modal */}
            <AnimatePresence>
            {selectedRequest && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedRequest(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="w-full max-w-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <Card className="bg-white shadow-2xl rounded-lg overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl">{t('requestDetailsTitle', {requestId: selectedRequest.requestId})}</CardTitle>
                                        <p className="text-blue-100 mt-1">{t('customerLabel')} {selectedRequest.customerName}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedRequest(null)} className="text-white hover:bg-white/20">
                                        <X className="h-5 w-5"/>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">{t('emailLabelModal')}</p>
                                            <p className="mt-1 text-sm text-gray-900">{selectedRequest.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">{t('phoneModelLabelModal')}</p>
                                            <p className="mt-1 text-sm text-gray-900">{selectedRequest.phoneInfo}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">{t('paymentInfoLabelModal')}</p>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {selectedRequest.paymentInfo} 
                                                {selectedRequest.transactionId && selectedRequest.transactionId !== 'N/A' && (
                                                    <span className="text-gray-500"> (ID: {selectedRequest.transactionId})</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">{t('issueLabelModal')}</p>
                                            <p className="mt-1 text-sm text-gray-900">{selectedRequest.issue}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">{t('currentStatusLabelModal')}</p>
                                            <span className={cn(
                                                "mt-1 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border",
                                                getStatusColor(selectedRequest.status)
                                            )}>
                                                {t(formatStatusKey(selectedRequest.status)) || selectedRequest.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pt-6 border-t">
                                    <Label htmlFor="newStatus" className="text-sm font-medium text-gray-700">{t('updateStatusLabelModal')}</Label>
                                    <Select onValueChange={setNewStatus} value={newStatus}>
                                        <SelectTrigger className="mt-2 w-full">
                                            <SelectValue placeholder={t('selectNewStatusPlaceholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{t(opt.labelKey)}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {updateMessage && (
                                        <div className="mt-4">
                                            <Message type={updateMessage.type} message={updateMessage.text} />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50 px-6 py-4">
                                <div className="flex justify-end space-x-3 w-full">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setSelectedRequest(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={() => handleUpdateRequestStatus(selectedRequest.requestId)} 
                                        disabled={updatingStatus || newStatus === selectedRequest.status}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {updatingStatus ? (
                                            <><Loader2 className={cn("h-4 w-4 animate-spin", language === 'ar' ? 'ml-2' : 'mr-2')} />{t('updatingButtonModal')}</>
                                        ) : (
                                            t('saveStatusChangeButton')
                                        )}
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>
        </motion.div>
    );
};

const StatusCheckPage = ({ navigateTo }) => {
    const { t, language } = useLanguage();
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    
    const [statusData, setStatusData] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 

    const handleCheckStatus = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setStatusData(null);

        if (!fullName.trim() || !phoneNumber.trim() || !email.trim()) {
            setError({ title: t('errorMissingInfoTitle'), text: t('errorMissingInfoText') });
            setLoading(false);
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError({ title: t('errorInvalidEmailTitle'), text: t('errorInvalidEmailText') });
            setLoading(false);
            return;
        }
         if (!/^\+\d{10,}$/.test(phoneNumber.trim())) {
            setError({ title: t('errorInvalidPhoneTitle'), text: t('errorInvalidPhoneText') });
            setLoading(false);
            return;
        }

        try {
            const rawData = await api.checkStatusByNamePhoneEmail(fullName.trim(), phoneNumber.trim(), email.trim());

            if (rawData && rawData.length > 0) {
                setStatusData(rawData); 
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
        <motion.div
            initial={{ opacity: 0, x: language === 'ar' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 max-w-lg mx-auto"
        >
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">{t('checkRequestStatusTitle')}</h2>
                <p className="text-gray-600 mt-2">{t('checkRequestStatusSubtitle')}</p>
            </div>

            <Card className="shadow-xl">
                <CardContent className="p-6">
                    <form onSubmit={handleCheckStatus} className="space-y-6">
                        <div>
                            <Label htmlFor="statusFullName">{t('fullNameLabel')}</Label>
                            <div className="relative mt-1">
                                <User className={cn("absolute h-5 w-5 text-gray-400 top-1/2 -translate-y-1/2", language === 'ar' ? "right-3" : "left-3")} />
                                <Input id="statusFullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t('fullNamePlaceholder')} className={cn(language === 'ar' ? "pr-10" : "pl-10")} required />
                            </div>
                        </div>
                         <div>
                            <Label htmlFor="statusPhoneNumber">{t('phoneNumberInputLabel')}</Label>
                             <div className="relative mt-1">
                                <Phone className={cn("absolute h-5 w-5 text-gray-400 top-1/2 -translate-y-1/2", language === 'ar' ? "right-3" : "left-3")} />
                                <Input id="statusPhoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={t('phoneNumberInputPlaceholder')} className={cn(language === 'ar' ? "pr-10" : "pl-10")} required />
                            </div>
                        </div>
                         <div>
                            <Label htmlFor="statusEmail">{t('emailLabel')}</Label>
                             <div className="relative mt-1">
                                <AtSign className={cn("absolute h-5 w-5 text-gray-400 top-1/2 -translate-y-1/2", language === 'ar' ? "right-3" : "left-3")} />
                                <Input id="statusEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('emailPlaceholder')} className={cn(language === 'ar' ? "pr-10" : "pl-10")} required />
                            </div>
                        </div>
                        
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <><Loader2 className={cn("h-4 w-4 animate-spin", language === 'ar' ? 'ml-2' : 'mr-2')} /> {t('checkingStatusButton')}</> : t('checkStatusButton')}
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
                        <CardTitle>
                          {t('multipleRequestsStatusTitle')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {statusData.map((item, index) => (
                            <div key={item.requestId || index} className={cn("py-3", index > 0 ? "mt-3 border-t border-gray-200" : "")}>
                                <h3 className="text-md font-semibold mb-2 text-blue-700">{t('statusForRequestId', {requestId: item.requestId})}</h3>
                                <div className={`flex items-center text-lg font-semibold p-3 rounded-md ${getStatusDisplay(item.status).color} bg-opacity-10 bg-${getStatusDisplay(item.status).color.split('-')[1]}-100`}>
                                    {getStatusDisplay(item.status).icon}
                                    {getStatusDisplay(item.status).text}
                                </div>
                                <p className="text-sm text-gray-600 mt-2"><strong>{t('phoneModelLabel')}:</strong> {item.phoneInfo}</p>
                                <p className="text-sm text-gray-600 mt-1"><strong>{t('issueLabelModal')}:</strong> {item.issue}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </motion.div>
    );
};

export const useLanguage = () => useContext(LanguageContext);

// --- UI Components ---
const Button = React.forwardRef(({ children, variant = 'default', size = 'default', className, onClick, disabled, asChild = false, type = "button", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const variantStyles = {
        default: "bg-blue-600 text-white hover:bg-blue-700/90",
        destructive: "bg-red-500 text-destructive-foreground hover:bg-red-600/90",
        outline: "border border-gray-300 bg-white hover:bg-gray-100 hover:text-accent-foreground",
        secondary: "bg-gray-200 text-secondary-foreground hover:bg-gray-300/80",
        ghost: "hover:bg-gray-100 hover:text-accent-foreground",
        link: "text-blue-600 underline-offset-4 hover:underline",
    };
    const sizeStyles = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    };
    
    const Elem = asChild && React.isValidElement(children) ? children : <button type={type} ref={ref} className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} onClick={onClick} disabled={disabled} {...props}>{children}</button>;
    
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(Elem, {
            className: cn(baseStyles, variantStyles[variant], sizeStyles[size], className, children.props.className),
            onClick,
            disabled,
            ...props,
            ...children.props,
        });
    }
    return Elem;
});

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    const { language } = useLanguage();
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                language === 'ar' ? 'text-right' : 'text-left', 
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
    const { language } = useLanguage();
    return (
        <textarea
            className={cn(
                "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                language === 'ar' ? 'text-right' : 'text-left', 
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

const Label = React.forwardRef(({ className, children, ...props }, ref) => (
    <label
        ref={ref}
        className={cn("block text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
        {...props}
    >
        {children}
    </label>
));

const Card = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("rounded-lg border bg-white text-card-foreground shadow-sm", className)}
        {...props}
    />
));

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props}>
        {children}
    </h3>
));

const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-gray-500", className)} {...props}>
        {children}
    </p>
));

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));

const Alert = React.forwardRef(({ className, variant = 'default', children, ...props }, ref) => {
    const { language } = useLanguage();
    const variantStyles = {
        default: "bg-background text-foreground",
        destructive: "border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500",
        success: "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600",
    };
    return (
        <div
            ref={ref}
            role="alert"
            className={cn("relative w-full rounded-lg border p-4", 
                language === 'ar' ? "[&>svg~*]:pr-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:right-4 [&>svg]:top-4" 
                                  : "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
                variantStyles[variant], 
                className)}
            {...props}
        >
            {children}
        </div>
    );
});

const AlertDescription = React.forwardRef(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props}>
        {children}
    </div>
));

const AlertTitle = React.forwardRef(({ className, children, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props}>
        {children}
    </h5>
));

// --- Select Components ---
const Select = ({ children, onValueChange, value: controlledValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(controlledValue || '');
    const [displayValue, setDisplayValue] = useState('');
    const selectRef = useRef(null);
    const { language } = useLanguage();

    useEffect(() => {
        if (controlledValue !== undefined) {
            setSelectedValue(controlledValue);
        }
    }, [controlledValue]);
    
    useEffect(() => {
        let foundDisplay = '';
        React.Children.forEach(children, child => {
            if (child.type === SelectContent) {
                React.Children.forEach(child.props.children, item => {
                    if (item.type === SelectItem && item.props.value === selectedValue) {
                        foundDisplay = item.props.children;
                    }
                });
            }
        });
        if (foundDisplay) {
            setDisplayValue(foundDisplay);
        } else {
            React.Children.forEach(children, child => {
                if (child.type === SelectTrigger) {
                    React.Children.forEach(child.props.children, triggerChild => {
                        if (triggerChild.type === SelectValue) {
                            setDisplayValue(triggerChild.props.placeholder);
                        }
                    });
                }
            });
        }
    }, [selectedValue, children, language]);

    const handleSelect = (val, display) => {
        setSelectedValue(val);
        if (onValueChange) {
            onValueChange(val);
        }
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <SelectContext.Provider value={{ isOpen, setIsOpen, selectedValue, handleSelect, displayValue, language }}>
            <div className="relative" ref={selectRef}>{children}</div>
        </SelectContext.Provider>
    );
};

const SelectContent = ({ children, className }) => {
    const { isOpen } = useContext(SelectContext);
    if (!isOpen) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={cn("absolute z-50 min-w-[8rem] w-full overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md mt-1", className)}
        >
            {children}
        </motion.div>
    );
};

const MOCK_SERVICE_FEE = 2000;

const RequestFormPage = ({ navigateTo }) => {
    const { t, language } = useLanguage();
    const [formData, setFormData] = useState({
        fullName: '', 
        countryCode: '+966', 
        localPhoneNumber: '', 
        email: '', 
        city: '',
        region: '',
        phoneModel: '', 
        previouslyRepaired: '', 
        deviceCondition: '',
        issueDescription: '', 
        deviceImage: null, 
        paymentMethod: '',
    });
    const [isAgreementChecked, setIsAgreementChecked] = useState(false);
    const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
    const [formMessage, setFormMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    
    const countryCodes = [
        { value: '+966', label: '🇸🇦 +966 (KSA)' },
        { value: '+971', label: '🇦🇪 +971 (UAE)' },
        { value: '+974', label: '🇶🇦 +974 (Qatar)' },
        { value: '+973', label: '🇧🇭 +973 (Bahrain)' },
        { value: '+968', label: '🇴🇲 +968 (Oman)' },
        { value: '+965', label: '🇰🇼 +965 (Kuwait)' },
    ];

    const phoneModels = [
        { value: 'iPhone X', label: 'iPhone X / XR / XS' },
        { value: 'iPhone 11', label: 'iPhone 11 / Pro / Max' },
        { value: 'iPhone 12', label: 'iPhone 12 / Mini / Pro / Max' },
        { value: 'iPhone 13', label: 'iPhone 13 / Mini / Pro / Max' },
        { value: 'iPhone 14', label: 'iPhone 14 / Plus / Pro / Max' },
        { value: 'iPhone 15', label: 'iPhone 15 / Plus / Pro / Max' },
        { value: 'iPhone SE (2nd Gen)', label: 'iPhone SE (2nd Gen)' },
        { value: 'iPhone SE (3rd Gen)', label: 'iPhone SE (3rd Gen)' },
        { value: 'Other', label: 'Other iPhone Model' },
    ];

    const deviceConditions = [
        { value: 'fell_in_water', labelKey: 'conditionFellInWater' },
        { value: 'physical_damage', labelKey: 'conditionPhysicalDamage' },
        { value: 'no_power', labelKey: 'conditionNoPower' },
        { value: 'screen_issue', labelKey: 'conditionScreenIssue' },
        { value: 'battery_issue', labelKey: 'conditionBatteryIssue' },
        { value: 'software_issue', labelKey: 'conditionSoftwareIssue' },
        { value: 'other', labelKey: 'conditionOther' },
    ];

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

    const handleProceedToPayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormMessage(null);
        
        if (!isAgreementChecked) {
            setFormMessage({ type: 'error', title: t('errorAgreementRequiredTitle'), text: t('errorAgreementRequiredText') });
            setLoading(false);
            return;
        }

        const requiredFields = ['fullName', 'countryCode', 'localPhoneNumber', 'email', 'city', 'region', 'phoneModel', 'previouslyRepaired', 'deviceCondition', 'issueDescription', 'paymentMethod'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                setFormMessage({ type: 'error', title: t('errorMissingInfoTitle'), text: t('errorMissingInfoText') });
                setLoading(false);
                return;
            }
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setFormMessage({ type: 'error', title: t('errorInvalidEmailTitle'), text: t('errorInvalidEmailText') });
            setLoading(false);
            return;
        }
        if (!/^\d{7,15}$/.test(formData.localPhoneNumber)) { 
             setFormMessage({ type: 'error', title: t('errorInvalidPhoneTitle'), text: t('errorInvalidPhoneText') });
            setLoading(false);
            return;
        }

        try {
            // Store form data in localStorage before redirecting
            localStorage.setItem('pendingRequestData', JSON.stringify(formData));

            const paymentResponse = await api.initiatePayFortPayment({
                email: formData.email,
                amount: MOCK_SERVICE_FEE,
            });

            if (paymentResponse.redirect_url) {
                // Redirect user to the payment gateway
                window.location.href = paymentResponse.redirect_url;
            } else {
                throw new Error("Payment initiation response did not include a redirect URL.");
            }
        } catch(error) {
             setFormMessage({ type: 'error', title: t('submissionFailedTitle'), text: error.message || t('submissionFailedText') });
             localStorage.removeItem('pendingRequestData'); // Clean up on failure
        } finally {
            setLoading(false);
        }
    };
    
    const requiredStar = <span className="text-red-500">{t('requiredFieldIndicator')}</span>;

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
                        {/* Personal Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="fullName">{t('fullNameLabel')} {requiredStar}</Label>
                                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder={t('fullNamePlaceholder')} required className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="email">{t('emailLabel')} {requiredStar}</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder={t('emailPlaceholder')} required className="mt-1" />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="md:col-span-1">
                                <Label htmlFor="countryCode">{t('countryCodeLabel')} {requiredStar}</Label>
                                <Select onValueChange={(value) => handleSelectChange('countryCode', value)} value={formData.countryCode}>
                                    <SelectTrigger className="mt-1 w-full">
                                        <SelectValue placeholder={t('countryCodePlaceholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countryCodes.map(code => (
                                            <SelectItem key={code.value} value={code.value}>{code.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="localPhoneNumber">{t('localPhoneNumberLabel')} {requiredStar}</Label>
                                <Input id="localPhoneNumber" name="localPhoneNumber" value={formData.localPhoneNumber} onChange={handleChange} placeholder={t('localPhoneNumberPlaceholder')} required className="mt-1" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <Label htmlFor="city">{t('cityLabel')} {requiredStar}</Label>
                                <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder={t('cityPlaceholder')} required className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="region">{t('regionLabel')} {requiredStar}</Label>
                                <Input id="region" name="region" value={formData.region} onChange={handleChange} placeholder={t('regionPlaceholder')} required className="mt-1" />
                            </div>
                        </div>

                        {/* Device Info */}
                        <div className="pt-4 border-t mt-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">{t('phoneModelLabel')} & {t('deviceConditionLabel')}</h3>
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="phoneModel">{t('phoneModelLabel')} {requiredStar}</Label>
                                    <Select onValueChange={(value) => handleSelectChange('phoneModel', value)} value={formData.phoneModel}>
                                        <SelectTrigger className="mt-1 w-full">
                                            <SelectValue placeholder={t('phoneModelSelectPlaceholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {phoneModels.map(model => (
                                                <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="previouslyRepaired">{t('previouslyRepairedLabel')} {requiredStar}</Label>
                                    <Select onValueChange={(value) => handleSelectChange('previouslyRepaired', value)} value={formData.previouslyRepaired}>
                                        <SelectTrigger className="mt-1 w-full">
                                            <SelectValue placeholder={t('previouslyRepairedPlaceholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="no">{t('noOption')}</SelectItem>
                                            <SelectItem value="yes">{t('yesOption')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="deviceCondition">{t('deviceConditionLabel')} {requiredStar}</Label>
                                    <Select onValueChange={(value) => handleSelectChange('deviceCondition', value)} value={formData.deviceCondition}>
                                        <SelectTrigger className="mt-1 w-full">
                                            <SelectValue placeholder={t('deviceConditionPlaceholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {deviceConditions.map(condition => (
                                                <SelectItem key={condition.value} value={condition.value}>{t(condition.labelKey)}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <Label htmlFor="issueDescription">{t('issueDescriptionLabel')} {requiredStar}</Label>
                            <Textarea id="issueDescription" name="issueDescription" value={formData.issueDescription} onChange={handleChange} placeholder={t('issueDescriptionPlaceholder')} required className="mt-1" rows={4} />
                        </div>

                        <div>
                            <Label htmlFor="deviceImage" className="flex items-center gap-2">
                                <UploadCloud className="w-5 h-5 text-gray-500" />
                                {t('deviceImageLabel')} {requiredStar}
                            </Label>
                            <Input 
                                id="deviceImage" 
                                name="deviceImage" 
                                type="file" 
                                accept="image/*" 
                                onChange={handleChange} 
                                required
                                className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {fileName && <p className="text-xs text-gray-500 mt-1">{t('fileNameLabel')} {fileName}</p>}
                        </div>

                        {/* Payment Method */}
                        <div className="pt-4 border-t mt-6">
                             <Label htmlFor="paymentMethod">{t('paymentMethodLabel')} {requiredStar}</Label>
                            <Select onValueChange={(value) => handleSelectChange('paymentMethod', value)} value={formData.paymentMethod}>
                                <SelectTrigger className="mt-1 w-full">
                                    <SelectValue placeholder={t('paymentMethodPlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="VISA_MASTER">{t('paymentCreditCard')}</SelectItem>
                                    <SelectItem value="MADA">{t('paymentMada')}</SelectItem>
                                    <SelectItem value="STC_PAY">{t('paymentSTCPay')}</SelectItem>
                                    <SelectItem value="APPLEPAY">{t('paymentApplePay')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Agreement Section */}
                        <div className={cn("flex items-start mt-6 pt-6 border-t", language === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2')}>
                            <input
                                type="checkbox"
                                id="agreement"
                                checked={isAgreementChecked}
                                onChange={(e) => setIsAgreementChecked(e.target.checked)}
                                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0" 
                            />
                            <Label htmlFor="agreement" className="text-sm text-gray-700">
                                {t('agreementCheckboxLabel')}{' '}
                                <button
                                    type="button"
                                    onClick={() => setIsAgreementModalOpen(true)}
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    {t('viewAgreementLink')}
                                </button>
                            </Label>
                        </div>
                        
                        <AnimatePresence>
                            {formMessage && <Message type={formMessage.type} title={formMessage.title} message={formMessage.text} />}
                        </AnimatePresence>

                        <Button type="submit" className="w-full text-lg py-3" disabled={loading || !isAgreementChecked} size="lg">
                            {loading ? (
                                <><Loader2 className={cn("h-5 w-5 animate-spin", language === 'ar' ? 'ml-2' : 'mr-2')} /> {t('submittingButton')}</>
                            ) : (
                                <><CreditCard className={cn("h-5 w-5", language === 'ar' ? 'ml-2' : 'mr-2')} /> {t('proceedToPaymentButton')}</>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            
            <AnimatePresence>
                {isAgreementModalOpen && (
                    <AgreementModal
                        isOpen={isAgreementModalOpen}
                        onClose={() => setIsAgreementModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- New Payment Confirmation Page ---
const PaymentConfirmationPage = ({ navigateTo }) => {
    const { t, language } = useLanguage();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [finalSubmissionInfo, setFinalSubmissionInfo] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const processPaymentReturn = async () => {
            const params = new URLSearchParams(window.location.search);
            const paymentStatus = params.get('status');
            const responseMessage = params.get('response_message');
            const transactionId = params.get('fort_id'); // Example param, might differ

            if (paymentStatus === 'success') { // Replace with actual success status from PayFort
                const savedDataString = localStorage.getItem('pendingRequestData');
                if (savedDataString) {
                    try {
                        const savedData = JSON.parse(savedDataString);
                        const fullPhoneNumber = savedData.countryCode + savedData.localPhoneNumber;
                        
                        const serviceRequestData = {
                            ...savedData,
                            fullPhoneNumber,
                            transactionId: transactionId || `TXN-AMZ-${Date.now()}`,
                            deviceImageName: savedData.deviceImage ? savedData.deviceImage.name : null,
                        };
                        
                        // Clean up sensitive data before submitting
                        delete serviceRequestData.countryCode;
                        delete serviceRequestData.localPhoneNumber;
                        delete serviceRequestData.deviceImage;

                        const requestResponse = await api.submitRequest(serviceRequestData);
                        setFinalSubmissionInfo({ ...requestResponse, phoneNumber: fullPhoneNumber });
                        setStatus('success');
                    } catch (err) {
                        setStatus('error');
                        setErrorMessage(t('submissionFailedText'));
                    } finally {
                        localStorage.removeItem('pendingRequestData');
                    }
                } else {
                    setStatus('error');
                    setErrorMessage(t('submissionFailedText') + " (Missing request data)");
                }
            } else {
                setStatus('error');
                setErrorMessage(t('paymentFailedWithReason', { reason: responseMessage || 'Unknown reason' }));
                localStorage.removeItem('pendingRequestData');
            }
        };

        processPaymentReturn();
    }, [t]);

    if (status === 'loading') {
        return (
            <div className="text-center max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('paymentConfirmationTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LoadingIndicator message={t('paymentConfirmationText')} />
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (status === 'error') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto text-center">
                <Message type="error" title={t('paymentFailedTitle')} message={errorMessage} />
                <Button variant="outline" size="sm" className="mt-4" onClick={() => navigateTo('request')}>
                    {t('proceedToPaymentButton')}
                </Button>
            </motion.div>
        );
    }

    if (status === 'success' && finalSubmissionInfo) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto text-center">
                 <Message type="success" title={t('requestSubmittedTitle')} message={t('requestSubmittedText')} />
                 <Alert variant="success" className="mt-6 text-left">
                    <CheckCircle className="h-5 w-5" />
                    <AlertTitle>{t('importantSaveInfoTitle')}</AlertTitle>
                    <AlertDescription>
                        <p className="mb-2">{t('importantSaveInfoText')}</p>
                        <ul className={cn("list-inside space-y-1 bg-green-100 p-3 rounded-md", language === 'ar' ? 'list-disc text-right' : 'list-disc text-left')}>
                            <li><strong>{t('requestIdLabel')}</strong> <span className="font-mono text-green-700">{finalSubmissionInfo.requestId}</span></li>
                            <li><strong>{t('verificationCodeLabel')}</strong> <span className="font-mono text-green-700">{finalSubmissionInfo.verificationCode}</span></li>
                            <li><strong>{t('transactionIdLabel')}</strong> <span className="font-mono text-green-700">{finalSubmissionInfo.transactionId}</span></li>
                        </ul>
                        <p className="mt-3">{t('contactWhatsAppText', {phoneNumber: finalSubmissionInfo.phoneNumber})}</p>
                         <Button variant="outline" size="sm" className="mt-4" onClick={() => navigateTo('status')}>{t('checkStatusNowButton')}</Button>
                    </AlertDescription>
                </Alert>
            </motion.div>
        );
    }

    return null; // Should not be reached
};

const SelectItem = ({ children, value, className }) => {
    const { handleSelect, selectedValue, language } = useContext(SelectContext);
    const isSelected = selectedValue === value;
    return (
        <div
            onClick={() => handleSelect(value, children)}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-100",
                language === 'ar' ? "pr-8 pl-2 text-right" : "pl-8 pr-2 text-left",
                isSelected && "font-semibold bg-gray-100",
                className
            )}
        >
            {children}
            {isSelected && <Check className={cn("absolute h-4 w-4", language === 'ar' ? "right-2" : "left-2")} />}
        </div>
    );
};

const SelectTrigger = ({ children, className }) => {
    const { setIsOpen, isOpen, language } = useContext(SelectContext);
    return (
        <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn("flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
        >
            {language === 'ar' && (isOpen ? <ChevronUp className="h-4 w-4 opacity-50 me-auto" /> : <ChevronDown className="h-4 w-4 opacity-50 me-auto" />)}
            {children}
            {language === 'en' && (isOpen ? <ChevronUp className="h-4 w-4 opacity-50 ms-auto" /> : <ChevronDown className="h-4 w-4 opacity-50 ms-auto" />)}
        </button>
    );
};

const SelectValue = ({ placeholder }) => {
    const { displayValue, selectedValue } = useContext(SelectContext);
    return <span className={cn(!selectedValue && placeholder ? "text-gray-500" : "", "truncate")}>{displayValue || placeholder}</span>;
};

// --- Helper Components ---
const LoadingIndicator = ({ message }) => {
    const { t, language } = useLanguage();
    return (
        <div className="flex items-center justify-center p-4 my-4">
            <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
            <span className={cn("text-gray-600 text-lg", language === 'ar' ? 'mr-3' : 'ms-3')}>{message || t('loadingMessage')}</span>
        </div>
    );
};

const Message = ({ type, title, message, children }) => {
    const { language } = useLanguage();
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={cn(
                'p-4 rounded-md my-4 border',
                type === 'success' ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'
            )}
        >
            <div className="flex">
                <div className="flex-shrink-0">
                    {type === 'success' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
                </div>
                <div className={language === 'ar' ? "mr-3" : "ml-3"}>
                    {title && <h3 className="text-sm font-medium">{title}</h3>}
                    <div className={cn("text-sm", title && "mt-2")}>
                        {message}
                        {children}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Agreement Modal ---
const AgreementModal = ({ isOpen, onClose }) => {
    const { t, language } = useLanguage();
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[60]"
            onClick={onClose}
        >
            <Card className="w-full max-w-2xl bg-white shadow-2xl rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                <CardHeader className="bg-gray-100 border-b">
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center text-xl md:text-2xl">
                            <FileCheck2 className={cn("h-6 w-6 text-blue-600", language === 'ar' ? 'ml-2' : 'mr-2')} />
                            {t('agreementModalTitle')}
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5"/></Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6 max-h-[70vh] overflow-y-auto prose prose-sm max-w-none">
                    <p className="text-base">{t('agreementTextLine1')}</p>
                    <p>{t('agreementTextLine2')}</p>
                    
                    <h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementServiceTitle')}</h3>
                    <p>{t('agreementServiceText1')}</p>
                    <p>{t('agreementServiceText2')}</p>

                    <h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementPaymentTitle')}</h3>
                    <p>{t('agreementPaymentText1')}</p>

                    <h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementUserResponsibilityTitle')}</h3>
                    <p>{t('agreementUserResponsibilityText1')}</p>
                    <p>{t('agreementUserResponsibilityText2')}</p>
                    
                    <h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementLimitationTitle')}</h3>
                    <p>{t('agreementLimitationText1')}</p>

                    <h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementConfidentialityTitle')}</h3>
                    <p>{t('agreementConfidentialityText1')}</p>

                    <h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementShippingTitle')}</h3>
                    <p>{t('agreementShippingText1')}</p>

                    <h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementChangesTitle')}</h3>
                    <p>{t('agreementChangesText1')}</p>

                    <h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementContactTitle')}</h3>
                    <p>{t('agreementContactText1')}</p>
                </CardContent>
                <CardFooter className="bg-gray-100 border-t">
                    <Button onClick={onClose} className="w-full" size="lg">
                        <CheckCircle className={cn("h-5 w-5", language === 'ar' ? 'ml-2' : 'mr-2')} />
                        {t('iAgreeButton')}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

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
            className="space-y-8 sm:space-y-12"
        >
            {/* Hero Section */}
            <section className="text-center space-y-4 sm:space-y-6 py-8 sm:py-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl shadow-2xl px-4 sm:px-6">
                <motion.h1 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold"
                >
                    {t('welcomeTitle').split(' ')[0]} <span className="text-blue-300">{t('welcomeTitle').split(' ')[1]}</span>
                </motion.h1>
                <motion.p 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
                    className="text-lg sm:text-xl md:text-2xl text-blue-100"
                >
                    {t('welcomeSubtitle')}
                </motion.p>
                <motion.p 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
                    className="text-sm sm:text-base md:text-lg text-blue-200 max-w-2xl mx-auto px-2"
                >
                    {t('welcomeDescription')}
                </motion.p>
                <motion.p 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 120 }}
                    className="text-sm sm:text-base md:text-lg text-blue-100 font-semibold"
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
                        className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg shadow-lg transform hover:scale-105 transition-transform duration-150 rounded-md"
                    >
                        {t('getQuoteButton')}
                    </Button>
                </motion.div>
                <div className="flex items-center justify-center gap-2 pt-4 sm:pt-6">
                    <Store className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
                    <a 
                        href="https://www.google.com/maps/search/?api=1&query=Saihat,Saudi+Arabia" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base text-blue-200 font-semibold hover:text-white hover:underline"
                    >
                        {t('ourLocation')}
                    </a>
                </div>
            </section>

            {/* Pricing Offer Section */}
            <section className="py-8 sm:py-12 px-2 sm:px-4">
                <Card className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-4 sm:p-6 md:p-8 text-center border-2 border-blue-500">
                    <CardHeader className="pb-4 sm:pb-6">
                        <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 flex flex-col sm:flex-row items-center justify-center gap-2">
                            <Tag className="w-6 h-6 sm:w-8 sm:h-8" />
                            <span>{t('pricingOfferTitle')}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-800 font-semibold mb-2 sm:mb-3">{t('pricingOfferText')}</p>
                        <p className="text-gray-600 text-xs sm:text-sm px-2">{t('pricingOfferDetails')}</p>
                    </CardContent>
                </Card>
            </section>

            {/* Our Process Section */}
            <section className="py-8 sm:py-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12 flex flex-col sm:flex-row items-center justify-center gap-2 px-4">
                    <ListFilter className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    <span>{t('ourProcessTitle')}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 md:px-8">
                    {[
                        { icon: <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mb-3 sm:mb-4"/>, titleKey: "processStep1Title", descKey: "processStep1Desc" },
                        { icon: <Truck className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mb-3 sm:mb-4"/>, titleKey: "processStep2Title", descKey: "processStep2Desc" },
                        { icon: <Wrench className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mb-3 sm:mb-4"/>, titleKey: "processStep3Title", descKey: "processStep3Desc" },
                        { icon: <Send className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mb-3 sm:mb-4"/>, titleKey: "processStep4Title", descKey: "processStep4Desc" }
                    ].map((step, index) => (
                        <motion.div
                            key={step.titleKey}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center flex flex-col items-center"
                        >
                            {step.icon}
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{t(step.titleKey)}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{t(step.descKey)}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Our Expertise Section */}
            <section className="py-8 sm:py-12 px-4 sm:px-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-10 flex flex-col sm:flex-row items-center justify-center gap-2">
                    <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    <span>{t('ourExpertiseTitle')}</span>
                </h2>
                <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-xl overflow-hidden">
                    <img 
                        src="https://placehold.co/1200x600/3B82F6/FFFFFF?text=Expert+Technician+Analyzing+Device&font=lato" 
                        alt={t('expertAtWorkAlt')} 
                        className="w-full h-auto object-cover rounded-lg shadow-md"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x600/CCCCCC/FFFFFF?text=Image+Not+Available'; }}
                    />
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-8 sm:py-12 bg-gray-50 rounded-xl shadow-lg">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12 flex flex-col sm:flex-row items-center justify-center gap-2 px-4">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    <span>{t('testimonialsTitle')}</span>
                </h2>
                {loadingTestimonials ? (
                    <LoadingIndicator message={t('loadingTestimonials')} />
                ) : (
                    <div className="flex overflow-x-auto space-x-4 pb-4 sm:pb-6 px-4 md:px-8 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100">
                        {testimonials.map((testimonial, index) => (
                            <motion.div 
                                key={testimonial.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-white p-4 sm:p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col flex-shrink-0 w-72 sm:w-80 md:w-96"
                            >
                                <div className="flex items-center mb-3 sm:mb-4">
                                    <img src={testimonial.avatar} alt={t(testimonial.nameKey)} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-500" />
                                    <div className={cn("flex-1", language === 'ar' ? 'mr-3 sm:mr-4' : 'ml-3 sm:ml-4')}>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{t(testimonial.nameKey)}</h3>
                                        <p className="text-xs sm:text-sm text-blue-600">{t(testimonial.deviceKey)}</p>
                                    </div>
                                </div>
                                <MessageSquare className={cn("w-6 h-6 sm:w-8 sm:h-8 text-blue-200 mb-2", language === 'ar' ? 'self-end' : 'self-start')} />
                                <p className="text-gray-600 italic flex-grow text-xs sm:text-sm leading-relaxed">"{t(testimonial.quoteKey)}"</p>
                                <div className="mt-3 sm:mt-4 flex">
                                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Before & After Section */}
            <section className="py-8 sm:py-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12 flex flex-col sm:flex-row items-center justify-center gap-2 px-4">
                    <SmartphoneNfc className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    <span>{t('beforeAfterTitle')}</span>
                </h2>
                {loadingBeforeAfter ? (
                    <LoadingIndicator message={t('loadingBeforeAfter')} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 px-4 md:px-8">
                        {beforeAfterCases.map((bAc, index) => (
                            <motion.div 
                                key={bAc.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="bg-white rounded-xl shadow-xl overflow-hidden"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2">
                                    <div className="p-4 sm:p-6">
                                        <h3 className="text-lg sm:text-xl font-semibold text-red-600 mb-2 sm:mb-3 flex items-center">
                                            <X className={cn("w-5 h-5 sm:w-6 sm:h-6", language === 'ar' ? 'ml-2' : 'mr-2')} />
                                            {t(bAc.beforeTitleKey)}
                                        </h3>
                                        <img 
                                            src={bAc.beforeImage}
                                            alt={t(bAc.beforeImageAltKey)} 
                                            className="w-full h-40 sm:h-48 object-contain rounded-md mb-2 sm:mb-3 bg-gray-100 p-2"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/CCCCCC/FFFFFF?text=Image+Error'; }}
                                        />
                                        <p className="text-gray-600 text-xs sm:text-sm">{t(bAc.beforeDescriptionKey)}</p>
                                    </div>
                                    <div className="p-4 sm:p-6 bg-green-50">
                                        <h3 className="text-lg sm:text-xl font-semibold text-green-600 mb-2 sm:mb-3 flex items-center">
                                            <CheckCircle className={cn("w-5 h-5 sm:w-6 sm:h-6", language === 'ar' ? 'ml-2' : 'mr-2')} />
                                            {t(bAc.afterTitleKey)}
                                        </h3>
                                        <img 
                                            src={bAc.afterImage} 
                                            alt={t(bAc.afterImageAltKey)} 
                                            className="w-full h-40 sm:h-48 object-contain rounded-md mb-2 sm:mb-3 bg-gray-100 p-2"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/CCCCCC/FFFFFF?text=Image+Error'; }}
                                        />
                                        <p className="text-gray-600 text-xs sm:text-sm">{t(bAc.afterDescriptionKey)}</p>
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
