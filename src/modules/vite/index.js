module.exports = function (api) {
  // Buid reference project to avoid ts-loader error
  // error TS6305: Output file '*.d.ts' has not been built from source file '*.ts'.
  // https://blog.johnnyreilly.com/2018/09/23/ts-loader-project-references-first-blood/
  api.extendWebpack(conf => {
    conf
      .module
      .rules
      .find(rule => String(rule.test) === String(/\.ts$/))
      .use[0]
      .options
      .projectReferences = true
  })
}
