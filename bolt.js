let lastBoltSelection;

function boltSelection(diameter, package, numberOfNuts, gost) {
    let ourBolt;
    let ourBolts;
    let ourBoltGOSTname;
    for (let key in bolt){
        if (bolt[key].gost === gost){
            ourBolts = bolt[key][diameter];
            ourBoltGOSTname = bolt[key].nameGOST;
        }
    }
    for (let key in nut){
        if ("7798-70" === gost){
            ourNut = nut[key][diameter][0];
            ourNutGOSTname = nut[key].nameGOST;
            ourNut.gost = nut[key].gost;
        }
    }

    for (let key in flatWasher){
        if ("7798-70" === gost){
            ourFlatWasher = flatWasher[key][diameter][0];
            ourFlatWasherGOSTname = flatWasher[key].nameGOST;
            ourFlatWasher.gost = flatWasher[key].gost;
        }
    }

    for (let key in springWasher){
        if ("7798-70" === gost){
            ourSpringWasher = springWasher[key][diameter][0];
            ourSpringWasherGOSTname = springWasher[key].nameGOST;
            ourSpringWasher.gost = springWasher[key].gost;
        }
    }

    for (let key in ourBolts){
            if (ourBolts[key].notSlicedPart >= package + ourFlatWasher.height + ((numberOfNuts === 1) ? ourSpringWasher.height / 2 : 0)
            + ((numberOfNuts === 2) ? ourFlatWasher.height / 2 : 0)) {
                ourBolt = ((ourBolts[key] === undefined) ? ourBolts[key] : ourBolts[key-1]);
                ourBolt.gost = gost;
                ourBolt.nameGOST = ourBoltGOSTname;
                ourNut.nameGOST = ourNutGOSTname;
                return {bolt: ourBolt, diameter: diameter, package: package, flatWasher: ourFlatWasher, springWasher: ourSpringWasher, nut: ourNut, numberOfNuts: numberOfNuts,
                    threadOutput: Math.round((ourBolt.notSlicedPart - package - ourFlatWasher.height) * 100) / 100,
                    exitFromNut: ((numberOfNuts === 1) ? Math.round((ourBolt.length - package - ourFlatWasher.height - ourSpringWasher.height - ourNut.height) * 100) / 100 
                    : 0) + ((numberOfNuts === 2) ? Math.round((ourBolt.length - package - ourFlatWasher.height * 2 - ourNut.height * 2) * 100) / 100: 0) };
            };
    };
    return {};
};

function boltSelectionToText (boltSelection) {
    if (Object.keys(boltSelection).length === 0) {
        return "Не смоги подобрать болт, попробуйте выбрать диаметр побольше.";
    };
    let text = `Для пакета ${boltSelection.package}`;
    if (boltSelection.numberOfNuts == 1) {
        text = `${text} мм c одной гайкой, мы подобрали болт М`;
    };
    if (boltSelection.numberOfNuts == 2) {
        text = `${text} мм c двумя гайками, мы подобрали болт М`;
    };
    text = `${text}${boltSelection.diameter}x${boltSelection.bolt.length}`;
    if (!boltSelection.bolt.recommended){
        text = `${text} - не рекомендованый`;
    };
    if (boltSelection.threadOutput <= 0) {
        text = `${text}, резьба входит в пакет на ${-boltSelection.threadOutput}мм.`;
        if ((boltSelection.package / 4) < (-boltSelection.threadOutput)) {
            text = `${text} Уберем шайбу из под головы болта и резьба будет входить в пакет на ${-(boltSelection.threadOutput + boltSelection.flatWasher.height)}мм.`;
        };
    };
    if (boltSelection.threadOutput > 0) {
        text = `${text}, резьба выходит из пакета в шайбу на ${boltSelection.threadOutput}мм, но не страшно, толщина шайбы ${boltSelection.springWasher.height}мм, всё закрутится.`;
    };
    if (boltSelection.numberOfNuts == 2) {
        text = `${text} Резьба выходит из гайки на ${Math.round((boltSelection.exitFromNut / boltSelection.bolt.threadPitch) * 10) / 10} витк(а\\ов).` ;
    };
return text;
}


