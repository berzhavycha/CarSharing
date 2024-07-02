import { getCar } from "@/services";
import { LoaderFunctionArgs, defer } from "react-router-dom";

export const singleCarLoader = (args: LoaderFunctionArgs): ReturnType<typeof defer> => {
    const data = getCar(args.params.carId ?? '')

    return defer({
        data
    })
}