import { PropsWithChildren } from "react";
import { WithTestId } from "../../../types";

export interface BoxProps extends PropsWithChildren, WithTestId {}

export function Box({ children }: BoxProps) {
  return <div>{children}</div>;
}
