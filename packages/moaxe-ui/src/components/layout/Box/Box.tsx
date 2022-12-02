import React from "react";
import { WithChildren, WithTestId } from "../../../types";

export interface BoxProps extends WithChildren, WithTestId {}

export function Box({ children }: BoxProps) {
  return <div>{children}</div>;
}
