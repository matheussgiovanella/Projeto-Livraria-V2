const checkNewFormat = async (format) => {
    const attributes = ['description'];
    for (const attribute of attributes) {
        if (format[attribute] == '') {
            throw new Error(`The field ${attribute} cannot be empty!`);
        }
    }
}