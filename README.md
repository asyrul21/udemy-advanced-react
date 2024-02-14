# Advanced React Guide

Based on the following Udemy Courses:

1. [Advanced React for Enterprise: React for Senior Engineers ](https://www.udemy.com/course/react-for-senior-engineers)

2. [Webpack 5: Optimizing for Production](https://www.udemy.com/course/webpack-optimizing-for-production)

3. [Nginx Fundamentals](https://www.udemy.com/course/nginx-fundamentals)

## Design Systems

[Atomic Design Methodology](https://atomicdesign.bradfrost.com/chapter-2/)

## Styling Architecture

use scss `var()` to give a default but enable overriding

1. Define your `_variables`:

Variables has nothing to do with your app. It is app-independent. They usually come from the Design System.

- Colors

  - Brand Colors
  - Neutral Colors
  - Utility Colors

- Typegraphy

  - font families
  - font sizes
  - heading font sizes
  - font weights

- Breakpoints

  - breakpoints

- ## spacings

2. Define your `_colors`:

Colors are specific to your application. Your apps and components will use these variables.

- Global Text Color

- Global Background Color

- Global Button Colors

- Global Form Colors

- All other foundational components

3. Define your `_typography`

This is also specific to your application. Your apps and components will use these variables.

- font sizes
- heading font sizes
- font weights

4. Define your `_mixins`

This is also specific to your application. Your apps and components will use these variables.

The `media-query mixin pattern`:

```scss
@mixin tablet {
  @media (min-width: map-get($breakpoints, "md")) {
    @content;
  }
}

// .body {
//     font-size: 12px;
//     @include tablet {
//         font-size: 14px;
//     }
// }
```

The `spacings mixin pattern`:

```scss
@mixin padding-top($space) {
  padding-top: map-get($spacing, $space);
}

// @include padding-top('sm');

@mixin margin-top($space) {
  margin-top: map-get($spacing, $space);
}

// @include margin-top('sm');
```

6. Define your `_all.scss` to import everything.

7. Define your `global.scss`

- foundation

- base
  - css reset: Normalize CSS - What is CSS Normalize ?
  - root

## Formatting

- Use [Stylelint](https://stylelint.io/user-guide/get-started) and [Guilelines](https://www.npmjs.com/package/stylelint-config-sass-guidelines)

```bash
npm install --save-dev stylelint stylelint-config-standard-scss stylelint-config-sass-guidelines stylelint-config-prettier stylelint-prettier prettier
```

- Use Prettier

```bash
npm install --save-dev prettier
```

- stylelintrc.json:

```json
{
  "plugins": ["stylelint-prettier"],
  "extends": [
    "stylelint-config-sass-guidelines",
    "stylelint-config-prettier",
    "stylelint-prettier/recommended"
  ],
  // additional rules
  "rules": {
    "indentation": 2
  }
}
```

- package.json

```json
"scripts": {
    "lint-styles": "stylelint ./**/*.scss",
    "lint-styles:fix": "npm run lint-styles --fix"
}
```

```bash
npm run lint-styles
```

## Configuring Husky Pre-Commit Hook

1. Install

```bash
npm install --save-dev husky lint-staged
```

2. package.json

```json
"husky": {
    "hooks": {
        "pre-commit": "lint-staged"
    }
},
"lint-staged": {
    "*.scss": "npm run lint-styles:fix"
}
```

## Compiling SCSS to CSS

[Lecture](https://www.udemy.com/course/react-for-senior-engineers/learn/lecture/26837986#questions/15639252)

# Monorepository with Lerna

1. Initialize a wrapper NPM project, and install lerna

```bash
npm init # in root directory

npm install --save-dev lerna
```

2. Init

```bash
npx lerna init
```

3. lerna.json

```json
{
  "packages": ["packages/*"],
  "version": "0.0.0",
  "npmClient": "npm",
  "useWorkspaces": true,
  "stream": true
}
```

4. package.json

```json
"private": true,
"workspaces": {
    "packages": [
        "packages/*"
    ],
    // ignore hoisting
    "nohoist": [
        "**/normalize-scss"
    ]
}
```

# React Notes

## Utility Classes

Automatically generating spacing classes using `@each` in `map` pattern:

```scss
// import your $spacing map or foundations

@each $size, $value in $spacing {
  .dse-width-#{$size} {
    width: $value;
  }

  .dse-height-#{$size} {
    height: $value;
  }
}
```

# Webpack

See `02-webpack/README.md`
