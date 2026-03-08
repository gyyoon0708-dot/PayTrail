import React, { useEffect, useState } from 'react';
import { useStore } from './store';
import { Dashboard } from './components/dashboard/Dashboard';
import { SettingsPage } from './components/settings/SettingsPage';
import { SubscriptionModal } from './components/modals/SubscriptionModal';
import { Settings as SettingsIcon } from 'lucide-react';

function App() {
    const { runAutomatedEngine } = useStore();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

    // Run engine once on mount
    useEffect(() => {
        runAutomatedEngine();
    }, [runAutomatedEngine]);

    const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);
    const openSubscription = () => {
        setIsSubscriptionOpen(true);
        // Optionally close settings if they were navigated from there
    };

    return (
        <div className="relative font-sans text-slate-100 selection:bg-primary selection:text-white">
            {/* Global Setting Button Intercept on Top Right */}
            <div className="fixed top-6 right-4 z-40 max-w-md mx-auto inset-x-0 w-full flex justify-end px-4 pointer-events-none">
                <button onClick={toggleSettings} className="pointer-events-auto p-2.5 rounded-full bg-slate-800 text-slate-300 hover:text-white transition-colors haptic-active shadow-lg">
                    <SettingsIcon size={20} />
                </button>
            </div>

            <Dashboard />

            {isSettingsOpen && (
                <SettingsPage
                    onClose={() => setIsSettingsOpen(false)}
                    onOpenSubscription={openSubscription}
                />
            )}

            {isSubscriptionOpen && (
                <SubscriptionModal onClose={() => setIsSubscriptionOpen(false)} />
            )}
        </div>
    );
}

export default App;
