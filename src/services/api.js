const API_BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8080/api';

// Mock data for development
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
    processPayment: async ({ amount, paymentMethodType, paymentDetails }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/payments/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, paymentMethodType, paymentDetails }),
            });
            return await response.json();
        } catch (error) {
            console.error('Payment processing error:', error);
            return { success: false, messageKey: 'paymentFailedText' };
        }
    },

    submitRequest: async (requestData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerName: requestData.fullName,
                    phoneNumber: requestData.fullPhoneNumber,
                    email: requestData.email,
                    phoneModel: requestData.phoneModel,
                    issueDescription: requestData.issueDescription,
                    paymentMethod: requestData.paymentMethod,
                    transactionId: requestData.transactionId,
                    city: requestData.city,
                    region: requestData.region,
                    previouslyRepaired: requestData.previouslyRepaired,
                    deviceCondition: requestData.deviceCondition,
                    deviceImageName: requestData.deviceImageName
                }),
            });
            return await response.json();
        } catch (error) {
            console.error('Request submission error:', error);
            throw new Error("Failed to submit request.");
        }
    },

    checkStatus: async (requestId, verificationCode) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/requests/check-status?requestId=${requestId}&verificationCode=${verificationCode}`
            );
            return await response.json();
        } catch (error) {
            console.error('Status check error:', error);
            return { status: 'error', message: 'Failed to check status.' };
        }
    },

    checkStatusByPhone: async (phoneNumber, verificationCode) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/requests/check-status-by-phone?phoneNumber=${phoneNumber}&verificationCode=${verificationCode}`
            );
            return await response.json();
        } catch (error) {
            console.error('Status check by phone error:', error);
            return { status: 'error', message: 'Failed to check status.' };
        }
    },

    sendVerificationCode: async (phoneNumber) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/requests/send-verification-code?phoneNumber=${encodeURIComponent(phoneNumber)}`,
                {
                    method: 'POST',
                }
            );
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to send verification code');
            }
            return data.verificationCode;
        } catch (error) {
            console.error('Verification code sending error:', error);
            throw new Error('Failed to send verification code');
        }
    },

    sendRequestIdVerificationCode: async (requestId) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/requests/send-request-verification-code?requestId=${encodeURIComponent(requestId)}`,
                {
                    method: 'POST',
                }
            );
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to send verification code');
            }
            return data.verificationCode;
        } catch (error) {
            console.error('Verification code sending error:', error);
            throw new Error('Failed to send verification code');
        }
    },

    getRequests: async (page = 0, size = 10, searchTerm = '', statusFilter = 'all') => {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                ...(searchTerm && { searchTerm }),
                statusFilter
            });
            const response = await fetch(`${API_BASE_URL}/requests?${queryParams}`);
            return await response.json();
        } catch (error) {
            console.error('Get requests error:', error);
            return { requests: [], currentPage: 0, totalPages: 0, totalItems: 0 };
        }
    },

    updateStatus: async (requestId, newStatus) => {
        try {
            const formattedStatus = newStatus.toUpperCase().replace(/-/g, '_');
            const response = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: formattedStatus }),
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to update status');
            }
            return data;
        } catch (error) {
            console.error('Status update error:', error);
            return { success: false, message: error.message || 'Failed to update status.' };
        }
    },

    loginAdmin: async (username, password) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
                {
                    method: 'POST',
                }
            );
            return await response.json();
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Failed to login.' };
        }
    },

    // Testimonial endpoints
    getTestimonials: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/testimonials`);
            const data = await response.json();
            return data.testimonials || MOCK_TESTIMONIALS;
        } catch (error) {
            console.error('Get testimonials error:', error);
            return MOCK_TESTIMONIALS;
        }
    },

    getTestimonialById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/testimonials/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Get testimonial error:', error);
            throw new Error('Failed to get testimonial');
        }
    },

    createTestimonial: async (testimonialData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/testimonials`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testimonialData),
            });
            return await response.json();
        } catch (error) {
            console.error('Create testimonial error:', error);
            throw new Error('Failed to create testimonial');
        }
    },

    updateTestimonial: async (id, testimonialData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testimonialData),
            });
            return await response.json();
        } catch (error) {
            console.error('Update testimonial error:', error);
            throw new Error('Failed to update testimonial');
        }
    },

    deleteTestimonial: async (id) => {
        try {
            await fetch(`${API_BASE_URL}/testimonials/${id}`, {
                method: 'DELETE',
            });
            return true;
        } catch (error) {
            console.error('Delete testimonial error:', error);
            throw new Error('Failed to delete testimonial');
        }
    },

    // Before/After endpoints
    getBeforeAfterCases: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/before-after`);
            const data = await response.json();
            return data.cases || MOCK_BEFORE_AFTER_CASES;
        } catch (error) {
            console.error('Get before/after cases error:', error);
            return MOCK_BEFORE_AFTER_CASES;
        }
    },

    getBeforeAfterCaseById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/before-after/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Get before/after case error:', error);
            throw new Error('Failed to get before/after case');
        }
    },

    createBeforeAfterCase: async (caseData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/before-after`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(caseData),
            });
            return await response.json();
        } catch (error) {
            console.error('Create before/after case error:', error);
            throw new Error('Failed to create before/after case');
        }
    },

    updateBeforeAfterCase: async (id, caseData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/before-after/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(caseData),
            });
            return await response.json();
        } catch (error) {
            console.error('Update before/after case error:', error);
            throw new Error('Failed to update before/after case');
        }
    },

    deleteBeforeAfterCase: async (id) => {
        try {
            await fetch(`${API_BASE_URL}/before-after/${id}`, {
                method: 'DELETE',
            });
            return true;
        } catch (error) {
            console.error('Delete before/after case error:', error);
            throw new Error('Failed to delete before/after case');
        }
    },
};

export default api; 