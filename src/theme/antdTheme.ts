import type { ThemeConfig } from 'antd';
import { colors, borderRadius, typography } from './index';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.accent,
    colorPrimaryHover: colors.accentHover,
    colorBgContainer: colors.white,
    colorBgLayout: colors.sandLight,
    colorText: colors.black,
    colorTextSecondary: colors.gray700,
    colorBorder: colors.gray100,
    borderRadius: borderRadius.md,
    fontFamily: typography.fontFamily.body,
    fontSize: 14,
  },
  components: {
    Button: {
      primaryShadow: 'none',
      controlHeight: 44,
      borderRadiusLG: borderRadius.lg,
      fontWeight: typography.fontWeight.medium,
    },
    Input: {
      controlHeight: 44,
      borderRadius: borderRadius.sm,
    },
    Card: {
      borderRadiusLG: borderRadius.lg,
      boxShadowTertiary: '0 4px 12px rgba(13, 13, 13, 0.08)',
    },
    Menu: {
      itemBorderRadius: borderRadius.sm,
      itemSelectedBg: colors.sandBeige,
    },
    Table: {
      borderRadius: borderRadius.md,
    },
  },
};
