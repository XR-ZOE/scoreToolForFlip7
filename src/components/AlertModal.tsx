interface AlertModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}

export function AlertModal({ isOpen, title, message, onConfirm }: AlertModalProps) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{
                width: '90%',
                maxWidth: '400px',
                border: '2px solid #FFD700',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
                textAlign: 'center'
            }}>
                <h3 style={{ marginTop: 0, color: '#FFD700' }}>{title}</h3>
                <p style={{ color: '#DDD', marginBottom: '24px' }}>{message}</p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                        onClick={onConfirm}
                        style={{
                            background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
                            color: '#000',
                            minWidth: '100px'
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
