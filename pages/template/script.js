
const view_file = document.getElementById('view_file');
const btn_file_upload = document.getElementById("btn_file_upload");
const p_view_path_file = document.getElementById("view_path_file");
const div_container_params = document.getElementById("container_params");
const btn_add_params = document.getElementById("btn_add_params");
const btn_finish = document.getElementById("btn_finish");
const btn_btn_clear_params = document.getElementById("btn_clear_params");

import Components from './components.js';
const components = new Components();


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
}

Init();

function OnloadPDF(arquivo) {
  const filwReader = new FileReader();

  filwReader.onload = function (event) {
     view_file.src = event.target.result;
  };

  filwReader.readAsDataURL(arquivo);
}


function EventClickBtnFileUpload() {
  const inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.accept = ".pdf";

  inputFile.addEventListener("change", function () {
    if (inputFile.files.length > 0) {
      const file = inputFile.files[0];
       if (file.type === "application/pdf") {

          console.log(file)
          OnloadPDF(file);

          view_file.style.border = "none";
          p_view_path_file.innerText = file.name;

       } else {
         alert("Por favor, selecione um arquivo PDF.");
       }
    }
  });

  inputFile.click();
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

function EventClickBtnFinish() {
   const paramsTempalte = {};

   for (const [_, value] of idsInputsParams.entries()) {
      const element_input_key = document.getElementById(value.id_input_key);
      const element_input_property = document.getElementById(value.id_input_property);

      paramsTempalte[element_input_key.value] = element_input_property.value;

   }
   console.log({ paramsTempalte });
}

function EventClickClearParams() {
   while (div_container_params.firstChild) {
     div_container_params.removeChild(div_container_params.firstChild);
   }
}

btn_file_upload.addEventListener("click", EventClickBtnFileUpload);

btn_add_params.addEventListener("click", EventClickBtnAddParams);

btn_finish.addEventListener("click", EventClickBtnFinish);

btn_btn_clear_params.addEventListener("click", EventClickClearParams);
