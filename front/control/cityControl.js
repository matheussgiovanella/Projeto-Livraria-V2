const getCities = async () => {
    const response = await axios.get(`${ENDPOINT}/cities`);

    const cities = response.data;
    return cities;
}
const getCity = async (id) => {
    const response = await axios.get(`${ENDPOINT}/cities/${id}`);
    const city = response.data;
    return city;
}

const addCity = async () => {
    const create = document.querySelector('.create-field');

    const name = create.querySelector('#name').value;
    const cep = create.querySelector('#cep').value;
    const state = create.querySelector('#state').value;
    if (state != 0) {
        const provinces = await axios.get(`${ENDPOINT}/states`);
        try {
            const newCity = {
                name: name,
                cep: cep,
                state_id: state
            }

            await checkNewCity(newCity);

            axios.post(`${ENDPOINT}/cities`, newCity)
                .then((response) => {
                    for (const province of provinces.data) {
                        if (province.id == state) {
                            const log = `City ${name}/${province.province} created!`;
                            popUp(log);
                            loadTable();
                        }
                    }
                }, (error) => {
                    popUp(`Error to create city: `, `${error.response.data.error}`);
                })
        } catch (error) {
            popUp('Error: ', error);
        }
    } else {
        popUp('Error: you must choose a state!');
    }
}

const loadTable = async () => {
    const cities = await getCities();
    let trHTML = '';
    cities.forEach(city => {
        const state = city.State;
        trHTML += `<tr>`;
        trHTML += `<td>${city.id}</td>`;
        trHTML += `<td>${city.name}</td>`;
        trHTML += `<td>${city.cep}</td>`;
        trHTML += `<td>${state.name}</td>`;
        trHTML += `<td class="buttons"><button class="edit" onclick="editCityForm('${city.id}')"><i class="fa-solid fa-pencil fa-1x"></i></button>`;
        trHTML += `<button class="delete" onclick="confirmCityForm('${city.id}')"><i class="fa-solid fa-trash-can fa-1x"></i></button></td>`;
        trHTML += `</tr>`;
    });
    document.getElementById("mytable").innerHTML = trHTML;
}

loadTable();

const getStates = async (id) => {
    let response;
    if (id) {
        response = await axios.get(`${ENDPOINT}/states?exclude=${id}`);
    } else {
        response = await axios.get(`${ENDPOINT}/states`);
    }
    const states = response.data;
    let optionHTML = ``;
    for (const state of states) {
        optionHTML += `<option value="${state.id}">${state.name} - ${state.province}</option>`
    }
    return optionHTML;
}
const loadStates = async () => {
    const create = document.querySelector('.create-field')
    const optionHTML = await getStates();

    create.querySelector('#state').innerHTML += optionHTML;
}
loadStates();

const popUp = async (title, message) => {
    Swal.fire({
        title: title,
        text: message
    });
}
const confirmCityForm = async (id) => {
    const city = await getCity(id);
    Swal.fire({
        title: `Are you sure you want to delete: ${city.name}`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            deleteCity(id);
        }
    });
}
const editCityForm = async (id) => {
    const city = await getCity(id);
    const state = city.State;
    const state_id = city.state_id;
    const optionHTML = await getStates(state_id);
    Swal.fire({
        title: `Edit ${city.name}`,
        html:
            `<input id="id" type="hidden" value=${city.id}>` +
            `<input id="name" class="swal2-input" maxlength="45" placeholder="Name" value="${city.name}">` +
            `<input id="cep" class="swal2-input" maxlength="9" placeholder="CEP" value="${city.cep}">` +
            `<select class="swal2-input" id="state"><option value="${state.id}" selected>${state.name} - ${state.province}</option>${optionHTML}</select>`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            await updateCity(id);
        }
    });
}
const updateCity = async (id) => {
    const swal = document.querySelector('.swal2-container');

    const name = swal.querySelector('#name').value;
    const state = swal.querySelector('#state').value;
    const cep = swal.querySelector('#cep').value;

    try {
        const provinces = await axios.get(`${ENDPOINT}/states`);
        const city = await getCity(id);
        const City = {
            name: name,
            cep: cep,
            state_id: state
        }

        axios.put(`${ENDPOINT}/cities/${id}`, City)
            .then((response) => {
                let log = ``;
                for (const province of provinces.data) {
                    if (province.id == city.state_id) {
                        log += `City ${city.name}/${province.province} updated!`;
                    }
                    if (province.id == state) {
                        log += ` -> ${name}/${province.province}`;
                    }
                }
                popUp(log);
                loadTable();
            }, (error) => {
                popUp(`Error to update state: ${error.response.data.error}`);
            })

    } catch (error) {
        popUp(error);
    }
}
const deleteCity = async (id) => {
    const city = await getCity(id);
    await axios.delete(`${ENDPOINT}/cities/${id}`);
    const log = `City ${city.name} has been deleted!`
    popUp(log);
    loadTable();
}