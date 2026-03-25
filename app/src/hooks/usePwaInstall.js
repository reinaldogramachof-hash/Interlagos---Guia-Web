import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar a instalação nativa do PWA.
 * - `canInstall`   : true quando o browser tem um prompt disponível
 * - `isInstalled`  : true quando o app já está rodando como PWA instalado
 * - `install()`    : dispara o prompt nativo de instalação
 */
export default function usePwaInstall() {
    const [prompt, setPrompt]       = useState(null);
    const [canInstall, setCanInstall] = useState(false);
    const [isInstalled, setIsInstalled] = useState(
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true
    );

    useEffect(() => {
        const onBeforeInstall = (e) => {
            e.preventDefault();
            setPrompt(e);
            setCanInstall(true);
        };

        const onInstalled = () => {
            setCanInstall(false);
            setPrompt(null);
            setIsInstalled(true);
        };

        window.addEventListener('beforeinstallprompt', onBeforeInstall);
        window.addEventListener('appinstalled', onInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', onBeforeInstall);
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, []);

    const install = async () => {
        if (!prompt) return;
        prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === 'accepted') {
            setCanInstall(false);
            setPrompt(null);
        }
    };

    return { canInstall, isInstalled, install };
}
