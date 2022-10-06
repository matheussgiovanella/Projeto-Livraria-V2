const checkNewCategory = async (category) => {
    const attributes = ['description'];
    for (const attribute of attributes) {
        if (category[attribute] == '') {
            throw new Error(`The field ${attribute} cannot be empty!`);
        }
    }
}