import { ForwardedRef } from 'react';
import { forwardRefWithAs, WithAs, WithTestId } from '../../../types';

type BoxProps = WithTestId;

export const Box = forwardRefWithAs<BoxProps, 'div'>(
    (
        props: WithAs<BoxProps, 'div'>,
        ref: ForwardedRef<HTMLDivElement>
    ): JSX.Element => {
        const {
            as: Box = 'div',
            children,
            dataTestId,
            ...HTMLElementAttributes
        } = props;

        return (
            <Box
                data-moaxe-id="box"
                data-test-id={dataTestId}
                ref={ref}
                {...HTMLElementAttributes}
            >
                {children}
            </Box>
        );
    }
);
