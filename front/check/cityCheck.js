const checkNewCity = async (city) => {
    const attributes = ['name', 'state_id', 'cep'];
    for (const attribute of attributes) {
        if (city[attribute] == '') {
            throw new Error(`The field ${attribute} cannot be empty!`);
        }
    }
}