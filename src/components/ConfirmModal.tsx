

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
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
                        onClick={onCancel}
                        style={{
                            background: '#333',
                            color: '#FFF',
                            border: '1px solid #555'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            // Using primary-btn logic from global css implicitly or override here
                            background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
                            color: '#000'
                        }}
                    >
                        Confirm Leave
                    </button>
                </div>
            </div>
        </div>
    );
}
