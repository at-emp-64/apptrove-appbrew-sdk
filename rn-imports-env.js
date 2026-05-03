// babel.plugins/rn-import-meta-env.js
module.exports = function rnImportMetaEnv({ types: t }) {
  return {
    name: 'rn-import-meta-env',
    visitor: {
      // Handles `import.meta.env`
      MemberExpression(path, state) {
        if (
          t.isMetaProperty(path.node.object) &&
          path.node.object.property.name === 'meta' &&
          t.isIdentifier(path.node.property, { name: 'env' })
        ) {
          const env = state.opts.env || {};
          path.replaceWith(t.valueToNode(env));
        }
      },
      // Handles optional chaining: `import.meta?.env`
      OptionalMemberExpression(path, state) {
        const obj = path.node.object;
        if (
          t.isMetaProperty(obj) &&
          obj.property.name === 'meta' &&
          t.isIdentifier(path.node.property, { name: 'env' })
        ) {
          const env = state.opts.env || {};
          path.replaceWith(t.valueToNode(env));
        }
      },
    },
  };
};
