# Box

The `Box` component is the most abstract of the Moaxe UI library. Use it as a general content container.

## Usage

Import `Box` into the file to use the component.

```jsx
import { Box } from '@moaxe/ui';

return (
    <Box as="section">
        <h2>Qui laboris</h2>
        <p>Veniam anim incididunt sit excepteur.</p>
    </Box>
);
```

## Props

| Props      | Required | Type   | Default | Description                                   |
| ---------- | -------- | ------ | ------- | --------------------------------------------- |
| as         | -        | string | div     | Adjust the HTML element tag that is rendered. |
| dataTestId | -        | string | -       | Pass an id to the `[data-test-id]` attribute. |

## HTML Semantics

While the `Box` renders as a `div` by default, be mindful to use a more semantically appropriate HTML tag.
