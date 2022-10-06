const checkUser = async () => {
    const sign_in = document.querySelector('.sign_in-field');
    const email = sign_in.querySelector('#email').value;
    let password = sign_in.querySelector('#password').value;
    if (email === '') {
        popUp(`Email cannot be empty!`);
    } else if (password === '') {
        popUp(`Password cannot be empty!`);
    } else {
        try {
            password = await encryptPassword(password);

            const Login = {
                login: true,
                email: email,
                password: password
            }
            
            response = await axios.post(`${ENDPOINT}/users`, Login);
    
            const user = response.data;
            if (user.length !== 0) {
                window.location.href = './html/menu.html';
            } else {
                popUp(`Invalid email or password!`);
            }
        } catch (error) {
            popUp('Error: ', error);
        }
    }
}

const checkNewUser = async (user, confirmPassword) => {
    const attributes = ['name', 'sex', 'age', 'email', 'password'];
    for (const attribute of attributes) {
        if (user[attribute] == '') {
            throw new Error(`The field ${attribute} cannot be empty!`);
        }
        if (attribute == 'age') {
            user[attribute] = await checkAge(user[attribute]);
        }
        if (attribute == 'password') {
            await checkPassword(user[attribute], confirmPassword);
            user[attribute] = await encryptPassword(user[attribute]);
        }
    }
}
const checkAge = async (ageData) => {
    age = Number(ageData);
    if (Number.isNaN(age)) {
        throw new Error(`'${ageData}' is not a number!`);
    }
    if (age < 1 || age > 120) {
        throw new Error(`'${ageData}' is an invalid age!`);
    }
    return age.toFixed();
}
const checkPassword = async (password, confirmPassword) => {
    if (password !== confirmPassword) {
        throw new Error(`The passwords are different!`);
    }
}