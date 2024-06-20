import { SearchBar } from "@/components/common/SearchBar";
import { FC, useState } from "react";

export const CarSearch: FC = () => {
    const [carModel, setModel] = useState<string>('')

    return <SearchBar search={carModel} onSearchChange={setModel} />
}