const table = document.getElementById("tableHardwareID");
let input;
let newRow;
let newCell;
let button;

export function lastBoltkitToTable(lastBoltKit) {
  // добвляем болт комплект в таблицу
  table.setAttribute("style", "visibility:visible");
  table.setAttribute("style", "width:90%");
  boltToTable(lastBoltKit);
  nutToTable(lastBoltKit.ourNut);
  flatWasherToTable(lastBoltKit.ourFlatWasher);
  if (lastBoltKit.ourSpringWasher !== undefined) {
    springWasherToTable(lastBoltKit.ourSpringWasher);
  }
  button = document.getElementById("boltsTableExportExcelID");
  button.setAttribute("style", "display:inline");
  button.addEventListener("click", boltsTableExport);
  button = document.getElementById("progExportID");
  button.setAttribute("style", "display:inline");
}

function addCell(alignTrue) {
  // добавляем ячейку обрамлением
  newCell = newRow.insertCell(-1);
  newCell.setAttribute("data-b-a-s", "thin");
  if (alignTrue) {
    newCell.setAttribute("align", "center");
    newCell.setAttribute("data-a-h", "center");
  }
}

function boltToTable(lastBolt) {
  // Добавляем болт в таблицу
  newRow = table.insertRow(-1);
  newCell = newRow.insertCell(0);
  newCell.setAttribute("colspan", "8");
  newCell.setAttribute("data-exclude", "true"); //прячим ячейку в экспорте
  newCell.setAttribute("align", "center");
  input = document.createElement("INPUT");
  input.setAttribute("style", "width:99%; text-align:center");
  input.setAttribute("value", "Комментарий к соединению");
  newCell.appendChild(input);
  input = null;
  newCell = newRow.insertCell(-1); //ячейка для экспорта
  newCell.setAttribute("style", "display:none"); //ячейка для экспорта
  newCell.setAttribute("colspan", "8"); //ячейка для экспорта
  newCell.setAttribute("data-a-h", "center");
  newCell.setAttribute("data-b-a-s", "thin");
  newRow = table.insertRow(-1);
  addCell(false);
  newCell.appendChild(
    document.createTextNode(`Болт М${lastBolt.ourBolt.diameter}`)
  );
  addCell(true);
  newCell.appendChild(document.createTextNode(`${lastBolt.packageThickness}`));
  addCell(true);
  if (!lastBolt.ourBolt.recommended) {
    newCell.appendChild(document.createTextNode(`${lastBolt.ourBolt.length}*`));
  }
  if (lastBolt.ourBolt.recommended) {
    newCell.appendChild(document.createTextNode(`${lastBolt.ourBolt.length}`));
  }
  newCell = newRow.insertCell(-1);
  input = document.createElement("INPUT");
  input.setAttribute("value", "1");
  newCell.setAttribute("data-exclude", "true"); //прячим ячейку в экспорте
  input.setAttribute("style", "width:92%; text-align:center");
  input.addEventListener("change", recalculationMass);
  newCell.setAttribute("align", "center");
  newCell.appendChild(input);
  input = null;
  addCell(true); //добавчлем ячейку для экспорта
  newCell.setAttribute("style", "display:none");
  addCell(true);
  newCell.appendChild(
    document.createTextNode(
      `${Math.round((1 * lastBolt.ourBolt.weightX1000) / 1000) / 1000}`
    )
  );
  addCell(true);
  newCell.appendChild(document.createTextNode(`${lastBolt.ourBolt.gost}`));
  addCell(true);
  newCell.appendChild(
    document.createTextNode(document.getElementById("strengthClassID").value)
  );
  addCell(true);
  input = document.createElement("INPUT");
  input.setAttribute("value", "");
  input.setAttribute("style", "width:92%; text-align:center");
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(input);
  input = null;
  newCell = newRow.insertCell(-1);
  newCell.setAttribute("style", "display:none");
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(
    document.createTextNode(`${lastBolt.ourBolt.weightX1000}`)
  );
  addCell(true); //добавчлем ячейку для экспорта примечаний
  newCell.setAttribute("style", "display:none");
}

