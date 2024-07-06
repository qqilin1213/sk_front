import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss';

export default defineConfig({
  exclude: ['node_modules', '.git', '.github', '.husky', '.vscode', 'build', 'dist', 'mock', 'public', './stats.html'],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup(), transformerCompileClass()],
  shortcuts: [],
  rules: [
    // 自定义选中状态样式
    ['selected_task', {
      'border': '4px solid yellow',
      'animation': 'blink 1s infinite'
    }],
  ],
  theme: {
    extend: {
      // 定义闪烁动画
      keyframes: {
        blink: {
          '0%': { opacity: 1 },
          '50%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
    colors: {
      primary: 'var(--primary-color)',
      primary_hover: 'var(--primary-color-hover)',
      primary_pressed: 'var(--primary-color-pressed)',
      primary_active: 'var(--primary-color-active)',
      info: 'var(--info-color)',
      info_hover: 'var(--info-color-hover)',
      info_pressed: 'var(--info-color-pressed)',
      info_active: 'var(--info-color-active)',
      success: 'var(--success-color)',
      success_hover: 'var(--success-color-hover)',
      success_pressed: 'var(--success-color-pressed)',
      success_active: 'var(--success-color-active)',
      warning: 'var(--warning-color)',
      warning_hover: 'var(--warning-color-hover)',
      warning_pressed: 'var(--warning-color-pressed)',
      warning_active: 'var(--warning-color-active)',
      error: 'var(--error-color)',
      error_hover: 'var(--error-color-hover)',
      error_pressed: 'var(--error-color-pressed)',
      error_active: 'var(--error-color-active)',
      splatoon: {
        blue: '#603bff',
        purple: '#af50ff',
        yellow: '#eaff3d',
        green: '#6af7ce',
        orange: '#ff9750',
        red: '#ff505e',
        brown: '#7f413f',
        battle: {
          regular: '#19d719',
          ranked: '#f54910',
          xmatch: '#0fdb9b',
          league: '#f02d7d',
        },
        salmonRun: '#ff5600',
        bigRun: '#b322ff',
        eggstraWork: '#be8800',
      },
    },
    fontFamily: {
      splatoon1: 'var(--font-family-s1)',
      splatoon2: 'var(--font-family-s2)',
      splatfont1: 'var(--font-family-sf1)',
      splatfont2: 'var(--font-family-sf2)',
    },
    dropShadow: {
      ruleIcon: '1px 1px 0 rgb(0,0,0)',
    },
  },
});
