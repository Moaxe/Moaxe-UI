import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Box } from './Box';

describe('<Box />', () => {
    const testId = 'moaxe-box';

    beforeEach(() => {
        render(
            <Box as="section" dataTestId={testId}>
                <span>The Ballad of the Headless Horseman</span>
            </Box>
        );
    });

    test('Renders with correct testId', () => {
        screen.getByTestId(testId);
    });

    test('Renders with data-moaxe-id', () => {
        expect(screen.getByTestId(testId)).toHaveAttribute('data-moaxe-id');
    });
});
