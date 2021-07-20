# Style Guide

Code style is enforced as part of our CI/CD pipelines and all code must adhere to the proper style prior to it being able to merge.

## Frontend

### Format

Our frontend code is _automatically_ formatted using [Prettier](https://prettier.io/). Some (not all) of Prettier's styling decisions are explained [here](https://prettier.io/docs/en/rationale.html).

### Naming

Variable and function names should be in `camelCase`.

React components should be in `PascalCase` and the file name should match the component name. For example, a component named `ExampleComponent` should be in `ExampleComponent.tsx`.

## Backend

Our backend code is _automatically_ formatted using [Black](https://github.com/psf/black). For style-specific information, please see [Black's style guide](https://github.com/psf/black/blob/master/docs/the_black_code_style.md).
