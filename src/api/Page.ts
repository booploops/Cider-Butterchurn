import { CustomElements } from "../main"
import { customElementName } from "../utils";
import { useRouter } from "./Std"

type GoToPageOptions = {
    name: keyof typeof CustomElements
}

export async function goToPage(opts: GoToPageOptions) {
    const page = customElementName(opts.name);
    const routeBase = `/ugc/plugins/ce/`

    const $router = useRouter();
    return await $router.push(`${routeBase}${page}`)
}