// allow for any string so we can have intellisense
type BuiltInClasses = 'fullscreen' | (string & {})


type CreateModalOptions = {
    escClose?: boolean;
    className?: BuiltInClasses[];
    noDefaultClass?: boolean;
    element?: HTMLElement;
}
export function createModal(opts: CreateModalOptions) {
    const dialogElement = document.createElement("dialog");
    if(opts.element) {
        dialogElement.appendChild(opts.element);
    }
    
    const openDialog = () => {
        document.body.appendChild(dialogElement);
        dialogElement.showModal();

        // if escClose is true, close the dialog when the user presses the escape key
        if (opts.escClose) {
            dialogElement.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeDialog();
                }
            })
        }
    }

    const closeDialog = () => {
        dialogElement.close();
        dialogElement.remove();
    }

    const addClass = (className: BuiltInClasses) => {
        dialogElement.classList.add(className);
    }

    if (!opts.noDefaultClass) {
        dialogElement.classList.add("plugin-base-modal");
    }

    if (opts.className) {
        opts.className.forEach((className) => {
            dialogElement.classList.add(className);
        })
    }

    return {
        openDialog,
        closeDialog,
        dialogElement,
        addClass
    }
}