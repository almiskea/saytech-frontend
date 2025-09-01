
// --- cn Utility ---
export const cn = (...inputs) => {
    return inputs.filter(Boolean).join(' ');
};

// --- Mobile Detection Utility ---
export const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
};