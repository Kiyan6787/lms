"use client"

import { Category } from "@prisma/client"
import { 
    FcEngineering,
    FcSportsMode,
    FcBiotech,
    FcBriefcase,
    FcCalculator,
    FcCurrencyExchange,
    FcMultipleDevices
 } from "react-icons/fc"
import { GiVote} from "react-icons/gi"
import { IconType } from "react-icons"
import { CategoryItem } from "./category-item"

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category['name'], IconType> = {
    "Engineering": FcEngineering,
    "Medicine": FcBiotech,
    "Politics": GiVote,
    "Computer Science": FcMultipleDevices,
    "Business": FcBriefcase,
    "Actuarial Science": FcCalculator,
    "Fitness": FcSportsMode,
    "Economics": FcCurrencyExchange
}

export const Categories = ({items} : CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((category) => (
                <CategoryItem
                    key={category.id}
                    label={category.name}
                    icon={iconMap[category.name]}
                    value={category.id}
                />
            ))}
        </div>
    )
}