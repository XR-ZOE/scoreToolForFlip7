
// Wrapper for Google Analytics 4
// Make sure to add the script tag to index.html with your Measurement ID.

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

export const GA_MEASUREMENT_ID = 'G-FDQ39N2SEN'; // TODO: Replace with your actual Measurement ID

export const logEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
    } else {
        // console.log(`[GA Stub] Event: ${eventName}`, params);
    }
};

export const initGA = () => {
    // This function is just a placeholder if we wanted to init via code, 
    // but we will do it via index.html script tag for simplicity and standard practice
};
