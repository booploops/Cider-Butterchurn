import { PAPIEvents } from "./ciderapi-types/PAPIEvents";

/**
 * Subscribe to a PAPI event
 *
 * @param event - The event to subscribe to
 * @param cb - The callback to run when the event is emitted
 * @param opts - Options for the event listener
 * @returns A function to unsubscribe from the event
 * 
 */
export function subscribeEvent<T>(event: PAPIEvents, cb: (e: T) => void, opts?: Partial<{ once: boolean, passive: boolean, capture: boolean }>) {
    // unwrap e.detail in the callback 
    const wrappedCb = (e: CustomEvent<T>) => cb(e.detail);
    __PLUGINSYS__.PAPIInstance.addEventListener(event, wrappedCb, opts);

    return () => {
        unsubscribeEvent(event, wrappedCb);
    }
}

/**
 * Wrapper for subscribing to an event once
 */
export function subscribeEventOnce<T>(event: PAPIEvents, cb: (e: T) => void) {
    return subscribeEvent(event, cb, { once: true });
}

export function unsubscribeEvent<T>(event: PAPIEvents, cb: (e: T) => void) {
    __PLUGINSYS__.PAPIInstance.removeEventListener(event, cb);
}