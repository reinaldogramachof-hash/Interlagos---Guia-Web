import { useEffect, useRef } from 'react';

/**
 * Trava o scroll do body quando `isLocked` é true.
 * Usa position:fixed para funcionar no iOS Safari (overflow:hidden não é suficiente).
 * Restaura a posição de scroll ao desbloquear.
 */
export function useScrollLock(isLocked) {
  const scrollY = useRef(0);

  useEffect(() => {
    if (!isLocked) return;

    scrollY.current = window.scrollY;
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY.current}px`;
    body.style.width = '100%';
    body.style.overflowY = 'scroll'; // evita layout shift por barra de rolagem

    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      body.style.overflowY = '';
      window.scrollTo(0, scrollY.current);
    };
  }, [isLocked]);
}
