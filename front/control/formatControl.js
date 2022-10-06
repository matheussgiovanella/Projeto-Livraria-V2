const getFormats = async () => {
    const response = await axios.get(`${ENDPOINT}/formats`);

    const formats = response.data;
    return formats;
}
const getFormat = async (id) => {
    const response = await axios.get(`${ENDPOINT}/formats/${id}`);
    const formats = response.data;
    return formats;
}

const addFormat = async () => {
    const create = document.querySelector('.create-field');

    const description = create.querySelector('#description').value;
    
    try {
        const newFormat = {
            description: description
        }

        await checkNewFormat(newFormat);

        axios.post(`${ENDPOINT}/formats`, newFormat)
            .then((response) => {
                const log = `Format ${description} created!`;
                popUp(log);
                loadTable();
            }, (error) => {
                popUp(`Error to create format: `, `${error.response.data.error}`);
            })

    } catch (error) {
        popUp('Error: ', error);
    }
}

const loadTable = async () => {
    const formats = await getFormats();
    let trHTML = '';
    formats.forEach(format => {
        trHTML += `<tr>`;
        trHTML += `<td>${format.id}</td>`;
        trHTML += `<td>${format.description}</td>`;
        trHTML += `<td class="buttons"><button class="edit" onclick="editFormatForm('${format.id}')"><i class="fa-solid fa-pencil fa-1x"></i></button>`;
        trHTML += `<button class="delete" onclick="confirmFormatForm('${format.id}')"><i class="fa-solid fa-trash-can fa-1x"></i></button></td>`;
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
const confirmFormatForm = async (id) => {
    const format = await getFormat(id);
    Swal.fire({
        title: `Are you sure you want to delete: ${format.description}`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            deleteFormat(id);
        }
    });
}
const editFormatForm = async (id) => {
    const format = await getFormat(id);
    Swal.fire({
        title: `Edit ${format.description}`,
        html:
            `<input id="id" type="hidden" value=${format.id}>` +
            `<input id="description" class="swal2-input" maxlength="45" placeholder="Description" value="${format.description}">`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            await updateFormat(id);
        }
    });
}
const updateFormat = async (id) => {
    const swal = document.querySelector('.swal2-container');

    const description = swal.querySelector('#description').value;

    try {
        
        const Format = {
            description: description
        }

        axios.put(`${ENDPOINT}/formats/${id}`, Format)
            .then((response) => {
                const log = `Format ${description} updated!`;
                popUp(log);
                loadTable();
            }, (error) => {
                popUp(`Error to update format: ${error.response.data.error}`);
            })

    } catch (error) {
        popUp(error);
    }
}

const deleteFormat = async (id) => {
    const format = await getFormat(id);
    await axios.delete(`${ENDPOINT}/formats/${id}`);
    const log = `Format ${format.description} has been deleted!`;
    popUp(log);
    loadTable();
}