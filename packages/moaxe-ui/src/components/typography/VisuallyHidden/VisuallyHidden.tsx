import { PropsWithChildren } from 'react';
import { WithTestId } from 'packages/moaxe-ui/src/types';

export interface VisuallyHiddenProps extends PropsWithChildren, WithTestId {}

export function VisuallyHidden({ children }: VisuallyHiddenProps) {
    return <span>{children}</span>;
}
