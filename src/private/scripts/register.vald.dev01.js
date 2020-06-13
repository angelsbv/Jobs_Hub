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
const registerAsPoster = document.querySelector('#registerAsPoster');
const btnSubmit = document.querySelector('.btn-submit');
const empresa = document.querySelector('#empresa');
const emailEmpresa = document.querySelector('#email-empresa');
const telefonoEmpresa = document.querySelector('#telefono-empresa');
const userForm = document.querySelector('#user-form');
const posterForm = document.querySelector('#poster-form');
const formTitle = document.querySelector('#form-title');
const btnBack = document.querySelector('#btn-back')
const errUE = document.querySelector('#err-msg-ue');
const errEE = document.querySelector('#err-msg-ee');
const errPDM = document.querySelector('#err-msg-pdm');
const errPML = document.querySelector('#err-msg-pml');

const colorTxtNormal = '#2196F3';
const colorTxtError = '#f32736';
const colorTxtSuccess = '#4CAF50';

const msgErrUE = 'Este nombre de usuario ya existe, intente con uno distinto.';
const msgErrEE = 'Correo electr\u00F3nico ya est\u00E1 registrado, int\u00E9ntelo con uno diferente.';
const msgErrPDM = 'Las contrase\u00F1as no coinciden.';
const msgErrPML = 'La contrase\u00F1a debe tener un m\u00EDnimo de 6 d\u00EDgitos.'

let errCodes = document.querySelector("#__c24_0ds_").innerHTML;
let timerID = null;
let willRegisterAsPoster = false;
let pml = false;

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

const pwdChangeHandler = () => {
    if(0 > errPML.innerHTML.length){
        pwd.classList.remove('invalid');
        errPML.innerHTML = null;
    }
}

const cpwdChangeHandler = () => {
    if(0 > errPDM.innerHTML.length){
        cpwd.classList.remove('invalid');
        errPDM.innerHTML = null;
    }
}

//Password N' Confirm Password Keyup Handler
const pwdNCpwdKeyupHandler = (e) => {
    const { id } = e.target;
    if(id === 'password'){
        const elemPml = document.querySelector('#pml');
        pml = (pwd.value.length < 6)
        if(pml){
            pwd.classList.remove('valid');
            pwd.classList.add('invalid')
            elemPml.innerHTML = msgErrPML;
            elemPml.setAttribute('style', `color: ${colorTxtError} !important;`);
        }else{
            pwd.classList.add('valid');
            pwd.classList.remove('invalid');
            elemPml.innerHTML = 'La contrase\u00F1a es v\u00E1lida.';
            elemPml.setAttribute('style', `color: ${colorTxtSuccess} !important;`);
        }
    }
    if(pwd.value === cpwd.value && !pml){
        cpwd.classList.add('valid');
        cpwd.classList.remove('invalid');
        errPDM.innerHTML = msgErrPDM.replace('no', '');
        errPDM.setAttribute('style', `color: ${colorTxtSuccess} !important;`);
    }else{
        cpwd.classList.remove('valid');
        cpwd.classList.add('invalid');
        errPDM.innerHTML = msgErrPDM;
        errPDM.setAttribute('style', `color: ${colorTxtError} !important;`);
    }
}

const dataVerification = async (elem, verifyUser, valid) => {
    try {
        const { id } = elem;
        let progressBar = document.querySelector(`.progress[role="alert[${id}]"]`);
        let verifyUserMsg = document.querySelector(`#verify-user-msg[role="alert[${id}]"]`);
        progressBar.classList.remove('hidden');
        elem.classList.remove('invalid', 'valid');
        verifyUser.classList.add('visible');
        verifyUserMsg.innerHTML = 'Verificando...';
        verifyUserMsg.style.color = colorTxtNormal;

        let body = null;
        if(posterForm.classList.contains('visible'))
            body = (id === 'empresa' ? { empresa: elem.value } : { emailEmpresa: elem.value });
        else
            body = (id === 'username' ? { username: elem.value } : { email: elem.value });
        const resp = await fetch('/verify-data',{
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        });
        let { exists } = await resp.json();

        for(let i in body){
            if(body[i] !== undefined && !valid) exists = true;
        }
        setTimeout(() => {
            progressBar.classList.add('hidden');
            let msg = `Este ${elem.ariaPlaceholder} no est\u00E1 disponible.`;
            if(id === 'email' && !valid)
                msg = msg.replace('.', ' o no es correcto.');
            if(id === 'email-empresa' && !valid)
                msg = msg.replace('.', ' o no es correcto.');
            if(id === 'username' && !valid)
                msg = 'Los nombres de usuario deben tener 3 o m\u00E1s d\u00EDgitos.';
            if(id === 'empresa' && !valid)
                msg = 'Los nombres de empresa deben tener 3 o m\u00E1s d\u00EDgitos.';
            verifyUserMsg.innerHTML = (exists ? msg : msg.replace(' no ', ' '));
            verifyUserMsg.style.color = (exists ? colorTxtError : colorTxtSuccess);
            elem.classList.add((exists ? 'invalid' : 'valid'));
        }, 550);
    } catch (error) {
        console.error(error);
    }
}

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
            switch(elem.id){
                case 'email':
                case 'email-empresa':
                    // Validar email(s)
                    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    dataVerification(elem, verifyUser, regex.test(elem.value));
                    break;
                case 'username':
                case 'empresa':
                    // Username y empresa deben tener 3 o más letras
                    dataVerification(elem, verifyUser, (elem.value.length >= 3));
                    break;
                default:
                    throw new Error('Invalid');
            }
        }, 600);
    }else{
        verifyUser.classList.remove('visible');
        elem.classList.remove('valid');
    }
}

