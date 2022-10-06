const getStates = async () => {
    const response = await axios.get(`${ENDPOINT}/states`);

    const states = response.data;
    return states;
}
const getState = async (id) => {
    const response = await axios.get(`${ENDPOINT}/states/${id}`);
    const state = response.data;
    return state;
}

const addState = async () => {
    const create = document.querySelector('.create-field');

    const name = create.querySelector('#name').value;
    const province = create.querySelector('#province').value.toUpperCase();

    try {
        const newState = {
            name: name,
            province: province
        }

        await checkNewState(newState);

        axios.post(`${ENDPOINT}/states`, newState)
            .then((response) => {
                const log = `State ${name} created!`
                popUp(log);
                loadTable();
            }, (error) => {
                popUp(`Error to create state: `, `${error.response.data.error}`);
            });

    } catch (error) {
        popUp('Error: ', error);
    }
}

const loadTable = async () => {
    const states = await getStates();
    let trHTML = '';
    states.forEach(state => {
        trHTML += `<tr>`;
        trHTML += `<td>${state.id}</td>`;
        trHTML += `<td>${state.name}</td>`;
        trHTML += `<td>${state.province}</td>`;
        trHTML += `<td class="buttons"><button class="edit" onclick="editStateForm('${state.id}')"><i class="fa-solid fa-pencil fa-1x"></i></button>`;
        trHTML += `<button class="delete" onclick="confirmStateForm('${state.id}')"><i class="fa-solid fa-trash-can fa-1x"></i></button></td>`;
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
const confirmStateForm = async (id) => {
    const state = await getState(id);
    Swal.fire({
        title: `Are you sure you want to delete: ${state.name}`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            deleteState(id);
        }
    });
}
const editStateForm = async (id) => {
    const state = await getState(id);
    Swal.fire({
        title: `Edit ${state.name}`,
        html:
            `<input id="id" type="hidden" value=${state.id}>` +
            `<input id="name" class="swal2-input" maxlength="45" placeholder="Name" value="${state.name}">` +
            `<input id="province" class="swal2-input" style="text-transform: uppercase" maxlength="2" placeholder="Province" value="${state.province}">`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            await updateState(id);
        }
    });
}
const updateState = async (id) => {
    const swal = document.querySelector('.swal2-container');

    const name = swal.querySelector('#name').value;
    const province = swal.querySelector('#province').value.toUpperCase();

    try {
        const state = await getState(id);
        const State = {
            name: name,
            province: province
        }

        axios.put(`${ENDPOINT}/states/${id}`, State)
            .then((response) => {
                const log = `State ${state.name} updated! -> ${name}`;
                popUp(log);
                loadTable();
            }, (error) => {
                popUp(`Error to update state: ${error.response.data.error}`);
            })

    } catch (error) {
        popUp(error);
    }
}

const deleteState = async (id) => {
    const state = await getState(id);
    await axios.delete(`${ENDPOINT}/states/${id}`);
    const log = `State ${state.name} has been deleted!`;
    popUp(log);
    loadTable();
}