function boltSelectionStart () {
    
    let gostID = document.getElementById("gostID");
    let i = 0;
    for (let key in bolt){
        
        gostID.options[i] = new Option(bolt[key].gost);
        i++;
    }
    boltGOSTSelection ();
    let selectGOSTIndex = document.getElementById("gostID").options.selectedIndex;
    let selectGOST = document.getElementById("gostID").options[selectGOSTIndex].text;
    let selectboltIndex = document.getElementById("boltID").options.selectedIndex;
    let selectbolt = document.getElementById("boltID").options[selectboltIndex].text;
    let nutIndex = document.getElementById("nutID").options.selectedIndex;
    let nut = document.getElementById("nutID").options[nutIndex].text;
    let package = document.getElementById("packageID").value;
    lastBoltSelection = boltSelection(+selectbolt, +package, +nut, selectGOST);

}

function boltGOSTSelection () {
    let selectboltID = document.getElementById("boltID");
    let selectGOSTIndex = document.getElementById("gostID").options.selectedIndex;
    let selectGOST = document.getElementById("gostID").options[selectGOSTIndex].text;
    selectboltID.options.length = 0;
    i = 0;
    for (let key in bolt){
        if (bolt[key].gost === selectGOST) {
            for (let key2 in bolt[key]){
            selectboltID.options[i] = new Option(key2);
            i++;
            }
        }
    }
    selectboltID.options.length = selectboltID.options.length - 2;
}

function boltSelectionButtonclick () {
    let selectGOSTIndex = document.getElementById("gostID").options.selectedIndex;
    let selectGOST = document.getElementById("gostID").options[selectGOSTIndex].text;
    let selectboltIndex = document.getElementById("boltID").options.selectedIndex;
    let selectbolt = document.getElementById("boltID").options[selectboltIndex].text;
    let nutIndex = document.getElementById("nutID").options.selectedIndex;
    let nut = document.getElementById("nutID").options[nutIndex].text;
    let package = document.getElementById("packageID").value;
    let matchedBoltText = document.getElementById("matchedBoltID");
    matchedBoltText.width = window.innerWidth;
    lastBoltSelection = boltSelection(+selectbolt, +package, +nut, selectGOST);
    matchedBoltText.value = boltSelectionToText(boltSelection(+selectbolt, +package, +nut, selectGOST));
}

  function NutSelectionAddTable(){ //Добавляем  гайки
    let table = document.getElementById("tableHardwareID");
    let newRow = table.insertRow(-1);
    let newCell = newRow.insertCell(0);
    newCell.setAttribute("colspan", "3");
    newCell.appendChild(document.createTextNode(`Гайка М${lastBoltSelection.diameter}`));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    newCell.appendChild(document.createTextNode(document.getElementById("nutID").value));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    newCell.appendChild(document.createTextNode(`${Math.round(( lastBoltSelection.nut.weightX1000/1000))/1000}`));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    newCell.appendChild(document.createTextNode(lastBoltSelection.nut.gost));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    newCell.appendChild(document.createTextNode(table.rows[table.rows.length-2].cells[table.rows[table.rows.length-2].cells.length-3].innerHTML.split('.', 1)));
    newCell = newRow.insertCell(-1);
    input = document.createElement("INPUT");
    input.setAttribute("value","");
    input.setAttribute("style","width:92%; text-align:center");
    newCell.setAttribute("align", "center");
    newCell.appendChild(input);
    input = null;
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("style", "display:none");
    newCell.appendChild(document.createTextNode(`${lastBoltSelection.nut.weightX1000}`));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("style", "display:none");
    newCell.appendChild(document.createTextNode(document.getElementById("nutID").value));
  }

