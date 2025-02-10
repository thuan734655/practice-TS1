const getDataLocalStorage = (key: string): string | null => {
    const dataJson = localStorage.getItem(key); 
    const dataRes = dataJson ? JSON.parse(dataJson) : null;
    return dataRes;
}

const setDataLocalStorage = (key: string, data: any): void => {
    localStorage.setItem(key, JSON.stringify(data));
}

export { getDataLocalStorage, setDataLocalStorage}
