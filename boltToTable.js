const table = document.getElementById("tableHardwareID");
const button = document.getElementById("boltsTableExportExcelID");
let input;
let newRow;
let newCell;

export function lastBoltkitToTable(lastBoltKit) {
  // добвляем болт комплект в таблицу
  table.classList.remove("hide");
  document.getElementById("boltsTableExportExcelDiv").classList.remove("hide");
  boltToTable(lastBoltKit);
  nutToTable(lastBoltKit.ourNut);
  flatWasherToTable(lastBoltKit.ourFlatWasher);
  if (lastBoltKit.ourSpringWasher !== undefined) {
    springWasherToTable(lastBoltKit.ourSpringWasher);
  }
  button.addEventListener("click", boltsTableExport);
}

function addСentreCell() {
  newCell = newRow.insertCell(-1);
  newCell.classList.add("cellBorder");
  newCell.setAttribute("data-b-a-s", "thin");
  newCell.setAttribute("align", "center");
  newCell.setAttribute("data-a-h", "center");
}
function addCell() {
  newCell = newRow.insertCell(-1);
  newCell.classList.add("cellBorder");
  newCell.setAttribute("data-b-a-s", "thin");
}

function addNameConnectionCommentCell() {
  newRow = table.insertRow(-1);
  newCell = newRow.insertCell(0);
  newCell.classList.add("cellBorder");
  newCell.setAttribute("colspan", "8");
  newCell.setAttribute("data-exclude", "true"); //прячим ячейку в экспорте
  input = document.createElement("INPUT");
  input.classList.add("inputNoBorder");
  input.setAttribute("value", "Комментарий к соединению");
  newCell.appendChild(input);
  input = null;
  addСentreCell(); //ячейка для экспорта
  newCell.classList.add("noneDisplay"); //ячейка для экспорта
  newCell.setAttribute("colspan", "8"); //ячейка для экспорта
}

function addInputQuantityCell() {
  newCell = newRow.insertCell(-1);
  newCell.classList.add("cellBorder");
  input = document.createElement("INPUT");
  input.setAttribute("value", "1");
  input.setAttribute("type", "number");
  input.setAttribute("min", "1");
  newCell.setAttribute("data-exclude", "true"); //прячим ячейку в экспорте
  input.classList.add("inputNoBorder");
  input.addEventListener("change", recalculationMass);
  newCell.appendChild(input);
  input = null;
}

function addInputNoteCell() {
  newCell = newRow.insertCell(-1);
  newCell.classList.add("cellBorder");
  newCell.setAttribute("data-b-a-s", "thin");
  newCell.setAttribute("align", "center");
  newCell.setAttribute("data-a-h", "center");
  input = document.createElement("INPUT");
  input.classList.add("inputNoBorder");
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(input);
  input = null;
}

function boltToTable(lastBolt) {
  // Добавляем болт в таблицу
  addNameConnectionCommentCell();
  newRow = table.insertRow(-1);
  addCell();
  newCell.appendChild(document.createTextNode(`Болт М${lastBolt.ourBolt.diameter}`));
  addСentreCell();
  newCell.appendChild(document.createTextNode(`${lastBolt.packageThickness}`));
  addСentreCell();
  if (!lastBolt.ourBolt.recommended) {
    newCell.appendChild(document.createTextNode(`${lastBolt.ourBolt.length}*`));
  }
  if (lastBolt.ourBolt.recommended) {
    newCell.appendChild(document.createTextNode(`${lastBolt.ourBolt.length}`));
  }
  addInputQuantityCell();
  addСentreCell(); //добавчлем ячейку для экспорта
  newCell.classList.add("noneDisplay"); //ячейка для экспорта
  addСentreCell();
  newCell.appendChild(
    document.createTextNode(`${Math.round((1 * lastBolt.ourBolt.weightX1000) / 1000) / 1000}`)
  );
  addСentreCell();
  newCell.appendChild(document.createTextNode(`${lastBolt.ourBolt.gost}`));
  addСentreCell();
  newCell.appendChild(document.createTextNode(document.getElementById("strengthClassID").value));
  addInputNoteCell();
  newCell = newRow.insertCell(-1);
  newCell.classList.add("noneDisplay"); //ячейка для экспорта
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(document.createTextNode(`${lastBolt.ourBolt.weightX1000}`));
  addСentreCell(); //добавчлем ячейку для экспорта примечаний
  newCell.classList.add("noneDisplay"); //ячейка для экспорта
}

function addFirstCellName() {
  newRow = table.insertRow(-1);
  newCell = newRow.insertCell(0);
  newCell.classList.add("cellBorder");
  newCell.setAttribute("colspan", "3");
  newCell.setAttribute("data-b-a-s", "thin");
}

function nutToTable(ourNut) {
  // Добавляем  гайки
  addFirstCellName();
  newCell.appendChild(document.createTextNode(`Гайка М${ourNut.diameter}`));
  addСentreCell();
  newCell.appendChild(document.createTextNode(ourNut.count));
  addСentreCell();
  newCell.appendChild(document.createTextNode(`${Math.round(ourNut.weightX1000 / 1000) / 1000}`));
  addСentreCell();
  newCell.appendChild(document.createTextNode(ourNut.gost));
  addСentreCell();
  newCell.appendChild(
    document.createTextNode(
      table.rows[table.rows.length - 2].cells[
        table.rows[table.rows.length - 2].cells.length - 4
      ].innerHTML.split(".", 1)
    )
  );
  addInputNoteCell();
  addСentreCell();
  newCell.classList.add("noneDisplay"); //ячейка для экспорта
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(document.createTextNode(`${ourNut.weightX1000}`));
  addСentreCell();
  newCell.classList.add("noneDisplay"); //ячейка для экспорта
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(document.createTextNode(document.getElementById("nutID").value));
  newCell = newRow.insertCell(-1); //добавчлем ячейку для экспорта примечаний
  newCell.setAttribute("data-a-h", "center");
  newCell.setAttribute("data-b-a-s", "thin");
  newCell.classList.add("noneDisplay"); //ячейка для экспорта
}

