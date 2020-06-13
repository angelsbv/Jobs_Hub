const uElem = document.querySelector('#username'); //username input
const pElem = document.querySelector('#password'); //password input
const sBtn  = document.querySelector('#submitBtn');

const inputChangeHandler = () => {
    //e.preventDefault();
    const { value: uVal } = uElem;
    const { value: pVal } = pElem;
    sBtn.disabled = (uVal.length > 0 && pVal.length > 0 ? false : true);
};

uElem.addEventListener('keyup', inputChangeHandler);
pElem.addEventListener('keyup', inputChangeHandler);