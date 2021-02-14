const isTypeOfStatement = (node) => node.type === 'Identifier' ||
(node.type === 'UnaryExpression' && node.operator === 'typeof');
const SHOULD_USE_ISUNDEFINED = 'You should not use directly the "undefined" keyword. Prefer isUndefined method from lodash.';

/**
* Determines if the argument is a literal boolean, or an Array containing a literal boolean
* @param  {Object}  argument [description]
* @returns {boolean}          `true` is a literal boolean value, or an array containing a literal boolean value
*/
function isBooleanArgument(argument) {
// when used with Function.prototype.apply
	if (argument.type === 'ArrayExpression') {
		return argument.elements.some(isBooleanArgument);
	}

	return argument.type === 'Literal' && typeof argument.value === 'boolean';
}

module.exports = {
	'no-array-instanceof': {
		meta: {
			docs: {
				description: 'disallow \'instanceof\' for Array',
				category: 'Best Practices'
			},
			fixable: true,
			schema: []
		},

		create(context) {
			const sourceCode = context.getSourceCode();

			/**
     * Checks whether the given node is RHS of instanceof.
     *
     * @param {ASTNode} node - The node to check.
     * @returns {boolean} `true` if the node is RHS of instanceof.
     */
			function isRhsOfInstanceof(node) {
				return (
					node.parent.type === 'BinaryExpression' &&
        node.parent.operator === 'instanceof' &&
        node.parent.right === node
				);
			}

			return {
				'Program:exit': function() {
					const globalScope = context.getScope();
					const variable = globalScope.set.get('Array');

					// Skip if undefined or shadowed
					if (variable === null || variable.defs.length > 0) {
						return;
					}

					for (const reference of variable.references) {
						const id = reference.identifier;
						const node = id.parent;

						// Skip if it's not instanceof
						if (!isRhsOfInstanceof(id)) {
							// eslint-disable-next-line no-continue
							continue;
						}

						// Report
						context.report({
							node,
							loc: node.loc,
							message: 'Unexpected \'instanceof\' operator. Use \'Array.isArray\' instead.',
							fix: (fixer) => fixer.replaceText(
								node,
								`Array.isArray(${sourceCode.getText(node.left)})`
							)
						});
					}
				}
			};
		}
	},
	'custom-logs': {
		meta: {
			docs: {
				description: 'disallow direct console.x usage',
				category: 'Possible Errors',
				recommended: true
			},
			schema: []
		},
		create(context) {
			const method = ['log', 'debug', 'error', 'info', 'warn', 'dir', 'trace'];

			return {
				MemberExpression(node) {
					if (node.object.name === 'console' && method.indexOf(node.property.name) >= 0) {
						context.report(node, `You should use the "${node.property.name}" method of the console object`);
					}
				}
			};
		}
	},
	definedundefined: {
		meta: {
			docs: {
				description: 'disallow the direct usage of undefined',
				category: 'Possible Errors',
				recommended: true
			},
			schema: [],
			fixable: 'code'
		},
		create(context) {
			const isCompareOperator = (operator) => operator === '===' || operator === '!==' || operator === '==' || operator === '!=';
			const reportError = (node, message, fix) => {
				context.report({
					node,
					message,
					fix
				});
			};

			return {
				BinaryExpression(node) {
					if (isCompareOperator(node.operator)) {
						if (isTypeOfStatement(node.left) && node.right.value === 'undefined') {
							reportError(node, SHOULD_USE_ISUNDEFINED);
						} else if (isTypeOfStatement(node.right) && node.left.value === 'undefined') {
							reportError(node, SHOULD_USE_ISUNDEFINED);
						} else if (node.left.type === 'Identifier' && node.left.name === 'undefined') {
							reportError(node, SHOULD_USE_ISUNDEFINED);
						} else if (node.right.type === 'Identifier' && node.right.name === 'undefined') {
							reportError(node, SHOULD_USE_ISUNDEFINED);
						}
					}
				}
			};
		}
	},
	'no-boolean-trap': {
		meta: {
			docs: {
				description: 'disallow boolean traps',
				category: 'Best Practices',
				recommended: false
			},
			schema: []
		},
		create(context) {
			return {
				CallExpression: (node) => {
					const badArguments = node.arguments.filter(isBooleanArgument);

					badArguments.forEach((argument) => {
						context.report({
							node,
							loc: argument.loc,
							message: 'Unexpected boolean trap'
						});
					});
				}
			};
		}
	}
};
