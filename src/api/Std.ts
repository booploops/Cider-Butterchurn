// @ts-nocheck

export function useRouter() {
    return CiderApp.router
}

export function getURLParam(name: string) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

export function useCider() {
    return window.CiderApp;    
}