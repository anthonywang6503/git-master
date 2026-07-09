import jQuery from 'jquery';

const getType = value => {
  if (value === null || value === undefined) return String(value);

  return Object.prototype.toString
    .call(value)
    .slice(8, -1)
    .toLowerCase();
};

if (!jQuery.support) {
  jQuery.support = {};
}

if (!jQuery.trim) {
  jQuery.trim = value => (value === null || value === undefined ? '' : String(value).trim());
}

if (!jQuery.isFunction) {
  jQuery.isFunction = value => typeof value === 'function';
}

if (!jQuery.isArray) {
  jQuery.isArray = Array.isArray;
}

if (!jQuery.type) {
  jQuery.type = getType;
}

if (!jQuery.isNumeric) {
  jQuery.isNumeric = value => !Array.isArray(value) && value - parseFloat(value) + 1 >= 0;
}

if (!jQuery.parseJSON) {
  jQuery.parseJSON = JSON.parse;
}

if (!jQuery.nodeName) {
  jQuery.nodeName = (element, name) => element && element.nodeName && element.nodeName.toLowerCase() === name.toLowerCase();
}

if (!jQuery.camelCase) {
  jQuery.camelCase = value =>
    String(value)
      .replace(/^-ms-/, 'ms-')
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

if (!jQuery._data) {
  jQuery._data = () => undefined;
}

export default jQuery;
