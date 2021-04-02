/*
В для болтов ГОСТ 52644-2006 высота шайб по ГОСТ 52644-2006 вязта средняя, в госте дана вилка у разных производителей она тоже разная.
Для болтов, гаек по 32484.3-2014 и 32484.4-2014 массы не указаны, нет в ГОСТ массы :(
*/

import { gost779870 } from "./hardware/7798-70.js";
import { gost526442006 } from "./hardware/52644-2006.js";
import { gost3248432014B } from "./hardware/32484.3-2014.js";
import { gost3248442014B } from "./hardware/32484.4-2014.js";
const bolt = { gost779870, gost526442006, gost3248432014B, gost3248442014B };

import { cutBoltSelection, stretchingBoltSelection, boltSelectionToText } from "./boltSelection.js";
import { lastBoltkitToTable } from "./boltToTable.js";

let gostID = document.getElementById("gostID");
let selectGOSTIndex;
let selectGOST;
let selectboltIndex;
let selectbolt;
let nutIndex = document.getElementById("nutID").options.selectedIndex;
let nut = document.getElementById("nutID").options[nutIndex].text;
let packageThickness = document.getElementById("packageThicknessID").value;
let boltWorkIndex;
let matchedBoltText = document.getElementById("matchedBoltID");
//matchedBoltText.width = window.innerWidth;

let lastBoltKit;

boltGostFill();
boltDiametrFill();
boltReСount();
maxPackageThickness();

document.getElementById("gostID").addEventListener("change", boltDiametrFill);
document.getElementById("gostID").addEventListener("change", boltReСount);
document.getElementById("gostID").addEventListener("change", maxPackageThickness);
document.getElementById("boltID").addEventListener("change", boltReСount);
document.getElementById("boltID").addEventListener("change", maxPackageThickness);
document.getElementById("packageThicknessID").addEventListener("change", boltReСount);
document.getElementById("nutID").addEventListener("change", boltReСount);
document.getElementById("bolWorkID").addEventListener("change", boltReСount);
document
  .getElementById("boltSelectionButtonAddID")
  .addEventListener("click", lastBoltkitToTableFunc);

function boltGostFill() {
  // Заполняем выбор гостов
  let i = 0;
  for (let key in bolt) {
    gostID.options[i] = new Option(bolt[key].gost);
    i++;
  }
  gostID = document.getElementById("gostID");
  selectGOSTIndex = document.getElementById("gostID").options.selectedIndex;
  selectGOST = document.getElementById("gostID").options[selectGOSTIndex].text;
}

function boltDiametrFill() {
  // Заполняем диаметр от гостов
  let selectboltID = document.getElementById("boltID");
  let selectGOSTIndex = document.getElementById("gostID").options.selectedIndex;
  let selectGOST = document.getElementById("gostID").options[selectGOSTIndex].text;
  selectboltID.options.length = 0;
  let i = 0;
  for (let key in bolt) {
    if (bolt[key].gost === selectGOST) {
      for (let key2 in bolt[key]) {
        selectboltID.options[i] = new Option(key2);
        i++;
      }
    }
  }
  selectboltID.options.length = selectboltID.options.length - 3;
  selectboltIndex = document.getElementById("boltID").options.selectedIndex;
  selectbolt = document.getElementById("boltID").options[selectboltIndex].text;
}

function maxPackageThickness() {
  selectGOST = document.getElementById("gostID").options[selectGOSTIndex].text;
  selectboltIndex = document.getElementById("boltID").options.selectedIndex;
  selectbolt = document.getElementById("boltID").options[selectboltIndex].text;
  let maxlengthBolt;
  for (let key in bolt) {
    if (bolt[key].gost === selectGOST) {
      maxlengthBolt = +bolt[key][selectbolt][bolt[key][selectbolt].length - 1].length;
      document.getElementById("packageThicknessID").setAttribute("max", maxlengthBolt);
      break;
    }
  }
}

function boltReСount() {
  //пересчитываем болт

  selectGOST = document.getElementById("gostID").options[selectGOSTIndex].text;
  selectboltIndex = document.getElementById("boltID").options.selectedIndex;
  selectbolt = document.getElementById("boltID").options[selectboltIndex].text;
  nutIndex = document.getElementById("nutID").options.selectedIndex;
  nut = document.getElementById("nutID").options[nutIndex].text;
  document.getElementById("packageThicknessID").value = +document.getElementById(
    "packageThicknessID"
  ).value; //теряем нули в начале строки
  packageThickness = document.getElementById("packageThicknessID").value;
  boltWorkIndex = document.getElementById("bolWorkID").options.selectedIndex;
  if (boltWorkIndex === 0) {
    lastBoltKit = cutBoltSelection(selectGOST, selectbolt, nut, packageThickness);
  }
  if (boltWorkIndex === 1) {
    lastBoltKit = stretchingBoltSelection(selectGOST, selectbolt, nut, packageThickness);
  }
  matchedBoltText.textContent = boltSelectionToText(lastBoltKit);
  if (Object.keys(lastBoltKit).length === 0) {
    document.getElementById("boltSelectionButtonAddID").disabled = true;
  } else {
    document.getElementById("boltSelectionButtonAddID").disabled = false;
  }
}

function lastBoltkitToTableFunc() {
  //Добовялем подобранный болткомплект в таблицу
  lastBoltkitToTable(lastBoltKit);
}
