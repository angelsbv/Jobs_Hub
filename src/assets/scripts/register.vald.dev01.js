/*
UE: User Exists
EE: Email Exists
PDM: Passwords Didn't Match
*/
const email = document.querySelector('#email');
const username = document.querySelector('#username');
//const pwd = document.querySelector('#password');
const cpwd = document.querySelector('#cpwd');
const errUE = document.querySelector('#err-msg-ue');
const errEE = document.querySelector('#err-msg-ee');
const errPDM = document.querySelectorAll('#err-msg-pdm')[1];
let errCodes = document.querySelector("#__c24_0ds_").innerHTML;

//
const msgErrUE = 'Este nombre de usuario ya existe, intente con uno distinto.';
const msgErrEE = 'Correo electr\u00F3nico ya est\u00E1 registrado, int\u00E9ntelo con uno diferente.';
const msgErrPDM = 'Las contrase\u00F1as no coinciden.';

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
    console.log(errCodes);
})(errCodes);

const emailChangeHandler = () => {
    email.classList.remove('invalid');
    errEE.innerHTML = null;
}
const usernameChangeHandler = () => {
    username.classList.remove('invalid');
    errUE.innerHTML = null;
}
const cpwdChangeHandler = () => {
    cpwd.classList.remove('invalid');
    errPDM.innerHTML = null;
}

email.addEventListener('change', emailChangeHandler);
username.addEventListener('change', usernameChangeHandler);
cpwd.addEventListener('change', cpwdChangeHandler);