function boltSelectionAddTable () { //Добавляем  болт

    let table = document.getElementById("tableHardwareID");
    let input = document.createElement("INPUT");
    let newRow = table.insertRow(-1);
    let newCell = newRow.insertCell(0);
    newCell.setAttribute("colspan", "8");
    newCell.setAttribute("align", "center");
    input.setAttribute("style","width:99%; text-align:center");
    input.setAttribute("value","Комментарий к соединению");
    newCell.appendChild(input);
    input = null;
    newRow = table.insertRow(-1);
    newCell = newRow.insertCell(-1);
    newCell.appendChild(document.createTextNode(`Болт М${lastBoltSelection.diameter}`));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    newCell.appendChild(document.createTextNode(`${lastBoltSelection.package}`));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    if (lastBoltSelection.bolt.recommended === false){
    newCell.appendChild(document.createTextNode(`${lastBoltSelection.bolt.length}*`));
    }
    if (lastBoltSelection.bolt.recommended === true){
        newCell.appendChild(document.createTextNode(`${lastBoltSelection.bolt.length}`));
    }
    newCell = newRow.insertCell(-1);
    input = document.createElement("INPUT");
    input.setAttribute("value","1");
    input.setAttribute("style","width:92%; text-align:center");
    input.setAttribute("oninput", "recalculationMass()");
    newCell.setAttribute("align", "center");
    newCell.appendChild(input);
    input = null;
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    newCell.appendChild(document.createTextNode(`${Math.round((1 * lastBoltSelection.bolt.weightX1000/1000))/1000}`));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    newCell.appendChild(document.createTextNode(`${lastBoltSelection.bolt.gost}`));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    newCell.appendChild(document.createTextNode(document.getElementById("strengthClassID").value));
    newCell = newRow.insertCell(-1);
    input = document.createElement("INPUT");
    input.setAttribute("value","");
    input.setAttribute("style","width:92%; text-align:center");
    newCell.setAttribute("align", "center");
    newCell.appendChild(input);
    input = null;
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("style", "display:none");
    newCell.appendChild(document.createTextNode(`${lastBoltSelection.bolt.weightX1000}`));



}

function flatWasherSelectionAddTable () { // добавляем плоскую шайбу
    let table = document.getElementById("tableHardwareID");
    let input = document.createElement("INPUT");
    let newRow = table.insertRow(-1);
    let newCell = newRow.insertCell(0);
    newCell.setAttribute("colspan", "3");
    newCell.appendChild(document.createTextNode(`Шайба ${lastBoltSelection.diameter}`));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    newCell.appendChild(document.createTextNode(document.getElementById("nutID").value));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    newCell.appendChild(document.createTextNode(`${Math.round(( lastBoltSelection.flatWasher.weightX1000/1000))/1000}`));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    newCell.appendChild(document.createTextNode(lastBoltSelection.flatWasher.gost));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    newCell = newRow.insertCell(-1);
    input = document.createElement("INPUT");
    input.setAttribute("value","");
    input.setAttribute("style","width:92%; text-align:center");
    newCell.setAttribute("align", "center");
    newCell.appendChild(input);
    input = null;
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("style", "display:none");
    newCell.appendChild(document.createTextNode(`${lastBoltSelection.flatWasher.weightX1000}`));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("style", "display:none");
    newCell.appendChild(document.createTextNode(document.getElementById("nutID").value));
}

function springWasherSelectionAddTable () { //добавляем пружинную шайбу
    if (document.getElementById("nutID").value === "1") {
    let table = document.getElementById("tableHardwareID");
    let input = document.createElement("INPUT");
    let newRow = table.insertRow(-1);
    let newCell = newRow.insertCell(0);
    newCell.setAttribute("colspan", "3");
    newCell.appendChild(document.createTextNode(`Шайба пружинная ${lastBoltSelection.diameter}`));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    newCell.appendChild(document.createTextNode(document.getElementById("nutID").value));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    newCell.appendChild(document.createTextNode(`${Math.round(( lastBoltSelection.springWasher.weightX1000/1000))/1000}`));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    newCell.appendChild(document.createTextNode(lastBoltSelection.springWasher.gost));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("align", "center");
    newCell = newRow.insertCell(-1);
    input = document.createElement("INPUT");
    input.setAttribute("value","");
    input.setAttribute("style","width:92%; text-align:center");
    newCell.setAttribute("align", "center");
    newCell.appendChild(input);
    input = null;
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("style", "display:none");
    newCell.appendChild(document.createTextNode(`${lastBoltSelection.springWasher.weightX1000}`));
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("style", "display:none");
    newCell.appendChild(document.createTextNode(document.getElementById("nutID").value));
    }
}

