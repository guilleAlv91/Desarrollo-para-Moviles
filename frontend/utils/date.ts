export const getFormattedDate = (dateObject: Date = new Date()): string => {
    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    // const year = dateObject.getFullYear().toString().slice(-2);
    const year = dateObject.getFullYear().toString();
    return `${day}/${month}/${year}`;
};