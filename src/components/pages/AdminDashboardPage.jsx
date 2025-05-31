import { useLanguage } from '../../App'; // Assuming App.js exports useLanguage
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../common/ui-utils'; // Combined Card imports
import { Button } from '../common/ui-utils';
import { Loader2, X, ChevronLeft, ChevronRight, Search } from 'lucide-react'; // Combined lucide-react imports
import api from '../../services/api';
import Message from '../common/Message';
import { cn } from '../../utils/helpers';
import LoadingIndicator from '../common/LoadingIndicator';
import { Label } from '../common/ui-utils';
import Select from '../common/Select/Select'; // Assuming Select is the default export from this path
import SelectTrigger from '../common/Select/SelectTrigger';
import SelectValue from '../common/Select/SelectValue';
import SelectContent from '../common/Select/SelectContent';
import SelectItem from '../common/Select/SelectItem';
import { Input } from '../common/ui-utils';


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
    }, [t, ITEMS_PER_PAGE, requests.length, error, searchTerm, statusFilter]); // Added missing dependencies for useCallback

    useEffect(() => {
        if (!adminToken) {
            navigateTo('adminLogin');
        } else {
            fetchRequests(0, searchTerm, statusFilter);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [adminToken, navigateTo, searchTerm, statusFilter]); // fetchRequests is stable due to useCallback, but still good practice to list if it changes

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
    
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        return (
            <div className="flex justify-center items-center space-x-2 mt-6 py-4 border-t">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0 || tableLoading}
                    className="flex items-center"
                >
                    <ChevronLeft className={cn("h-4 w-4", language === 'ar' ? 'ml-1' : 'mr-1')} /> {t('previousPage')}
                </Button>
                <span className="text-sm text-gray-700 p-2 rounded-md bg-gray-100">
                    {t('page')} {currentPage + 1} {t('of')} {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1 || tableLoading}
                    className="flex items-center"
                >
                    {t('nextPage')} <ChevronRight className={cn("h-4 w-4", language === 'ar' ? 'mr-1' : 'ml-1')} />
                </Button>
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

    // Corrected formatStatusKey function
    const formatStatusKey = (statusValue) => {
        if (!statusValue) return 'statusOptionUnknown'; // Handle undefined or null statusValue
        return `statusOption${statusValue
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Ensures the rest of the word is lowercase
            .join('')}`;
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
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-900">{t('adminDashboardTitle')}</h2>
                <Button onClick={() => fetchRequests(currentPage, searchTerm, statusFilter)} variant="outline" size="default" disabled={tableLoading} className="flex-shrink-0 sm:ms-auto">
                    <Loader2 className={cn("h-4 w-4", tableLoading ? 'animate-spin':'', language === 'ar' ? 'ml-2' : 'mr-2')} /> {t('refreshRequestsButton')}
                </Button>
            </div>

            <Card className="p-4 sm:p-6 shadow-md">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                    <div className="w-full lg:w-auto">
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">{t('filterByStatus')}</Label>
                        <div className="flex space-x-1 rounded-md bg-gray-100 p-1 shadow-sm">
                            {['all', 'inProgress', 'done'].map(filter => (
                                <Button
                                    key={filter}
                                    onClick={() => handleFilterChange(filter)}
                                    variant={statusFilter === filter ? 'default' : 'ghost'}
                                    size="sm"
                                    className={cn(
                                        "px-3 py-1.5 text-xs sm:text-sm flex-1 lg:flex-none",
                                        statusFilter === filter ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
                                    )}
                                >
                                    {t(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`)}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <form onSubmit={handleSearch} className="flex-grow flex items-end gap-2 w-full lg:w-auto lg:max-w-md">
                         <div className="relative flex-grow">
                            <Label htmlFor="adminSearchInput" className="sr-only">{t('searchPlaceholder')}</Label>
                            <Input 
                                id="adminSearchInput"
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder={t('searchPlaceholder')}
                                className={cn("pe-10 h-10", language === 'ar' ? "ps-10" : "pr-10")}
                            />
                            <Search className={cn("absolute h-5 w-5 text-gray-400 top-1/2 -translate-y-1/2", language === 'ar' ? "left-3" : "right-3")} />
                        </div>
                        <Button type="submit" variant="default" size="default" disabled={tableLoading} className="h-10 px-4">
                            <Search className={cn("h-4 w-4", language === 'ar' ? 'ml-2' : 'mr-2')} /> {t('searchButton')}
                        </Button>
                        {searchTerm && (
                            <Button type="button" variant="outline" size="default" onClick={handleClearSearch} disabled={tableLoading} className="h-10 px-4">
                                <X className={cn("h-4 w-4", language === 'ar' ? 'ml-2' : 'mr-2')} />{t('clearSearchButton')}
                            </Button>
                        )}
                    </form>
                </div>
            </Card>
            
            {error && <Message type="error" title={t('errorLoadingDashboardTitle')} message={error} />}
            {updateMessage && <Message type={updateMessage.type} message={updateMessage.text} />}

            <Card>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className={cn("px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", language === 'ar' ? 'text-right' : 'text-left')}>{t('tableHeaderRequestId')}</th>
                                    <th className={cn("px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", language === 'ar' ? 'text-right' : 'text-left')}>{t('tableHeaderCustomer')}</th>
                                    <th className={cn("px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", language === 'ar' ? 'text-right' : 'text-left')}>{t('tableHeaderPhoneModel')}</th>
                                    <th className={cn("px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", language === 'ar' ? 'text-right' : 'text-left')}>{t('tableHeaderStatus')}</th>
                                    <th className={cn("px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider", language === 'ar' ? 'text-right' : 'text-left')}>{t('tableHeaderActions')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tableLoading ? ( 
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center">
                                            <div className="flex justify-center items-center">
                                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                                <span className={cn("text-gray-600", language === 'ar' ? 'mr-3' : 'ml-3')}>{t('loadingRequests')}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : requests.length > 0 ? (
                                    requests.map((req) => (
                                        <tr key={req.requestId} className="hover:bg-gray-50 transition-colors">
                                            <td className={cn("px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", language === 'ar' ? 'text-right' : 'text-left')}>{req.requestId}</td>
                                            <td className={cn("px-6 py-4 whitespace-nowrap text-sm text-gray-500", language === 'ar' ? 'text-right' : 'text-left')}>
                                                {req.customerName || 'N/A'} <br/> ({req.phoneNumber})
                                            </td>
                                            <td className={cn("px-6 py-4 whitespace-nowrap text-sm text-gray-500", language === 'ar' ? 'text-right' : 'text-left')}>{req.phoneInfo}</td>
                                            <td className={cn("px-6 py-4 whitespace-nowrap text-sm", language === 'ar' ? 'text-right' : 'text-left')}>
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${req.status.toLowerCase() === 'data_recovered' ? 'bg-green-100 text-green-800' : 
                                                    req.status.toLowerCase() === 'data_cant_recover' ? 'bg-red-100 text-red-800' :
                                                    req.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    req.status.toLowerCase() === 'paid' ? 'bg-blue-100 text-blue-800' :
                                                    req.status.toLowerCase() === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                                                    req.status.toLowerCase() === 'delivered' ? 'bg-purple-100 text-purple-800' :
                                                    req.status.toLowerCase() === 'evaluating_device' ? 'bg-yellow-100 text-yellow-800' : 
                                                    'bg-gray-100 text-gray-800'}`}>
                                                    {t(formatStatusKey(req.status)) || req.status}
                                                </span>
                                            </td>
                                            <td className={cn("px-6 py-4 whitespace-nowrap text-sm font-medium", language === 'ar' ? 'text-left' : 'text-right')}>
                                                <Button variant="outline" size="sm" onClick={() => { setSelectedRequest(req); setNewStatus(req.status); setUpdateMessage(null); }}>
                                                    {t('viewEditButton')}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : ( 
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                            {t('noRequestsFound')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
                 {renderPagination()}
            </Card>

            <AnimatePresence>
            {selectedRequest && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedRequest(null)}
                >
                    <Card className="w-full max-w-lg bg-white shadow-xl rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        <CardHeader className="bg-gray-50">
                            <div className="flex justify-between items-center">
                                <CardTitle>{t('requestDetailsTitle', {requestId: selectedRequest.requestId})}</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedRequest(null)}><X className="h-5 w-5"/></Button>
                            </div>
                            <CardDescription>{t('customerLabel')} {selectedRequest.customerName} ({selectedRequest.phoneNumber})</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            <p><strong>{t('emailLabelModal')}</strong> {selectedRequest.email}</p>
                            <p><strong>{t('phoneModelLabelModal')}</strong> {selectedRequest.phoneInfo}</p>
                            <p><strong>{t('issueLabelModal')}</strong> {selectedRequest.issue}</p>
                            <p><strong>{t('paymentInfoLabelModal')}</strong> {selectedRequest.paymentInfo} {selectedRequest.transactionId && `(ID: ${selectedRequest.transactionId})`}</p>
                            <p><strong>{t('currentStatusLabelModal')}</strong> <span className="font-semibold">{t(formatStatusKey(selectedRequest.status)) || selectedRequest.status}</span></p>
                            
                            <div className="pt-4 border-t">
                                <Label htmlFor="newStatus" className="font-semibold">{t('updateStatusLabelModal')}</Label>
                                <Select onValueChange={setNewStatus} value={newStatus}>
                                    <SelectTrigger className="mt-1 w-full">
                                        <SelectValue placeholder={t('selectNewStatusPlaceholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{t(opt.labelKey)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {updateMessage && <Message type={updateMessage.type} message={updateMessage.text} />}
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50">
                            <Button onClick={() => handleUpdateRequestStatus(selectedRequest.requestId)} disabled={updatingStatus || newStatus === selectedRequest.status}>
                                {updatingStatus ? <><Loader2 className={cn("h-4 w-4 animate-spin", language === 'ar' ? 'ml-2' : 'mr-2')} />{t('updatingButtonModal')}</> : t('saveStatusChangeButton')}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AdminDashboardPage;