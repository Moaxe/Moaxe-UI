import { ForwardedRef } from 'react';
import {
    forwardRefWithAs,
    WithAs,
    WithTestId,
    WithUnsafeProps,
} from '../../../types';

type BoxProps = WithTestId & WithUnsafeProps;

export const Box = forwardRefWithAs<BoxProps, 'div'>(
    (
        props: Omit<WithAs<BoxProps, 'div'>, 'style' | 'className'>,
        ref: ForwardedRef<HTMLDivElement>
    ): JSX.Element => {
        const {
            as: Box = 'div',
            children,
            dataTestId,
            UNSAFE_className,
            UNSAFE_style,
            ...HTMLElementAttributes
        } = props;

        return (
            <Box
                data-moaxe-id="box"
                data-test-id={dataTestId}
                ref={ref}
                className={UNSAFE_className}
                style={UNSAFE_style}
                {...HTMLElementAttributes}
            >
                {children}
            </Box>
        );
    }
);
