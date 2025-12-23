import { useState, useEffect } from 'react';

const PromoBar = () => {
    const messages = [
        "🔥 FREE SHIPPING ON ORDERS OVER ฿2,000",
        "⚡ NEW DROP: 'MIDNIGHT RUNNER' COLLECTION AVAILABLE NOW",
        "🎫 USE CODE 'JEFF10' FOR 10% OFF YOUR FIRST ORDER"
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex(prev => (prev + 1) % messages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{
            background: 'var(--color-neon-green)',
            color: 'black',
            textAlign: 'center',
            padding: '0.4rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            letterSpacing: '1px',
            position: 'fixed',
            top: 0, 
            left: 0, 
            width: '100%',
            zIndex: 1001, // Higher than Navbar
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '35px'
        }}>
            <span key={index} style={{ animation: 'fadeIn 0.5s ease-out' }}>
                {messages[index]}
            </span>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default PromoBar;
