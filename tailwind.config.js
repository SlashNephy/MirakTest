module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === "production",
    mode: "all",
    content: [
      "./index.html",
      "./src/**/*.{ts,tsx,scss}",
      "./node_modules/react-multi-carousel/lib/styles.css",
    ],
    whitelist: [],
    whitelistPatterns: [],
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  darkMode: "media",
  plugins: [
    require("tailwindcss-textshadow"),
    require("@tailwindcss/custom-forms"),
    require("tailwind-scrollbar"),
  ],
  theme: {
    gradientColorStops: (theme) => ({
      ...theme("colors"),
      blackOpacity: "rgba(0, 0, 0, var(--tw-bg-opacity))",
    }),
    extend: {
      cursor: {
        none: "none",
      },
      animation: {
        "ping-once":
          "ping 1s cubic-bezier(0, 0, 0.2, 1), hidden 1s linear 1s infinite",
      },
      transitionProperty: {
        maxHeight: "max-height",
        width: "width",
      },
      keyframes: {
        hidden: {
          "0%, 100%": {
            opacity: 0,
          },
        },
      },
    },
  },
}
