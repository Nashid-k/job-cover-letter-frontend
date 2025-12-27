import { Toaster } from 'sonner';

const ToastProvider = () => {
    return (
        <Toaster
            position="top-center"
            toastOptions={{
                style: {
                    background: 'rgba(28, 28, 30, 0.8)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    borderRadius: '20px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                },
                className: 'font-sans antialiased',
            }}
        />
    );
};

export default ToastProvider;
