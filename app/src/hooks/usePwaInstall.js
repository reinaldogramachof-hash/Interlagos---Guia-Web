import { useState, useEffect } from 'react';

/**
 * Hook para instalação nativa do PWA.
 *
 * O beforeinstallprompt dispara muito cedo — antes do React montar.
 * Por isso main.jsx captura o evento em window.__pwaPrompt e emite
 * 'pwa-prompt-ready' para notificar hooks que montam depois.
 */
export default function usePwaInstall() {
    const [prompt, setPrompt] = useState(() => window.__pwaPrompt || null);
    const [canInstall, setCanInstall] = useState(() => !!window.__pwaPrompt);
    const [isInstalled, setIsInstalled] = useState(
        () =>
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true
    );

    useEffect(() => {
        // Caso o prompt chegue após a montagem do componente
        const onPromptReady = () => {
            if (window.__pwaPrompt) {
                setPrompt(window.__pwaPrompt);
                setCanInstall(true);
            }
        };

        const onInstalled = () => {
            window.__pwaPrompt = null;
            setPrompt(null);
            setCanInstall(false);
            setIsInstalled(true);
        };

        window.addEventListener('pwa-prompt-ready', onPromptReady);
        window.addEventListener('appinstalled', onInstalled);

        // Verifica novamente ao montar (garante que não perdemos o evento)
        if (window.__pwaPrompt && !prompt) {
            setPrompt(window.__pwaPrompt);
            setCanInstall(true);
        }

        return () => {
            window.removeEventListener('pwa-prompt-ready', onPromptReady);
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, []);

    const install = async () => {
        if (!prompt) return;
        prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === 'accepted') {
            window.__pwaPrompt = null;
            setPrompt(null);
            setCanInstall(false);
        }
    };

    return { canInstall, isInstalled, install };
}
