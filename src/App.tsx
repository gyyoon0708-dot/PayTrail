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
            <Dashboard onOpenSettings={toggleSettings} />

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