function nutToTable(ourNut) {
  // Добавляем  гайки
  newRow = table.insertRow(-1);
  newCell = newRow.insertCell(0);
  newCell.setAttribute("colspan", "3");
  newCell.setAttribute("data-b-a-s", "thin");
  newCell.appendChild(document.createTextNode(`Гайка М${ourNut.diameter}`));
  addCell(true);
  newCell.appendChild(document.createTextNode(ourNut.count));
  addCell(true);
  newCell.appendChild(
    document.createTextNode(`${Math.round(ourNut.weightX1000 / 1000) / 1000}`)
  );
  addCell(true);
  newCell.appendChild(document.createTextNode(ourNut.gost));
  addCell(true);
  newCell.appendChild(
    document.createTextNode(
      table.rows[table.rows.length - 2].cells[
        table.rows[table.rows.length - 2].cells.length - 4
      ].innerHTML.split(".", 1)
    )
  );
  addCell(true);
  newCell.setAttribute("data-exclude", "true");
  input = document.createElement("INPUT");
  input.setAttribute("value", "");
  input.setAttribute("style", "width:92%; text-align:center");
  newCell.appendChild(input);
  input = null;
  addCell(true);
  newCell.setAttribute("style", "display:none");
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(document.createTextNode(`${ourNut.weightX1000}`));
  addCell(true);
  newCell.setAttribute("style", "display:none");
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(
    document.createTextNode(document.getElementById("nutID").value)
  );
  newCell = newRow.insertCell(-1); //добавчлем ячейку для экспорта примечаний
  newCell.setAttribute("data-a-h", "center");
  newCell.setAttribute("data-b-a-s", "thin");
  newCell.setAttribute("style", "display:none");
}

function flatWasherToTable(lastFlatWasher) {
  // добавляем плоскую шайбу
  newRow = table.insertRow(-1);
  newCell = newRow.insertCell(0);
  newCell.setAttribute("colspan", "3");
  newCell.setAttribute("data-b-a-s", "thin");
  newCell.appendChild(
    document.createTextNode(`Шайба ${lastFlatWasher.diameter}`)
  );
  addCell(true);
  newCell.appendChild(document.createTextNode(lastFlatWasher.count));
  addCell(true);
  newCell.appendChild(
    document.createTextNode(
      `${Math.round(lastFlatWasher.weightX1000 / 1000) / 1000}`
    )
  );
  addCell(true);
  newCell.appendChild(document.createTextNode(lastFlatWasher.gost));
  addCell(true);
  addCell(true);
  newCell.setAttribute("data-exclude", "true");
  input = document.createElement("INPUT");
  input.setAttribute("value", "");
  input.setAttribute("style", "width:92%; text-align:center");
  newCell.appendChild(input);
  input = null;
  newCell = newRow.insertCell(-1);
  newCell.setAttribute("style", "display:none");
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(document.createTextNode(`${lastFlatWasher.weightX1000}`));
  newCell = newRow.insertCell(-1);
  newCell.setAttribute("style", "display:none");
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(
    document.createTextNode(document.getElementById("nutID").value)
  );
  addCell(true); //добавчлем ячейку для экспорта примечаний
  newCell.setAttribute("style", "display:none");
}

