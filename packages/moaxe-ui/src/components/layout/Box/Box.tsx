import { ElementType, PropsWithChildren } from 'react';
import { WithTestId } from '../../../types';

export interface BoxProps extends PropsWithChildren, WithTestId {
    as?: ElementType;
}

export function Box({ as: Tag = 'div', children, dataTestId }: BoxProps) {
    return (
        <Tag data-moaxe-id="box" data-testid={dataTestId}>
            {children}
        </Tag>
    );
}
