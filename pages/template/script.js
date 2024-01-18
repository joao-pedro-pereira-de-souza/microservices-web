
const view_file = document.getElementById('view_file');
const btn_file_upload = document.getElementById("btn_file_upload");
const p_view_path_file = document.getElementById("view_path_file");

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

btn_file_upload.addEventListener("click", EventClickBtnFileUpload);
