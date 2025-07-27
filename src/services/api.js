const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// --- API Service ---
const MOCK_TESTIMONIALS = [
    { id: 1, nameKey: 'Ali Al-Mahmoud', deviceKey: 'iphone 14 pro', quoteKey: 'أسبوعين احاول أسبوعين احاول افك جوالي ايفون ١٤ برو وكلمت آبل وعطيتهم الفاتورة وافقوا على تصليح الجهاز ولا تغير شئ و حاولت افرمته بس كل يحصل خطا في عملية الفرمته وتتوقف عملية الفرمته و رحت إلى الشاب الطيب حسين وبفضل الله وبفضل خبرته صلح ليي الجهاز في خلال اقل ٤٥ دقيقة ، الله يجزاه خير ويكثر من امثاله', avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=U1', rating: 5 },
    { id: 2, nameKey: 'Fatima Sharroufna', deviceKey: 'iphone 14 pro max', quoteKey: 'اول مره اتعامل مع المحل واتوقع مابتكون اخر مره. جوالي كان ١٤ برو ماكس وطاح في الماي واختربت الشاشة والكاميرا ومدخل الشاحن واشياء ثانية. حرفيا جبته واستلمته كأن جوال جديد. الشغل مضبوط ولا غلطة ومن جد بروفيشنال وغير هذا تعاملهم مع الزبون رائع واهم شي تطلع راضي عن الخدمة. الله يوفقكم ويعطيكم العافية.', avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=U2', rating: 5 },
    { id: 3, nameKey: 'Ali AlKhalaf', deviceKey: '', quoteKey: 'ماشاء الله، لأول مرة أتعامل مع هذا المحل وبكل أمانة أيديهم تلف بالحرير… شغل إحترافي بكل ماتحمل الكلمة من معنى.. تعاملت مع عدة أماكن لصيانة الأجهزة الذكية منها مكتبة جرير وغيرها،، من الآخر أفضلها وأدقها لغاية الآن بصيانة أجهزة Apple.. كل التوفيق للقائمين.', avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=U3', rating: 5 },
    { id: 4, nameKey: 'Anurag Mishra', deviceKey: '', quoteKey: 'Excellent person, honest pricing, got data backed up from totally broken iphone. best place to get your iphone repaired.', avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=U1', rating: 5 },
    { id: 5, nameKey: 'Mohammed Alsaeed', deviceKey: '', quoteKey: 'اعتقد اي واحد منا لما ياخذ اي جهاز لاي مكان للصيانة بيحب يعرف العطل بالشكل الصحيح و بمصداقية.اقصد لما يكون العطل مثلا في احد الموصلات انها فقط في غير مكانها ما توصل لك انه يحتاج الى قطع غيار مختلفة و المشكلة بس تركيب صحيح للموصلالنهاية اذا تبي مكان ثقة لاصلاح اجهزة ابل و بكل مصداقية هنا راح تلقاها و باحتراف', avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=U2', rating: 5 },
    { id: 6, nameKey: 'Ali AlKhalaf', deviceKey: ' ', 
        quoteKey: 'افضل محل لصيانة الايفون خدمة ممتازة مصداقية عاليةالمحل الوحيد اللي يوفر قطع غيار اصلية انصح فيه 👍🏻 Best shop for iPhone maintenance Excellent service The only shop that provides original spare parts 👍🏻', 
        avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=U3', rating: 5 }
];

const MOCK_BEFORE_AFTER_CASES = [
    { id: 'ba1', beforeTitleKey: 'beforeTitle', beforeDescriptionKey: 'beforeDescription1', beforeImageAltKey: 'beforeImageAlt1', beforeImage: 'https://placehold.co/600x400/FF7272/FFFFFF?text=Damaged+Screen', afterTitleKey: 'afterTitle', afterDescriptionKey: 'afterDescription1', afterImageAltKey: 'afterImageAlt1', afterImage: 'https://placehold.co/600x400/72FFB3/FFFFFF?text=Recovered!' },
    { id: 'ba2', beforeTitleKey: 'beforeTitle', beforeDescriptionKey: 'beforeDescription2', beforeImageAltKey: 'beforeImageAlt2', beforeImage: 'https://placehold.co/600x400/A0AEC0/FFFFFF?text=Water+Damage', afterTitleKey: 'afterTitle', afterDescriptionKey: 'afterDescription2', afterImageAltKey: 'afterImageAlt2', afterImage: 'https://placehold.co/600x400/A0E8FF/FFFFFF?text=Restored!' },
];

const api = {
    // Updated function to initiate payment and receive HTML for the popup
    initiatePayFortPayment: async ({ email, amount }) => {
        // The callback URL for the popup to redirect to after payment
        const returnUrl = `${window.location.origin}/payment-callback`;

        const response = await fetch(`${baseUrl}/api/payment/initiate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // The backend needs to handle 'return_url' to configure PayFort correctly
            body: JSON.stringify({ email, amount, return_url: returnUrl }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to initiate payment' }));
            throw new Error(errorData.message || 'Payment initiation failed');
        }
        
        // Expecting the raw HTML for the payment form
        return response.text(); 
    },
    
    submitRequest: async (requestData) => {
        try {
            const response = await fetch(`${baseUrl}/api/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerName: requestData.fullName,
                    phoneNumber: requestData.fullPhoneNumber,
                    email: requestData.email,
                    city: requestData.city,
                    region: requestData.region,
                    phoneModel: requestData.phoneModel,
                    previouslyRepaired: requestData.previouslyRepaired,
                    deviceCondition: requestData.deviceCondition,
                    issueDescription: requestData.issueDescription,
                    deviceImageName: requestData.deviceImageName,
                    transactionId: requestData.transactionId,
                    fortId: requestData.fortId
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to submit request' }));
                throw new Error(errorData.message || 'Request submission failed');
            }

            const result = await response.json();
            console.log("Service request submitted successfully:", result);
            return result;
        } catch (error) {
            console.error('Request submission error:', error);
            throw new Error(error.message || 'Failed to submit request');
        }
    },
    checkStatus: async (orderId) => {
    try {
        const response = await fetch(`${baseUrl}/api/requests/check-status?orderId=${encodeURIComponent(orderId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to check status' }));
            throw new Error(errorData.message || 'Failed to check status');
        }

        const result = await response.json();
        console.log("Status checked successfully:", result);
        return result;
    } catch (error) {
        console.error('Check status error:', error);
        throw new Error(error.message || 'Failed to check status');
    }
},
    
    checkStatusByNamePhoneEmail: async (fullName, phoneNumber, email) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockRequests = [
            { requestId: 'REQ-ABC123', customerName: 'Ahmed Al-Mansoori', phoneNumber: '+966501234567', email: 'ahmed@example.com', phoneInfo: 'iPhone 13 Pro', status: 'evaluating_device', issue: 'Water damage', paymentInfo: 'PayFort', transactionId: 'TXN-AMZ-123' },
            { requestId: 'REQ-DEF456', customerName: 'Fatima Al-Zahrani', phoneNumber: '+966507654321', email: 'fatima@example.com', phoneInfo: 'iPhone 12', status: 'data_recovered', issue: 'Screen broken', paymentInfo: 'PayFort', transactionId: 'TXN-AMZ-456' },
        ];
        const foundRequests = mockRequests.filter(req => 
            req.customerName.toLowerCase() === fullName.toLowerCase() &&
            req.phoneNumber === phoneNumber &&
            req.email.toLowerCase() === email.toLowerCase()
        );
        return foundRequests.length > 0 ? foundRequests : [];
    },

    getRequests: async (page = 0, size = 10, searchTerm = '', statusFilter = 'all') => {
    try {
        // Build query parameters
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            statusFilter: statusFilter
        });

        // Only add searchTerm if it's not empty
        if (searchTerm && searchTerm.trim()) {
            params.append('searchTerm', searchTerm.trim());
        }

        const response = await fetch(`${baseUrl}/api/requests?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to fetch requests' }));
            throw new Error(errorData.message || 'Failed to fetch requests');
        }

        const result = await response.json();
        console.log("Requests fetched successfully:", result);
        return result;
    } catch (error) {
        console.error('Get requests error:', error);
        throw new Error(error.message || 'Failed to fetch requests');
    }
},

    updateStatus: async (requestId, newStatus) => {
        try {
            const response = await fetch(`${baseUrl}/api/requests/${requestId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: newStatus
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to update status' }));
                throw new Error(errorData.message || 'Status update failed');
            }

            const result = await response.json();
            console.log("Status updated successfully:", result);
            return result;
        } catch (error) {
            console.error('Status update error:', error);
            return { 
                success: false, 
                message: error.message || 'Failed to update status' 
            };
        }
    },

    loginAdmin: async (username, password) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return username === 'admin' && password === 'admin123'
            ? { success: true, token: 'mock-admin-token' }
            : { success: false, message: 'Invalid credentials' };
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

export default api;