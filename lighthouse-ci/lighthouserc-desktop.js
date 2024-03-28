module.exports = {
  ci: {
    collect: {
      url: [`${process.env.LHCI_TARGET_URL}/?desktop`],
      settings: {
        preset: "desktop",
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
      },
    },
  },
};
