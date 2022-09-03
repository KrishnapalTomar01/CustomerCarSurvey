export const getLocalStorageValue = (key) => {
    return JSON.parse(localStorage.getItem(key));
};
const setItemToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};
export const setItemInLocalStorageArray = (key, value) => {
    var itemArray = getLocalStorageValue(key);
    if (!itemArray)
        setItemToLocalStorage(key, [value]);
    else {
        itemArray.push(value);
        setItemToLocalStorage(key, itemArray);
    }
};
//# sourceMappingURL=localStorageHelper.js.map