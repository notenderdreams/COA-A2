# Design System & Style Guide

## 4-Based Spacing Scale

All spacing, sizing, and measurements use a **4-pixel base unit**. This creates a perfect rhythm throughout the application with all values being multiples of 4.

### Spacing Values

| Scale | Value | Units |
| ----- | ----- | ----- |
| `xs`  | 4px   | 1     |
| `sm`  | 8px   | 2     |
| `md`  | 12px  | 3     |
| `lg`  | 16px  | 4     |
| `xl`  | 20px  | 5     |
| `2xl` | 24px  | 6     |
| `3xl` | 32px  | 8     |
| `4xl` | 40px  | 10    |
| `5xl` | 48px  | 12    |

### Typography Scale

| Scale  | Size | Usage                        |
| ------ | ---- | ---------------------------- |
| `xs`   | 10px | Small labels, metadata       |
| `sm`   | 12px | Body text, secondary text    |
| `base` | 14px | Standard content             |
| `md`   | 16px | Secondary headers            |
| `lg`   | 18px | Section headers              |
| `xl`   | 20px | Main headers                 |
| `2xl`  | 24px | Page titles, large headlines |

### Font Weights

- **Normal**: 400 (regular text)
- **Medium**: 500 (secondary emphasis)
- **Semibold**: 600 (primary emphasis, headers)

## Component Dimensions

### Height Scale (4-based)

| Size | Height | Units |
| ---- | ------ | ----- |
| `xs` | 24px   | 6     |
| `sm` | 28px   | 7     |
| `md` | 32px   | 8     |
| `lg` | 40px   | 10    |
| `xl` | 48px   | 12    |

### Width Scale (4-based)

| Usage       | Width | Units |
| ----------- | ----- | ----- |
| Input field | 80px  | 20    |
| Button      | 100px | 25    |
| Panel       | 240px | 60    |
| Divider     | 5px   | —     |

## Color Palette

### Background Colors

- **Primary**: #1a1a1a (main bg)
- **Secondary**: #222222 (cards)
- **Tertiary**: #2a2a2a (hover)
- **Quaternary**: #313131 (disabled)

### Text Colors

- **Primary**: #a9b1d6 (main text)
- **Secondary**: #787c99 (secondary text)
- **Tertiary**: #4a4a5a (muted text)

### Semantic Colors

- **Green**: #73daca (success)
- **Red**: #f7768e (error/danger)
- **Amber**: #e0af68 (warning)
- **Blue**: #7aa2f7 (primary/info)
- **Purple**: #bb9af7 (active/emphasis)
- **Cyan**: #7dcfff (highlight)
- **Orange**: #ff9e64 (accent)

## Border & Radius

### Border Widths

- **Thin**: 1px
- **Default**: 1px
- **Thick**: 2px

### Border Radius

- **None**: 0
- **Small**: 4px
- **Medium**: 6px
- **Large**: 8px
- **Full**: 9999px

## Component-Specific Guidelines

### Buttons

- **Padding**: 8px 12px (sm) to 16px 24px (lg)
- **Height**: 28px–48px (4-based scale)
- **Font Size**: 12px (sm)
- **Border Radius**: 6px

### Input Fields

- **Padding**: 12px 16px
- **Height**: 32px
- **Font Size**: 12px
- **Border Radius**: 6px

### Cards/Panels

- **Padding**: 24px
- **Border Radius**: 8px
- **Gap between items**: 16px

### Table

- **Cell Padding**: 12px 16px (3 units × 4 units)
- **Row Height**: 32px–40px
- **Font Size**: 12px–14px

### Divider

- **Width**: 5px
- **Height**: 32px
- **Color**: border-secondary

### TopBar

- **Height**: 48px (12 units)
- **Padding**: 16px (4 units)
- **Gap**: 16px

### Footer/ControlPanel

- **Height**: 48px (12 units)
- **Padding**: 8px (2 units)
- **Gap**: 4px–8px

## Tailwind Class Examples

### Spacing (all 4-based)

```html
<!-- Padding -->
<div class="p-4">
  <!-- 16px -->
  <div class="px-4 py-2">
    <!-- 16px horizontal, 8px vertical -->

    <!-- Margin -->
    <div class="m-3">
      <!-- 12px -->
      <div class="mx-auto">
        <!-- auto horizontal, no vertical -->

        <!-- Gap -->
        <div class="gap-4"><!-- 16px gap --></div>
      </div>
    </div>
  </div>
</div>
```

### Typography

```html
<!-- Font sizes (mapped to scale) -->
<p class="text-xs"><!-- 10px --></p>
<p class="text-sm"><!-- 12px --></p>
<p class="text-base"><!-- 14px --></p>
<p class="text-lg"><!-- 18px --></p>
<p class="text-xl">
  <!-- 20px -->

  <!-- Font weights -->
</p>

<p class="font-normal"><!-- 400 --></p>
<p class="font-medium"><!-- 500 --></p>
<p class="font-semibold"><!-- 600 --></p>
```

### Colors

```html
<!-- Background -->
<div class="bg-bg">
  <!-- #1a1a1a -->
  <div class="bg-bg2">
    <!-- #222222 -->
    <div class="bg-blue">
      <!-- #7aa2f7 -->

      <!-- Text -->
      <p class="text-text"><!-- #a9b1d6 --></p>
      <p class="text-text2"><!-- #787c99 --></p>
      <p class="text-green"><!-- #73daca --></p>
    </div>
  </div>
</div>
```

## Usage in Components

### Button Example

```jsx
<Button
  variant="primary"
  size="default"
  className="px-4 py-2 text-sm" // 4-based: 16px×8px, 12px font
>
  Click Me
</Button>
```

### Input Example

```jsx
<Input
  type="text"
  placeholder="Enter value"
  className="px-3 py-2 h-7 text-xs" // 4-based: 12px×8px padding, 28px height, 10px font
/>
```

### Panel Example

```jsx
<div className="p-6 space-y-4 rounded-lg border border-border bg-bg2">
  {/* 24px padding (6 units), 16px gaps (4 units) */}
</div>
```

### Layout Example

```jsx
<div className="flex gap-4 px-4 py-2">
  {/* 16px gap, 16px horizontal padding, 8px vertical padding */}
</div>
```

## Design Tokens File

All design tokens are documented in `src/lib/design-tokens.js`:

- **Spacing scale**: `4px` to `48px` (multiples of 4)
- **Typography**: Font sizes, weights, and line heights
- **Dimensions**: Border radius, heights, widths, icon sizes
- **Colors**: Full color palette with semantic meaning
- **Effects**: Shadows and transitions
- **Utility functions**: Helper functions for generating values

## Benefits

1. **Consistency**: All spacing is predictable and rhythmic
2. **Alignment**: 4-based grid ensures perfect pixel alignment
3. **Scalability**: Easy to adjust entire design by changing base unit
4. **Maintainability**: Single source of truth for all tokens
5. **Accessibility**: Consistent sizing improves usability
6. **Performance**: Standardized classes reduce CSS output

## Migration Notes

- **Old arbitrary values** like `text-[8.5px]` → **Standardized** `text-xs` (10px)
- **Custom padding** like `px-3.5 py-1.5` → **Scale-based** `px-4 py-2` (16px × 8px)
- **Inconsistent gaps** like `gap-1.5` → **Unified** `gap-1` or `gap-2` (4px or 8px)
- **Varying font sizes** → **Typography scale** (sm, base, lg, xl, etc.)

All components now use this standardized system for maximum consistency and maintainability.
