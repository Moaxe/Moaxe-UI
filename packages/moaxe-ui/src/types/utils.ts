import { ReactNode } from "react"

export type WithChildren = {
    children: ReactNode
}

export type WithTestId = {
    ["data-testid"]?: string;
}