const registerAsPosterClickHandler = (e) => {
    willRegisterAsPoster = e.target.checked;
    btnSubmit.innerHTML = (willRegisterAsPoster ? 'Continuar' : 'Registrarme');
}

const btnBackClickHandler = () => {
    userForm.classList.remove('hidden')
    posterForm.classList.remove('visible');
    formTitle.innerHTML = 'Crea tu cuenta';
    btnSubmit.innerHTML = 'Siguiente';
}

const telefonoEmpresaBlurHandler = (e) => {
    const { target: { classList } } = e;
    const errfb = document.querySelector(`span[aria-errormessage="err-fb[${e.target.id}]"]`)
    const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if(!regex.test(e.target.value)){
        errfb.innerHTML = 'Debe digitar un n\u00FAmero telef\u00F3nico v\u00E1lido. Recuerde que solo debe contener n\u00FAmeros.';
        classList.remove('valid');
        classList.add('invalid');
        errfb.style.color = colorTxtError;
    }else{
        errfb.innerHTML = 'Este n\u00FAmero telef\u00F3nico es v\u00E1lido.';
        classList.remove('invalid');
        classList.add('valid');
        errfb.setAttribute('style', `color: ${colorTxtSuccess} !important;`);
    }
}

const fieldChangeHandler = (e) => {
    const errfb = document.querySelector(`span[aria-errormessage="err-fb[${e.target.id}]"]`);
    if(errfb) errfb.innerHTML = '';
}

const showPwdHandler = (e) => {
    const { type } = pwd;
    pwd.type = (type === 'text' ? 'password' : 'text');
    const i = e.target.querySelector('i')
    console.log(i);
    if(i)
        i.innerHTML = (type === 'text' ? 'visibility' : 'visibility_off')
    else
        e.target.innerHTML = (type === 'text' ? 'visibility' : 'visibility_off')

}

const formSubmitHandler = (e) => {
    e.preventDefault();
    const userFields = document.querySelectorAll('.user-field');
    for(let i = 0; i < (userFields.length - 1); i++){
        let field = userFields[i];
        if(field.value.length < 1){
            field.classList.add('invalid');
            let errfb = document.querySelector(`span[aria-errormessage="err-fb[${field.id}]"]`)
            if(errfb)
            errfb.innerHTML = "Este campo es requerido."
        }
    }

    if(posterForm.classList.contains('visible')){
        const posterFields = document.querySelectorAll('.poster-field');
        for(let i = 0; i < posterFields.length; i++){
            let field = posterFields[i];
            if(field.value.length < 1){
                field.classList.add('invalid');
                let errfb = document.querySelector(`span[aria-errormessage="err-fb[${field.id}]"]`)
                if(errfb)
                    errfb.innerHTML = "Este campo es requerido."
            }
        }
    }
    const invalidFields = document.querySelectorAll('.invalid');
    const validFields = document.querySelectorAll('.valid');
    if(undefined !== invalidFields 
        && invalidFields.length == 0
        && validFields.length > 1
    ) 
    { 
        if(willRegisterAsPoster && !userForm.classList.contains('hidden')){
            userForm.classList.add('hidden')
            posterForm.classList.add('visible');
            formTitle.innerHTML += ' (poster)';
        }
        else { form.submit(); } 
    }
}

email.addEventListener('change', emailChangeHandler);
email.addEventListener('keyup', userDataKeyupHandler);
username.addEventListener('change', usernameChangeHandler);
username.addEventListener('keyup', userDataKeyupHandler);
empresa.addEventListener('keyup', userDataKeyupHandler);
emailEmpresa.addEventListener('keyup', userDataKeyupHandler);
telefonoEmpresa.addEventListener('blur', telefonoEmpresaBlurHandler);
cpwd.addEventListener('change', cpwdChangeHandler)
cpwd.addEventListener('keyup', pwdNCpwdKeyupHandler);
pwd.addEventListener('keyup', pwdNCpwdKeyupHandler);
pwd.addEventListener('change', pwdChangeHandler);
btnBack.addEventListener('click', btnBackClickHandler);
registerAsPoster.addEventListener('click', registerAsPosterClickHandler);
form.addEventListener('submit', formSubmitHandler);
document.querySelectorAll('input').forEach(i => i.addEventListener('keyup', fieldChangeHandler));
document.querySelectorAll('.show-pwd').forEach(i => i.addEventListener('click', showPwdHandler));