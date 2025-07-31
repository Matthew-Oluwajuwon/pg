import type { ThemeConfig } from "antd";

export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#313ef7",
  },
  components: {
    Button: {
      boxShadow: "none",
    },
    Input: {
      colorTextPlaceholder: "#00000050",
      colorTextLabel: "#ff0000",
      fontSize: 1,
    },
  },
};
