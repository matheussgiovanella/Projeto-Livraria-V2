const checkNewState = async (state) => {
    const attributes = ['name', 'province'];
    for (const attribute of attributes) {
        if (state[attribute] == '') {
            throw new Error(`The field ${attribute} cannot be empty!`);
        }
    }
}