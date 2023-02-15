const getNestedObject = (nestedObj, pathArr) => {
    return pathArr.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}

const getRandomFloatBetween = (min, max) => {
    return Math.random() * (max - min) + min;
  }

module.exports.getNestedObject = getNestedObject;
module.exports.getRandomFloatBetween = getRandomFloatBetween;