export default {
    checkIfElementExist(element) {
        return typeof element !== typeof undefined && element !== null;
    },
    isObject(o) {
        return typeof o === 'object' && o !== null && o.constructor && o.constructor === Object;
    },
    extend(...args) {
        const self = this;
        const to = Object(args[0]);
        for (let i = 1; i < args.length; i += 1) {
            const nextSource = args[i];
            if (nextSource !== undefined && nextSource !== null) {
                const keysArray = Object.keys(Object(nextSource));
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                    const nextKey = keysArray[nextIndex];
                    const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        if (self.isObject(to[nextKey]) && self.isObject(nextSource[nextKey])) {
                            self.extend(to[nextKey], nextSource[nextKey]);
                        } else if (!self.isObject(to[nextKey]) && self.isObject(nextSource[nextKey])) {
                            to[nextKey] = {};
                            self.extend(to[nextKey], nextSource[nextKey]);
                        } else {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
        }
        return to;
    },
    checkIfElementIsHover(element) {
        return element.querySelector(':hover') || element.parentNode.querySelector(':hover') === element;
    },
    checkIfElementIsFocus(element) {
        return element.querySelector(':focus') || element.parentNode.querySelector(':focus') === element;
    }
};

