// Utilitário para gerenciar a instalação do PWA

let deferredPrompt;

export const registerInstallPrompt = () => {
    window.addEventListener('beforeinstallprompt', (e) => {
        // Previne o Chrome de mostrar o prompt nativo automaticamente
        e.preventDefault();
        // Guarda o evento para ser disparado depois
        deferredPrompt = e;
        console.log("PWA: Evento de instalação capturado");
    });
};

export const installApp = async () => {
    if (!deferredPrompt) {
        console.log("PWA: Instalação não disponível ou já instalada");
        return;
    }

    // Mostra o prompt
    deferredPrompt.prompt();

    // Espera a escolha do usuário
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA: Usuário escolheu ${outcome}`);

    deferredPrompt = null;
};

export const isInstallAvailable = () => {
    return !!deferredPrompt;
};