function springWasherToTable(lastSpringWasher) {
  // добавляем пружинную шайбу
  newRow = table.insertRow(-1);
  newCell = newRow.insertCell(0);
  newCell.setAttribute("colspan", "3");
  newCell.setAttribute("data-b-a-s", "thin");
  newCell.appendChild(
    document.createTextNode(`Шайба пружинная ${lastSpringWasher.diameter}`)
  );
  addCell(true);
  newCell.appendChild(document.createTextNode(lastSpringWasher.count));
  addCell(true);
  newCell.appendChild(
    document.createTextNode(
      `${Math.round(lastSpringWasher.weightX1000 / 1000) / 1000}`
    )
  );
  addCell(true);
  newCell.appendChild(document.createTextNode(lastSpringWasher.gost));
  addCell(true);
  input = document.createElement("INPUT");
  input.setAttribute("value", "");
  input.setAttribute("style", "width:92%; text-align:center");
  addCell(true);
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(input);
  input = null;
  newCell = newRow.insertCell(-1);
  newCell.setAttribute("style", "display:none");
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(
    document.createTextNode(`${lastSpringWasher.weightX1000}`)
  );
  newCell = newRow.insertCell(-1);
  newCell.setAttribute("style", "display:none");
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(document.createTextNode(lastSpringWasher.count));
  addCell(true); //добавчлем ячейку для экспорта примечаний
  newCell.setAttribute("style", "display:none");
}

function recalculationMass() {
  // перерасчитываем массу таблицы
  for (let r = 3; r < table.rows.length; r++) {
    if (table.rows[r].cells[0].innerHTML.includes("Болт")) {
      //
      table.rows[r].cells[5].innerText =
        Math.round(
          +table.rows[r].cells[3].firstChild.value *
            +table.rows[r].cells[9].innerText
        ) / 1000;
      table.rows[r + 1].cells[1].innerText =
        +table.rows[r].cells[3].firstChild.value *
        +table.rows[r + 1].cells[7].innerText;
      table.rows[r + 1].cells[2].innerText =
        Math.round(
          +table.rows[r].cells[3].firstChild.value *
            +table.rows[r + 1].cells[7].innerText *
            +table.rows[r + 1].cells[6].innerText
        ) / 1000;
      table.rows[r + 2].cells[1].innerText =
        +table.rows[r].cells[3].firstChild.value *
        +table.rows[r + 2].cells[7].innerText;
      table.rows[r + 2].cells[2].innerText =
        Math.round(
          +table.rows[r].cells[3].firstChild.value *
            +table.rows[r + 2].cells[7].innerText *
            +table.rows[r + 2].cells[6].innerText
        ) / 1000;
      if (
        table.rows[r + 3] &&
        table.rows[r + 3].cells[0].innerHTML.includes("Шайба пружинная")
      ) {
        table.rows[r + 3].cells[1].innerText =
          +table.rows[r].cells[3].firstChild.value *
          +table.rows[r + 3].cells[7].innerText;
        table.rows[r + 3].cells[2].innerText =
          Math.round(
            +table.rows[r].cells[3].firstChild.value *
              +table.rows[r + 3].cells[7].innerText *
              +table.rows[r + 3].cells[6].innerText
          ) / 1000;
      }
    }
  }
}

function inputToTable() {
  // перносим имуты в таблицу для экспорта таблицы
  for (let r = 3; r < table.rows.length; r++) {
    if (table.rows[r].cells[0].innerHTML.includes("Болт")) {
      table.rows[r - 1].cells[1].innerText =
        table.rows[r - 1].cells[0].firstChild.value; //переносим комментарий к соединению
      table.rows[r].cells[4].innerText =
        table.rows[r].cells[3].firstChild.value; //кол-во болтов
      table.rows[r].cells[10].innerText =
        table.rows[r].cells[8].firstChild.value; //примечание к болтам
      table.rows[r + 1].cells[8].innerText =
        table.rows[r + 1].cells[5].firstChild.value; //примечание к гайкам
      table.rows[r + 2].cells[8].innerText =
        table.rows[r + 2].cells[5].firstChild.value; //примечание к шайьбам
      if (
        table.rows[r + 3] &&
        table.rows[r + 3].cells[0].innerHTML.includes("Шайба пружинная")
      ) {
        table.rows[r + 3].cells[8].innerText =
          table.rows[r + 3].cells[5].firstChild.value; //примечание к пружинным шайбам
      }
    }
  }
}

function boltsTableExport() {
  // Экспортируем табилцу в экель
  inputToTable();
  TableToExcel.convert(document.getElementById("tableHardwareID"));
}
