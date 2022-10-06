const getCategories = async () => {
    const response = await axios.get(`${ENDPOINT}/categories`);

    const categories = response.data;
    return categories;
}
const getCategory = async (id) => {
    const response = await axios.get(`${ENDPOINT}/categories/${id}`);
    const category = response.data;
    return category;
}

const addCategory = async () => {
    const create = document.querySelector('.create-field');

    const description = create.querySelector('#description').value;
    
    try {
        const newCategory = {
            description: description
        }

        await checkNewCategory(newCategory);

        axios.post(`${ENDPOINT}/categories`, newCategory)
            .then((response) => {
                const log = `Category ${description} created!`;
                popUp(log);
                loadTable();
            }, (error) => {
                popUp(`Error to create category: `, `${error.response.data.error}`);
            })

    } catch (error) {
        popUp('Error: ', error);
    }
}

const loadTable = async () => {
    const categories = await getCategories();
    let trHTML = '';
    categories.forEach(category => {
        trHTML += `<tr>`;
        trHTML += `<td>${category.id}</td>`;
        trHTML += `<td>${category.description}</td>`;
        trHTML += `<td class="buttons"><button class="edit" onclick="editCategoryForm('${category.id}')"><i class="fa-solid fa-pencil fa-1x"></i></button>`;
        trHTML += `<button class="delete" onclick="confirmCategoryForm('${category.id}')"><i class="fa-solid fa-trash-can fa-1x"></i></button></td>`;
        trHTML += `</tr>`;
    });
    document.getElementById("mytable").innerHTML = trHTML;
}

loadTable();

const popUp = async (title, message) => {
    Swal.fire({
        title: title,
        text: message
    });
}
const confirmCategoryForm = async (id) => {
    const category = await getCategory(id);
    Swal.fire({
        title: `Are you sure you want to delete: ${category.description}`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            deleteCategory(id);
        }
    });
}
const editCategoryForm = async (id) => {
    const category = await getCategory(id);
    Swal.fire({
        title: `Edit ${category.description}`,
        html:
            `<input id="id" type="hidden" value=${category.id}>` +
            `<input id="description" class="swal2-input" maxlength="45" placeholder="Description" value="${category.description}">`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            await updateCategory(id);
        }
    });
}
const updateCategory = async (id) => {
    const swal = document.querySelector('.swal2-container');

    const description = swal.querySelector('#description').value;

    try {
        
        const Category = {
            description: description
        }

        axios.put(`${ENDPOINT}/categories/${id}`, Category)
            .then((response) => {
                const log = `Category ${description} updated!`;
                popUp(log);
                loadTable();
            }, (error) => {
                popUp(`Error to update category: ${error.response.data.error}`);
            })

    } catch (error) {
        popUp(error);
    }
}

const deleteCategory = async (id) => {
    const category = await getCategory(id);
    await axios.delete(`${ENDPOINT}/categories/${id}`);
    const log = `Category ${category.description} has been deleted!`;
    popUp(log);
    loadTable();
}