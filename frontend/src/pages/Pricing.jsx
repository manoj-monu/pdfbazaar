import { Check } from 'lucide-react';
import AdsPlacement from '../components/AdsPlacement';

const Pricing = () => {
    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh', textAlign: 'center' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '24px' }}>Get more with PDFbazaar.com Pro</h1>
            <p style={{ fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 60px' }}>
                Upgrade to unlock unlimited document processing, OCR, ad-free experience, and exclusive premium features.
            </p>

            <AdsPlacement type="leaderboard" style={{ marginBottom: '60px' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>

                {/* Free Plan */}
                <div style={{
                    background: 'var(--panel-bg)',
                    borderRadius: '24px',
                    border: '1px solid var(--border-color)',
                    padding: '40px',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Free</h3>
                    <div style={{ fontSize: '48px', fontWeight: '800', marginBottom: '8px' }}>$0<span style={{ fontSize: '18px', color: 'var(--text-secondary)', fontWeight: '400' }}>/mo</span></div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Perfect for basic PDF needs.</p>

                    <ul style={{ listStyle: 'none', marginBottom: '40px', flex: 1 }}>
                        {['Access to all basic tools', 'Limited document processing', 'Max file size 20MB', 'Ads supported'].map((feature, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-primary)' }}>
                                <Check size={20} style={{ color: '#10B981' }} /> {feature}
                            </li>
                        ))}
                    </ul>
                    <button className="btn-outline" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontWeight: '600' }}>Current Plan</button>
                </div>

                {/* Pro Plan */}
                <div style={{
                    background: 'var(--panel-bg)',
                    borderRadius: '24px',
                    border: '2px solid var(--primary)',
                    padding: '40px',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    boxShadow: 'var(--card-shadow)',
                    transform: 'scale(1.05)',
                    zIndex: 2
                }}>
                    <div style={{ position: 'absolute', top: '-14px', right: '40px', background: 'var(--primary)', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>Most Popular</div>
                    <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Pro (No Ads)</h3>
                    <div style={{ fontSize: '48px', fontWeight: '800', marginBottom: '8px' }}>$7<span style={{ fontSize: '18px', color: 'var(--text-secondary)', fontWeight: '400' }}>/mo</span></div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>For professionals & heavy users.</p>

                    <ul style={{ listStyle: 'none', marginBottom: '40px', flex: 1 }}>
                        {[
                            'Unlimited document processing',
                            'No Ads (Clean Experience)',
                            'Max file size 1GB per file',
                            'Premium tools & features (OCR)',
                            'Batch processing',
                            'Advanced PDF Editor'
                        ].map((feature, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-primary)' }}>
                                <Check size={20} style={{ color: 'var(--primary)' }} /> {feature}
                            </li>
                        ))}
                    </ul>
                    <button className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontWeight: '600', fontSize: '16px' }}>Get Started with Pro</button>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
