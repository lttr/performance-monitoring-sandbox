module.exports = {
  ci: {
    collect: {
      url: [`${process.env.LHCI_TARGET_URL}/?mobile`],
      settings: {
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
