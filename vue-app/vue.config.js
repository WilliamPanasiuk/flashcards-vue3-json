module.exports = {
  configureWebpack: {
      devtool: 'source-map',
    },
  css: {
    loaderOptions: {
      sass: {
          prependData: `
          @import "@/assets/scss/main.scss";
        `
      }
    }
  }
};