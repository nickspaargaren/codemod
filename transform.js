module.exports = function (file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.VariableDeclaration)
    .forEach((path) => {
      const { node } = path;

      if (node.declarations.some((decl) => decl.id.typeAnnotation)) {
        const declarationType =
          node.declarations[0].id.typeAnnotation.typeAnnotation.type;

        if (
          declarationType === "TSStringKeyword" ||
          declarationType === "TSNumberKeyword" ||
          declarationType === "TSBooleanKeyword" ||
          declarationType === "TSAnyKeyword"
        ) {
          const variableName = node.declarations[0].id.name;
          const variableType = declarationType.substring(2).toLowerCase();

          const jsDoc = j.commentBlock(`*
  * @type {${variableType}}
  */`);
          node.comments = [jsDoc];
          node.declarations[0].typeAnnotation = null;
        }
      }
    })
    .toSource();
};