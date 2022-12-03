import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Box } from './Box';
import { useRef } from 'react';

describe('<Box />', () => {
    const testId = 'moaxe-box';

    beforeEach(() => {
        const boxRef = useRef<HTMLDivElement>(null);

        render(
            <>
                <Box as="section" dataTestId={testId} ref={boxRef}>
                    <span>The Ballad of the Headless Horseman</span>
                </Box>
            </>
        );
    });

    test('Renders with correct testId', () => {
        screen.getByTestId(testId);
    });

    test('Renders with data-moaxe-id', () => {
        expect(screen.getByTestId(testId)).toHaveAttribute('data-moaxe-id');
    });
});
