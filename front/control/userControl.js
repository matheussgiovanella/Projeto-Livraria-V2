const getUsers = async () => {
    const response = await axios.get(`${ENDPOINT}/users`);

    const users = response.data;
    return users;
}
const getUser = async (id) => {
    const response = await axios.get(`${ENDPOINT}/users/${id}`);
    const user = response.data;
    return user;
}

const addUser = async () => {
    const sign_up = document.querySelector('.sign_up-field');

    const name = sign_up.querySelector('#name').value;
    const sex = sign_up.querySelector('#sex').value;
    let age = sign_up.querySelector('#age').value;
    const email = sign_up.querySelector('#email').value;
    const password = sign_up.querySelector('#password').value;
    const confirmPassword = sign_up.querySelector('#confirmPassword').value;

    try {
        const newUser = {
            name: name,
            sex: sex,
            age: age,
            email: email,
            password: password
        }

        await checkNewUser(newUser, confirmPassword);

        axios.post(`${ENDPOINT}/users`, newUser)
            .then((response) => {
                const log = `User ${name} created!`;
                popUp(log);
                loadTable();
            }, (error) => {
                popUp(`Error to create user: `, `${error.response.data.error}`);
            })

    } catch (error) {
        popUp('Error: ', error);
    }
}

const loadTable = async () => {
    const users = await getUsers();
    let trHTML = '';
    users.forEach(user => {
        trHTML += `<tr>`;
        trHTML += `<td>${user.id}</td>`;
        trHTML += `<td>${user.name}</td>`;
        trHTML += `<td>${user.sex}</td>`;
        trHTML += `<td>${user.age}</td>`;
        trHTML += `<td>${user.email}</td>`;
        trHTML += `<td class="buttons"><button class="edit" onclick="confirmUserForm('${user.id}', 'Edit')"><i class="fa-solid fa-pencil fa-1x"></i></button>`;
        trHTML += `<button class="delete" onclick="confirmUserForm('${user.id}', 'Del')"><i class="fa-solid fa-trash-can fa-1x"></i></button></td>`;
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
const confirmUserForm = async (id, action) => {
    if (action == 'Del') {
        action = 'Delete';
    }
    const user = await getUser(id);
    Swal.fire({
        title: `${action} ${user.email}`,
        html:
            `<input id="password" class="swal2-input" placeholder="password" />`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            const swal = document.querySelector('.swal2-container');
            const password = swal.querySelector('#password').value;

            if (await encryptPassword(password) === user.password) {
                if (action == 'Edit') {
                    editUserForm(id, password);
                } else if (action == 'Delete') {
                    deleteUser(id);
                }
            } else {
                popUp('Wrong password!');
            }
        }
    });
}
const editUserForm = async (id, password) => {
    const user = await getUser(id);
    Swal.fire({
        title: `Edit ${user.email}`,
        html:
            `<input id="id" type="hidden" value=${user.id}>` +
            `<input id="name" class="swal2-input" maxlength="45" placeholder="Name" value="${user.name}">` +
            `<input id="sex" class="swal2-input" maxlength="45" placeholder="Sex" value="${user.sex}">` +
            `<input id="age" class="swal2-input" maxlength="3" placeholder="Age" value="${user.age}">` +
            `<input id="email" class="swal2-input" maxlength="45" placeholder="Email" value="${user.email}">` +
            `<input id="password" class="swal2-input" maxlength="45" placeholder="Password" value="${password}">` +
            `<input id="confirmPassword" class="swal2-input" maxlength="45" placeholder="Confirm Password">`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            await updateUser(id);
        }
    });
}
const updateUser = async (id) => {
    const swal = document.querySelector('.swal2-container');

    const name = swal.querySelector('#name').value;
    const sex = swal.querySelector('#sex').value;
    let age = swal.querySelector('#age').value;
    const email = swal.querySelector('#email').value;
    const password = swal.querySelector('#password').value;
    const confirmPassword = swal.querySelector('#confirmPassword').value;

    try {
        await checkPassword(password, confirmPassword);
        age = await checkAge(age);
        const user = await getUser(id);
        const User = {
            name: name,
            sex: sex,
            age: age,
            email: email,
            password: await encryptPassword(password)
        }

        axios.put(`${ENDPOINT}/users/${id}`, User)
            .then((response) => {
                const log = `User ${user.name} updated! -> ${name}`
                popUp(log);
                loadTable();
            }, (error) => {
                popUp(`Error to update user: ${error.response.data.error}`);
            })

    } catch (error) {
        popUp(error);
    }
}
const deleteUser = async (id) => {
    const user = await getUser(id);
    await axios.delete(`${ENDPOINT}/users/${id}`);
    const log = `User ${user.email} has been deleted!`;
    popUp(log);
    loadTable();
}
const encryptPassword = async (password) => {
    const encryptedPassword = md5(password);
    return encryptedPassword;
}