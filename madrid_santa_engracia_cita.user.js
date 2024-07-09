// ==UserScript==
// @name         Cita
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks thought website to check cita and autofill necessary properties
// @author       Vladimir Bryksin
// @match        *://*.administracionelectronica.gob.es/*/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // Check if variables are already set, otherwise prompt user to set them
    var NIE = GM_getValue('NIE');
    var NAME = GM_getValue('NAME');

    if (!NIE) {
        NIE = prompt('Enter your NIE:', '') || '';
        GM_setValue('NIE', NIE);
    }

    if (!NAME) {
        NAME = prompt('Enter your name:', '') || '';
        GM_setValue('NAME', NAME);
    }

    // Helper function to create a delay
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max-min + 1)) + max;
    }

    function selectOficina() {
        var selectElement = document.getElementById("sede");;
        if (selectElement && selectElement.value != "36") {
            selectElement.value = "36";
            selectElement.dispatchEvent(new Event('change'));
        }
    };

    function selectTramite() {
        var tramiteElement = document.getElementById("tramiteGrupo[0]");
        if (tramiteElement) {
            for (var i = 0; i < tramiteElement.options.length; i++) {
                if (tramiteElement.options[i].value === "4047") {
                    tramiteElement.selectedIndex = i;
                    break;
                }
            }
        }
    };

    function selectProvincia() {
        var provinciaElement = document.getElementById("form");
        if (provinciaElement) {
            for (var i = 0; i < provinciaElement.options.length; i++) {
                if (provinciaElement.options[i].text === "Madrid") {
                    provinciaElement.selectedIndex = i;
                    break;
                }
            }
        }
    };

    function inputNIE() {
        var input = document.getElementById("txtIdCitado");
        if (input) {
            input.value = NIE;
        }
    };

    function inputName() {
        var input = document.getElementById("txtDesCitado");
        if (input) {
            input.value = NAME;
        }
    };

    async function clickForward() {
        var buttonStep1 = document.getElementById("btnAceptar");
        if (buttonStep1) {
            await sleep(getRandomNumber(500, 1500));
            buttonStep1.click();
        }
        var buttonStep2 = document.getElementById("btnEntrar");
        if (buttonStep2) {
            await sleep(getRandomNumber(500, 1500));
            buttonStep2.click();
        }
        var buttonStep3 = document.getElementById("btnEnviar");
        if (buttonStep3) {
            await sleep(getRandomNumber(500, 1500));
            buttonStep3.click();
        }
    }

    async function checkCitaAccess() {
        if (window.location.href === "https://icp.administracionelectronica.gob.es/icpplustiem/acValidarEntrada"
            || window.location.href === "https://icp.administracionelectronica.gob.es/icpplustiem/acCitar") {
            if (document.body.innerText.includes("En este momento no hay citas disponibles")){
                console.log("No citas :(");
            } else if (!document.body.innerText.includes("de las siguientes opciones")) {
                window.open("https://google.com", '_blank');
                await sleep(getRandomNumber(50000, 100000));
            }
        }
    }

    async function initialize() {
        selectProvincia();
        selectOficina();
        selectTramite();
        inputNIE();
        inputName();
        await checkCitaAccess();
        await clickForward();
    }

    window.onload = initialize;
})();
