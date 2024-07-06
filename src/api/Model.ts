import { CustomElements } from "../main"
import { customElementName } from "../utils";
import { useRouter } from "./Std"

type ModalStyle = 'fullscreen' | 'card'
type ModalOptions = {
    name: keyof typeof CustomElements,
    style: ModalStyle
}

export function useModal(opts: ModalOptions) {
    const page = customElementName(opts.name);
    const routeBase = '/ugc/plugins/ce/'

    const $router = useRouter();
    $router.push(`${routeBase}${page}`)
}