function recalculationMass () { //перерасчитываем массу таблицы
    let table = document.getElementById("tableHardwareID");
    for (let r = 3; r<table.rows.length; r++ )
    {
        if (table.rows[r].cells[0].innerHTML.includes("Болт")){
            table.rows[r].cells[4].innerText = Math.round((+table.rows[r].cells[3].firstChild.value * +table.rows[r].cells[8].innerText))/1000;
            table.rows[r+1].cells[1].innerText = +table.rows[r].cells[3].firstChild.value * +table.rows[r+1].cells[7].innerText;
            table.rows[r+1].cells[2].innerText = Math.round((+table.rows[r].cells[3].firstChild.value * +table.rows[r+1].cells[7].innerText * +table.rows[r+1].cells[6].innerText))/1000;
            table.rows[r+2].cells[1].innerText = +table.rows[r].cells[3].firstChild.value * +table.rows[r+2].cells[7].innerText;
            table.rows[r+2].cells[2].innerText = Math.round((+table.rows[r].cells[3].firstChild.value * +table.rows[r+2].cells[7].innerText * +table.rows[r+2].cells[6].innerText))/1000;
            if (table.rows[r+1].cells[7].innerText === "1") {
                console.log(r);
                table.rows[r+3].cells[1].innerText = +table.rows[r].cells[3].firstChild.value * +table.rows[r+3].cells[7].innerText;
                table.rows[r+3].cells[2].innerText = Math.round((+table.rows[r].cells[3].firstChild.value * +table.rows[r+3].cells[7].innerText * +table.rows[r+3].cells[6].innerText))/1000;
            }
        }
    }
}

function boltSelectionButtonAddTable (){
    let button = document.getElementById("boltsTableExportExcelID");
    button.setAttribute("style", "display:inline");
    button = document.getElementById("progExportID");
    button.setAttribute("style", "display:inline");
    boltSelectionAddTable();
    NutSelectionAddTable();
    flatWasherSelectionAddTable();
    springWasherSelectionAddTable();
}

///



///
function boltsTableExport() {
    let tab_text = "<table border='2px'><tr bgcolor='#FFFFFF'>";
    let tab = document.getElementById('tableHardwareID');
   tab_text += tab.rows[0].innerHTML + "</tr>";
   tab_text += tab.rows[1].innerHTML + "</tr>";
    for (let r = 2; r < tab.rows.length; r++) {
        if (tab.rows[r].cells.length === 1){
            tab_text += "\n" + "<tr><td colspan=8 align=center>" + tab.rows[r].cells[0].firstChild.value + "</td></tr>";
            r++;
        }
        if (tab.rows[r].cells[0].innerHTML.includes("Болт")){
            tab_text += "\n" + "<tr><td>" + tab.rows[r].cells[0].innerText + "</td>";
            tab_text += "\n" + "<td align=center>" + tab.rows[r].cells[1].innerText + "</td>";
            tab_text += "\n" + "<td align=center>" + tab.rows[r].cells[2].innerText + "</td>";
            tab_text += "\n" + "<td align=center>" + tab.rows[r].cells[3].firstChild.value + "</td>";
            tab_text += "\n" + "<td align=center>" + tab.rows[r].cells[4].innerText.replace('.',',') + "</td>";
            tab_text += "\n" + "<td align=center>" + tab.rows[r].cells[5].innerText + "</td>";
            tab_text += "\n" + "<td align=center>" + " " + tab.rows[r].cells[6].innerText + "</td>";
            tab_text += "\n" + "<td>" + tab.rows[r].cells[7].firstChild.value + "</td></tr>";
            r++;
        }
        tab_text += "\n" + "<tr><td colspan=3>" + tab.rows[r].cells[0].innerText + "</td>";
        tab_text += "\n" + "<td align=center>" + tab.rows[r].cells[1].innerText + "</td>";
        tab_text += "\n" + "<td align=center>" + tab.rows[r].cells[2].innerText.replace('.',',') + "</td>";
        tab_text += "\n" + "<td align=center>" + tab.rows[r].cells[3].innerText + "</td>";
        tab_text += "\n" + "<td align=center>" + tab.rows[r].cells[4].innerText + "</td>";
        tab_text += "\n" + "<td>" + tab.rows[r].cells[5].firstChild.value + "</td></tr>";
        }
    tab_text += "</table>";
    if (document.getElementById("progExportID").value === "Excel") {
    let uri = 'data:application/vnd.ms-excel,';
    let a = document.createElement('a');
    a.setAttribute('href', uri + encodeURIComponent(tab_text));
    a.setAttribute('download', new Date() + '.xls');
    document.body.appendChild(a);
    a.click();
    }
    if (document.getElementById("progExportID").value === "Calc") {
        let uri = 'data:application/scalc,';
        let a = document.createElement('a');
        a.setAttribute('href', uri + encodeURIComponent(tab_text));
        a.setAttribute('download', new Date() + '.ods');
        document.body.appendChild(a);
        a.click();
        }
  }


///

boltSelectionStart();