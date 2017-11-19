/**
 * @module bullets
 * @since 1.0.0
 * List an array as a bullet list
 * @param  {Array} items
 * @return {String}
 */
module.exports = items => items.map(item => `• ${item.replace(/\..*/, '')}`).join('\n');
