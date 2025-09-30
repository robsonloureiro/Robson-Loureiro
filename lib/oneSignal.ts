// lib/oneSignal.ts

// !! IMPORTANTE !!
// Substitua 'YOUR_ONESIGNAL_APP_ID' pelo ID do seu aplicativo OneSignal.
// Você pode obter isso no painel do OneSignal após criar seu aplicativo.
const ONESIGNAL_APP_ID = 'YOUR_ONESIGNAL_APP_ID';

/**
 * Inicializa o SDK do OneSignal. Deve ser chamado uma vez quando o aplicativo carrega.
 */
export const initOneSignal = (): void => {
  // Garante que o código só rode no navegador e que o SDK do OneSignal esteja disponível
  if (typeof window !== 'undefined' && (window as any).OneSignal) {
    (window as any).OneSignal.init({
      appId: ONESIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: true, // Útil para testes em ambiente de desenvolvimento (http://localhost)
    });
  } else if (typeof document !== 'undefined') {
    // Caso o script ainda não tenha carregado, adiciona um listener para inicializar assim que estiver pronto.
    document.addEventListener('OneSignalSDKReady', () => {
      (window as any).OneSignal.init({ appId: ONESIGNAL_APP_ID, allowLocalhostAsSecureOrigin: true });
    });
  }
};

/**
 * Associa o usuário logado ao dispositivo atual no OneSignal.
 * Isso permite enviar notificações direcionadas para este usuário específico.
 * @param userId - O ID único do usuário (geralmente do Supabase Auth).
 */
export const loginUser = (userId: string): void => {
  if (typeof window !== 'undefined' && (window as any).OneSignal) {
    // O método login irá solicitar permissão de notificação se ainda não tiver sido concedida.
    (window as any).OneSignal.login(userId);
  }
};

/**
 * Desassocia o usuário do dispositivo atual no OneSignal.
 * Chamado durante o logout para parar de receber notificações neste dispositivo.
 */
export const logoutUser = (): void => {
  if (typeof window !== 'undefined' && (window as any).OneSignal) {
    (window as any).OneSignal.logout();
  }
};