function flatWasherToTable(lastFlatWasher) {
  // добавляем плоскую шайбу
  addFirstCellName();
  newCell.appendChild(document.createTextNode(`Шайба ${lastFlatWasher.diameter}`));
  addСentreCell();
  newCell.appendChild(document.createTextNode(lastFlatWasher.count));
  addСentreCell();
  newCell.appendChild(
    document.createTextNode(`${Math.round(lastFlatWasher.weightX1000 / 1000) / 1000}`)
  );
  addСentreCell();
  newCell.appendChild(document.createTextNode(lastFlatWasher.gost));
  addСentreCell();
  addInputNoteCell();
  newCell = newRow.insertCell(-1);
  newCell.classList.add("noneDisplay"); //ячейка для экспорта
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(document.createTextNode(`${lastFlatWasher.weightX1000}`));
  newCell = newRow.insertCell(-1);
  newCell.classList.add("noneDisplay"); //ячейка для экспорта
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(document.createTextNode(document.getElementById("nutID").value));
  addСentreCell(); //добавчлем ячейку для экспорта примечаний
  newCell.classList.add("noneDisplay"); //ячейка для экспорта
}

function springWasherToTable(lastSpringWasher) {
  // добавляем пружинную шайбу
  addFirstCellName();
  newCell.appendChild(document.createTextNode(`Шайба пружинная ${lastSpringWasher.diameter}`));
  addСentreCell();
  newCell.appendChild(document.createTextNode(lastSpringWasher.count));
  addСentreCell();
  newCell.appendChild(
    document.createTextNode(`${Math.round(lastSpringWasher.weightX1000 / 1000) / 1000}`)
  );
  addСentreCell();
  newCell.appendChild(document.createTextNode(lastSpringWasher.gost));
  addСentreCell();
  addInputNoteCell();
  newCell = newRow.insertCell(-1);
  newCell.classList.add("noneDisplay"); //ячейка для экспорта
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(document.createTextNode(`${lastSpringWasher.weightX1000}`));
  newCell = newRow.insertCell(-1);
  newCell.classList.add("noneDisplay"); //ячейка для экспорта
  newCell.setAttribute("data-exclude", "true");
  newCell.appendChild(document.createTextNode(lastSpringWasher.count));
  addСentreCell(); //добавчлем ячейку для экспорта примечаний
  newCell.classList.add("noneDisplay"); //ячейка для экспорта
}

function recalculationMass() {
  // перерасчитываем массу таблицы
  for (let r = 3; r < table.rows.length; r++) {
    if (table.rows[r].cells[0].innerHTML.includes("Болт")) {
      //
      table.rows[r].cells[3].firstChild.value = +table.rows[r].cells[3].firstChild.value; //теряем нули в начале строки
      table.rows[r].cells[5].innerText =
        Math.round(+table.rows[r].cells[3].firstChild.value * +table.rows[r].cells[9].innerText) /
        1000;
      table.rows[r + 1].cells[1].innerText =
        +table.rows[r].cells[3].firstChild.value * +table.rows[r + 1].cells[7].innerText;
      table.rows[r + 1].cells[2].innerText =
        Math.round(
          +table.rows[r].cells[3].firstChild.value *
            +table.rows[r + 1].cells[7].innerText *
            +table.rows[r + 1].cells[6].innerText
        ) / 1000;
      table.rows[r + 2].cells[1].innerText =
        +table.rows[r].cells[3].firstChild.value * +table.rows[r + 2].cells[7].innerText;
      table.rows[r + 2].cells[2].innerText =
        Math.round(
          +table.rows[r].cells[3].firstChild.value *
            +table.rows[r + 2].cells[7].innerText *
            +table.rows[r + 2].cells[6].innerText
        ) / 1000;
      if (table.rows[r + 3] && table.rows[r + 3].cells[0].innerHTML.includes("Шайба пружинная")) {
        table.rows[r + 3].cells[1].innerText =
          +table.rows[r].cells[3].firstChild.value * +table.rows[r + 3].cells[7].innerText;
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
      table.rows[r - 1].cells[1].innerText = table.rows[r - 1].cells[0].firstChild.value; //переносим комментарий к соединению
      table.rows[r].cells[4].innerText = table.rows[r].cells[3].firstChild.value; //кол-во болтов
      table.rows[r].cells[10].innerText = table.rows[r].cells[8].firstChild.value; //примечание к болтам
      table.rows[r + 1].cells[8].innerText = table.rows[r + 1].cells[5].firstChild.value; //примечание к гайкам
      table.rows[r + 2].cells[8].innerText = table.rows[r + 2].cells[5].firstChild.value; //примечание к шайьбам
      if (table.rows[r + 3] && table.rows[r + 3].cells[0].innerHTML.includes("Шайба пружинная")) {
        table.rows[r + 3].cells[8].innerText = table.rows[r + 3].cells[5].firstChild.value; //примечание к пружинным шайбам
      }
    }
  }
}

function boltsTableExport() {
  // Экспортируем табилцу в экель
  inputToTable();
  TableToExcel.convert(document.getElementById("tableHardwareID"));
}
