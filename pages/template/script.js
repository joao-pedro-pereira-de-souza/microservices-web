
import ApiService from '../../services/api/index.js';
import IsResponseAlert from '../../responses/index.js';

/**
 * @type {File} [file]
 */
let file_upload = null;

const view_file = document.getElementById('view_file');
const view_file_output = document.getElementById("view_file_output");
const btn_file_upload = document.getElementById("btn_file_upload");
const p_view_path_file = document.getElementById("view_path_file");
const div_container_params = document.getElementById("container_params");
const btn_add_params = document.getElementById("btn_add_params");
const btn_finish = document.getElementById("btn_finish");
const btn_clear_params = document.getElementById("btn_clear_params");
const btn_dowload = document.getElementById("btn_dowload");

btn_dowload.classList.add("btn_freeza");

import Components from './components.js';
const components = new Components();

import WebSocket from '../../services/websockets/index.js';
const webSocket = new WebSocket();


/**
 * @typedef {Object} ObjectInputsParam
 * @property {string} id_input_key - Descrição do id_input_key.
 * @property {string} id_input_property - Descrição do id_input_property.
 */


/**
 *
 * @type { Array.<ObjectInputsParam>}
 */
const idsInputsParams = []

function Init() {
   if (!view_file.src) {
      view_file.style.border = "1px solid #000";
   } else {
      view_file.style.border = "none";
   }


    if (!view_file_output.src) {
      view_file_output.style.border = "1px solid #000";
    } else {
      view_file_output.style.border = "none";
    }
}

Init();

function startProgress() {
  var progressBar = document.getElementById("progressBar");
  var width = 0;

  var intervalId = setInterval(function () {
     if (width >= 100) {
      btn_dowload.classList.remove("btn_freeza");
      clearInterval(intervalId);
    } else {
      width++;
      progressBar.style.width = width + "%";
      progressBar.innerHTML = width + "%";
    }
  }, 20);
}

/**
 *
 * @param {any} file
 * @param {HTMLElement} elementEmbed
 * @param {boolean} isPathLocal
 */

function OnloadPDF(file, elementEmbed, isPathLocal) {
  const filwReader = new FileReader();

  filwReader.onload = function (event) {

    if (isPathLocal) {
      elementEmbed.src = event.target.result;
    } else {
      const objectUrl = URL.createObjectURL(file);
      elementEmbed.src = objectUrl;
    }

  };

  filwReader.readAsDataURL(file);
  elementEmbed.style.border = "none";
}

function EventClickBtnFileUpload() {
  const inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.accept = ".pdf";

  inputFile.addEventListener("change", function () {
    if (inputFile.files.length > 0) {
      const file = inputFile.files[0];
      if (file.type === "application/pdf") {
        file_upload = file;
          OnloadPDF(file, view_file, true);
          p_view_path_file.innerText = file.name;

       } else {
         alert("Por favor, selecione um arquivo PDF.");
       }
    }
  });

  inputFile.click();
}


/**
 * @param {Object} params
 * @param {File} params.pdf
 */
function ResponseJobUseTemplate(params) {
  const file =  params.file;

  const blob = new Blob([file], { type: "application/pdf" });
  OnloadPDF(blob, view_file_output, false);

}


function AddElementsParams() {

  const valueInputs = idsInputsParams.length + 1;

  const inputKeyParam = `<input id="input_key_${valueInputs}" type="text" class="text_input size_input_key">`;

  const inputPropertyParam = `<input id="input_property_${valueInputs}" type="text" class="text_input size_input_property">`;

  idsInputsParams.push({
      id_input_key: `input_key_${valueInputs}`,
      id_input_property: `input_property_${valueInputs}`,
  });
  return {
    inputKeyParam,
    inputPropertyParam,
  };
}

function EventClickBtnAddParams() {

   const {inputKeyParam, inputPropertyParam } = AddElementsParams();
    const params = {
      id_input_key: inputKeyParam,
      id_input_property: inputPropertyParam,
    };
   const htmlFormated = ejs.render(components.template_add_params, params);

   const div_content_add_params = document.createElement("div");
   div_content_add_params.innerHTML = htmlFormated;
   div_container_params.appendChild(div_content_add_params);
}

async function EventClickBtnFinish() {

  if (!file_upload) {
    alert('É obrigatório enviar o arquivo.')
  }

  if (file_upload) {
    btn_dowload.classList.add("btn_freeza");
    const paramsTempalte = {};

    for (const [_, value] of idsInputsParams.entries()) {
      const element_input_key = document.getElementById(value.id_input_key);
      const element_input_property = document.getElementById(
        value.id_input_property
      );

      paramsTempalte[element_input_key.value] = element_input_property.value;
    }

    const paramsRequestReport = {
      file: file_upload,
      data: {
        data: paramsTempalte,
      },
    };

    const response = await ApiService.report.create(paramsRequestReport);

    IsResponseAlert(response);

    const job_id = response.data.job_id;

    await webSocket.open();

    const paramsEmitJoin = {
      job_id,
    };
    webSocket.emitJoinRoomProgress(paramsEmitJoin);

    const paramsOnProgress = {
      callback: ResponseJobUseTemplate,
    };
    webSocket.onProgressTemplate(paramsOnProgress);

    startProgress();
  }

}

function EventClickClearParams() {
   while (div_container_params.firstChild) {
     div_container_params.removeChild(div_container_params.firstChild);
   }
}


btn_file_upload.addEventListener("click", EventClickBtnFileUpload);
btn_add_params.addEventListener("click", EventClickBtnAddParams);
btn_finish.addEventListener("click", EventClickBtnFinish);
btn_clear_params.addEventListener("click", EventClickClearParams);
