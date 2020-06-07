/*
    Error codes
    * UE: User Exists
    * EE: Email Exists
    * PDM: Passwords Didn't Match
    * PML: Password Minlength
*/
const form = document.querySelector('form');
const email = document.querySelector('#email');
const username = document.querySelector('#username');
const pwd = document.querySelector('#password');
const cpwd = document.querySelector('#cpwd');
const errUE = document.querySelector('#err-msg-ue');
const errEE = document.querySelector('#err-msg-ee');
const errPDM = document.querySelector('#err-msg-pdm');
const errPML = document.querySelector('#err-msg-pml');

let errCodes = document.querySelector("#__c24_0ds_").innerHTML;
let timerID = null;

//
const msgErrUE = 'Este nombre de usuario ya existe, intente con uno distinto.';
const msgErrEE = 'Correo electr\u00F3nico ya est\u00E1 registrado, int\u00E9ntelo con uno diferente.';
const msgErrPDM = 'Las contrase\u00F1as no coinciden.';
const msgErrPML = 'La contrase\u00F1a debe tener un m\u00EDnimo de 6 d\u00EDgitos.'

const showErrs = (errCode) => {
    switch (errCode) {
        case '!u!':
            errUE.innerHTML = msgErrUE;
            username.classList.add('invalid');
            break;
        case '!e!':
            errEE.innerHTML = msgErrEE;
            email.classList.add('invalid');
            break;
        case '!pdm!':
            errPDM.innerHTML = msgErrPDM;
            cpwd.classList.add('invalid');
            break;
        case '!pml!':
            errPML.innerHTML = msgErrPML;
            pwd.classList.add('invalid');
            break;
    }
}

const formatErrCodes = ((errCodes) => {
    errCodes = errCodes.replace(/(\r\n|\n|\r)/gm, "").replace(/\u21b5/g, '');
    errCodes.substring(0, errCodes.length - 1);
    errCodes = errCodes.split(':');
    errCodes.pop();
    for (let i = 0; i < errCodes.length; i++) {
        errCodes[i] = errCodes[i].trim();
        showErrs(errCodes[i]);
    }
})(errCodes);

const emailChangeHandler = () => {
    if(0 > errEE.innerHTML.length){
        email.classList.remove('invalid');
        errEE.innerHTML = null;
    }

}

const usernameChangeHandler = () => {
    if(0 > errUE.innerHTML.length){
        username.classList.remove('invalid');
        errUE.innerHTML = null;
    }
}

const setPDM = (pdm) => {
    if(pdm){
        cpwd.classList.add('invalid');
        errPDM.innerHTML = msgErrPDM;
    }
    else{
        cpwd.classList.remove('invalid');
        errPDM.innerHTML = null;
    }
}

const validatePDM = (elem) => {
    const { value: val } = elem;
    switch(elem.id){
        case 'password':
            if(val !== cpwd.value 
                && val.length >= cpwd.value.length
                && cpwd.value.length > 0
            )
                setPDM(true);
            else
                setPDM(false);
            break;
        case 'cpwd':
            if(val !== pwd.value 
                && val.length >= pwd.value.length
                && pwd.value.length > 0
            )
                setPDM(true);
            else
                setPDM(false);
            break;
    }
}

const cpwdChangeHandler = () => {
    if(0 > errPDM.innerHTML.length) setPDM(false);
    validatePDM(cpwd);
}

const pwdChangeHandler = () => {
    if(0 > errPDM.innerHTML.length) setPDM(false);
    if(pwd.value.length >= 6) errPML.innerHTML = null;
    validatePDM(pwd)
}

const pwdBlurHandler = () => {
    if(pwd.value.length < 6){ 
        errPML.innerHTML = msgErrPML;
        pwd.classList.add('invalid');
    }
    else
        errPML.innerHTML = null;
        pwd.classList.remove('invalid');
}

// En esta función => data se refiere a username y email
const userDataVerification = async (elem, verifyUser, valid) => {
    try {
        const { id } = elem;
        let progressBar = document.querySelector(`.progress[role="alert[${id}]"]`);
        let verifyUserMsg = document.querySelector(`#verify-user-msg[role="alert[${id}]"]`);
        progressBar.classList.remove('hidden');
        elem.classList.remove('invalid', 'valid');
        verifyUser.classList.add('visible');
        verifyUserMsg.innerHTML = 'Verificando...';
        verifyUserMsg.style.color = '#2196F3';

        let body = (id === 'username' ? { username: elem.value } : { email: elem.value });
        const resp = await fetch('/user-exists',{
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        let { exists } = await resp.json();
        if(body.email !== undefined && !valid) exists = true;
        if(body.username !== undefined && !valid) exists = true;
        setTimeout(() => {
            progressBar.classList.add('hidden');

            let msg = `Este ${elem.ariaPlaceholder} no est\u00E1 disponible.`;
            if(id === 'email' && !valid) msg = msg.replace('.', ' o no es correcto.');
            if(id === 'username' && !valid) msg = 'Los nombres de usuario deben tener 3 o m\u00E1s d\u00EDgitos.'
            verifyUserMsg.innerHTML = (exists ? msg : msg.replace('no', ''));
            verifyUserMsg.style.color = (exists ? '#f32736' : '#4CAF50');
            elem.classList.add((exists ? 'invalid' : 'valid'));
        }, 550);
    } catch (error) {
        console.error(error);
    }
}

// En esta función => data se refiere a username y email
const userDataKeyupHandler = (e) => {
    // key: "Tab"
    // keyCode: 9
    let key = e.keyCode;
    const { target: elem } = e;
    if(key !== 9) clearTimeout(timerID);
    let verifyUser = document.querySelector(`.verify-user[role="alert[${elem.id}]"]`);
    if(elem.value){
        verifyUser.classList.remove('visible');
        timerID = setTimeout(() => { 
            if(elem.id === 'email'){
                // Validar email
                const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                userDataVerification(elem, verifyUser, regex.test(elem.value));
            }
            else{
                // Username debe tener mas de 3 caracteres
                userDataVerification(elem, verifyUser, (elem.value.length >= 3));
            }
        }, 600);
    }else{
        verifyUser.classList.remove('visible');
        elem.classList.remove('valid');
    }
}

// const observer = new MutationObserver((mutations) => {
//     mutations.forEach(m => {
//         if(m.attributeName === 'class'){
//             console.log(m);
//         }
//     })
// });

const formSubmitHandler = (e) => {
    e.preventDefault();
    const invalidFields = document.querySelectorAll('.invalid');
    if(undefined !== invalidFields 
        && invalidFields.length == 0
    ) { form.submit(); }
}

email.addEventListener('change', emailChangeHandler);
email.addEventListener('keyup', userDataKeyupHandler);
username.addEventListener('change', usernameChangeHandler);
username.addEventListener('keyup', userDataKeyupHandler);
cpwd.addEventListener('keyup', cpwdChangeHandler);
cpwd.addEventListener('blur', cpwdChangeHandler);
pwd.addEventListener('keyup', pwdChangeHandler);
pwd.addEventListener('blur', () => { pwdChangeHandler(); pwdBlurHandler(); });
form.addEventListener('submit', formSubmitHandler);
// document.querySelectorAll('input').forEach(i => observer.observe(i, { attributes: true }));