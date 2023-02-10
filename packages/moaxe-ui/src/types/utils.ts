import React from 'react';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type As<Props = any> = React.ElementType<Props>;

export type WithAs<
    Props = Record<string, unknown>,
    Type extends As = As
> = Props &
    Omit<React.ComponentProps<Type>, 'as' | 'style' | keyof Props> & {
        as?: Type;
    };

export type ComponentWithAs<Props, DefaultType extends As> = {
    <Type extends As>(props: WithAs<Props, Type> & { as: Type }): JSX.Element;
    (props: WithAs<Props, DefaultType>): JSX.Element;
};

export function forwardRefWithAs<Props, DefaultType extends As>(
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    component: React.ForwardRefRenderFunction<any>
) {
    return React.forwardRef(component) as unknown as ComponentWithAs<
        Props,
        DefaultType
    >;
}

export type WithTestId = {
    dataTestId?: string;
};

export type WithUnsafeProps = {
    UNSAFE_className?: string;
    UNSAFE_style?: React.CSSProperties;
};
