const checkNewPublisher = async (publisher) => {
    const attributes = ['name', 'city_id'];
    for (const attribute of attributes) {
        if (publisher[attribute] == '') {
            throw new Error(`The field ${attribute} cannot be empty!`);
        }
    }
}