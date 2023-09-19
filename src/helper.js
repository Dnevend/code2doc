const deepFlatten = (arr) => {
    return arr.reduce((acc, val) => {
        if (Array.isArray(val)) {
            return acc.concat(deepFlatten(val));
        } else {
            return acc.concat(val);
        }
    }, []);
}

module.exports.deepFlatten = deepFlatten