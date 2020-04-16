declare var document: any;

export const stripHtml = (value: any) => {
    const div = document.createElement('div');
    div.innerHTML = value;
    const text = div.textContent || div.innerText || '';
    return text;
};
