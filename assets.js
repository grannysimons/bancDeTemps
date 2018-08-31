module.exports = {
  extend : (obj, src) => {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
  }
};

// example
// var a = { foo: true }, b = { bar: false };
// var c = extend(a, b);

// console.log(c);