import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.paytrail.app',
    appName: 'PayTrail',
    webDir: 'dist',
    server: {
        androidScheme: 'https',
        allowNavigation: ['*'],
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: '#0A0F1E',
            showSpinner: false,
        },
        StatusBar: {
            style: 'Dark',
            backgroundColor: '#0A0F1E',
        },
        LocalNotifications: {
            smallIcon: 'ic_stat_icon',
            iconColor: '#10D9A0',
        },
    },
    android: {
        buildOptions: {
            releaseType: 'APK',
        },
    },
};

export default config;
