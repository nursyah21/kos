export const formatCurrency = (value) => {
    if (!value) return '';
    
    const numericValue = value.replace(/,/g, '');
    if (isNaN(numericValue) || numericValue.trim() === '') return value;

    return Number(numericValue).toLocaleString('en-US');
};

export const $ = (id:string) => document.getElementById(id)
