const checkNewBook = async (book) => {
    const attributes = ['title', 'author', 'publication_year', 'pages', 'category_id', 'publisher_id'];
    for (const attribute of attributes) {
        if (book[attribute] == '') {
            throw new Error(`The field ${attribute} cannot be empty!`);
        }
    }
}