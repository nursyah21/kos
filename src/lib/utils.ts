export const formatCurrency = (value:string) => {
    if (!value) return '';
    
    const numericValue = value.replace(/,/g, '');
    // @ts-ignore
    if (isNaN(numericValue) || numericValue.trim() === '') return value;

    return Number(numericValue).toLocaleString('en-US');
};

export const $ = (id:string) => document.querySelector(id)
