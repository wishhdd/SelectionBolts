import {
  gost779870,
  gost591570,
  gost1137178,
  gost640270,
} from "./hardware/7798-70.js";
import {
  gost526442006,
  gost526452006,
  gost526462006,
} from "./hardware/52644-2006.js";
import {
  gost3248432014B,
  gost3248432014N,
  gost324845,
} from "./hardware/32484.3-2014.js";
import {
  gost3248442014B,
  gost3248442014N,
  gost324846,
} from "./hardware/32484.4-2014.js";
const bolt = { gost779870, gost526442006, gost3248432014B, gost3248442014B };
const nut = { gost591570, gost526452006, gost3248432014N, gost3248442014N };
const flatWasher = { gost1137178, gost526462006, gost324845, gost324846 };
const springWasher = { gost640270 };

function nutSelection(boltGost, boltDiameter, gostNuts) {
  // Выбираем гайку
  let ourNut;
  for (let key in gostNuts) {
    if (gostNuts[key].complianceWithBolt === boltGost) {
      ourNut = gostNuts[key][boltDiameter][0];
      ourNut.diameter = boltDiameter;
      ourNut.gost = gostNuts[key].gost;
      break;
    }
  }
  return { ourNut };
}

function flatWasherSelection(boltGost, boltDiameter, gostFlatWasher) {
  // Выбираем плоскую шайбу
  let ourFlatWasher;
  for (let key in gostFlatWasher) {
    if (gostFlatWasher[key].complianceWithBolt === boltGost) {
      ourFlatWasher = gostFlatWasher[key][boltDiameter][0];
      ourFlatWasher.gost = gostFlatWasher[key].gost;
      ourFlatWasher.diameter = boltDiameter;
      break;
    }
  }
  return { ourFlatWasher };
}

function springWasherSelection(boltGost, boltDiameter, gostSpringWasher) {
  // Выбираем пружиную шайбу
  let ourSpringWasher;
  for (let key in gostSpringWasher) {
    if (gostSpringWasher[key].complianceWithBolt === boltGost) {
      ourSpringWasher = gostSpringWasher[key][boltDiameter][0];
      ourSpringWasher.gost = gostSpringWasher[key].gost;
      ourSpringWasher.diameter = boltDiameter;
      break;
    }
  }
  return { ourSpringWasher };
}

export function cutBoltSelection(
  boltGost,
  boltDiameter,
  numberOfNuts,
  packageThickness
) {
  // Подбираем болт на срез
  let ourBoltKit;
  let ourBolts;
  let ourBolt;
  ourBoltKit = Object.assign(
    flatWasherSelection(boltGost, boltDiameter, flatWasher),
    nutSelection(boltGost, boltDiameter, nut)
  );
  ourBoltKit.ourNut.count = +numberOfNuts;
  let ourPackageThickness =
    +packageThickness + +ourBoltKit.ourFlatWasher.height;
  for (let key in bolt) {
    if (bolt[key].gost === boltGost) {
      ourBolts = bolt[key][boltDiameter];
      ourBolts.springWasher = bolt[key].springWasher;
      break;
    }
  }
  if (+numberOfNuts === 1 && ourBolts.springWasher === true) {
    // если разршена пружиная шайба и одна гайка
    ourBoltKit = Object.assign(
      ourBoltKit,
      springWasherSelection(boltGost, boltDiameter, springWasher)
    );
    ourPackageThickness =
      +ourPackageThickness + +ourBoltKit.ourSpringWasher.height;
    ourBoltKit.ourSpringWasher.count = 1;
    ourBoltKit.ourFlatWasher.count = 1;
  } else {
    // все остальные случаи
    ourPackageThickness =
      +ourPackageThickness + +ourBoltKit.ourFlatWasher.height;
    ourBoltKit.ourFlatWasher.count = 2;
  }
  let flag = true;
  for (let key in ourBolts) {
    // подбираем болт
    if (ourBolts[key].notSlicedPart >= ourPackageThickness) {
      ourBolt = ourBolts[key - 1];
      flag = false;
      break;
    }
  }
  if (flag) {
    ourBolt = ourBolts[ourBolts.length - 1];
  }
  if (ourBolt === undefined) {
    // проверякм что болт подобрался
    return {};
  }
  ourBolt.gost = boltGost;
  ourBolt.diameter = boltDiameter;
  if (ourBoltKit.ourSpringWasher === undefined) {
    // выход резьбы без пружинной шайбы
    ourBolt.exitFromNut =
      ourBolt.length -
      packageThickness -
      ourBoltKit.ourFlatWasher.height * ourBoltKit.ourFlatWasher.count -
      ourBoltKit.ourNut.height * ourBoltKit.ourNut.count;
  } else {
    // выход резьбы с пружинной шайбы
    ourBolt.exitFromNut =
      ourBolt.length -
      packageThickness -
      ourBoltKit.ourSpringWasher.height * ourBoltKit.ourSpringWasher.count -
      ourBoltKit.ourFlatWasher.height * ourBoltKit.ourFlatWasher.count -
      ourBoltKit.ourNut.height * ourBoltKit.ourNut.count;
  }
  ourBoltKit = Object.assign(ourBoltKit, { ourBolt });
  ourBoltKit.packageThickness = +packageThickness;
  ourBoltKit.ourBolt.threadOutput =
    Math.round(
      (+ourBolt.notSlicedPart -
        +packageThickness -
        +ourBoltKit.ourFlatWasher.height) *
        10
    ) / 10; // если минус то резьба входит в пакет
  if (ourBolt.exitFromNut >= ourBolt.threadPitch * 2) {
    return ourBoltKit;
  }
  return {};
}

export function stretchingBoltSelection(
  boltGost,
  boltDiameter,
  numberOfNuts,
  packageThickness
) {
  // Подбираем болт на растяжение
  let ourBoltKit;
  let ourBolts;
  let ourBolt;
  ourBoltKit = Object.assign(
    flatWasherSelection(boltGost, boltDiameter, flatWasher),
    nutSelection(boltGost, boltDiameter, nut)
  );
  ourBoltKit.ourNut.count = +numberOfNuts;
  let ourPackageThickness =
    +packageThickness + +ourBoltKit.ourFlatWasher.height;
  for (let key in bolt) {
    if (bolt[key].gost === boltGost) {
      ourBolts = bolt[key][boltDiameter];
      ourBolts.springWasher = bolt[key].springWasher;
      break;
    }
  }

  if (+numberOfNuts === 1 && ourBolts.springWasher === true) {
    // если разршена пружиная шайба и одна гайка
    ourBoltKit = Object.assign(
      ourBoltKit,
      springWasherSelection(boltGost, boltDiameter, springWasher)
    );
    ourPackageThickness =
      +ourPackageThickness + +ourBoltKit.ourSpringWasher.height;
    ourBoltKit.ourSpringWasher.count = 1;
    ourBoltKit.ourFlatWasher.count = 1;
  } else {
    // все остальные случаи
    ourPackageThickness =
      +ourPackageThickness + +ourBoltKit.ourFlatWasher.height;
    ourBoltKit.ourFlatWasher.count = 2;
  }
  for (let key in ourBolts) {
    // подбираем болт
    if (
      ourBolts[key].length >=
      +ourPackageThickness +
        +ourBoltKit.ourNut.count * +ourBoltKit.ourNut.height +
        2 * ourBolts[key].threadPitch
    ) {
      ourBolt = ourBolts[key];
      break;
    }
  }
  if (ourBolt === undefined) {
    // проверякм что болт подобрался
    return {};
  }
  ourBolt.gost = boltGost;
  ourBolt.diameter = boltDiameter;
  if (ourBoltKit.ourSpringWasher === undefined) {
    // выход резьбы без пружинной шайбы
    ourBolt.exitFromNut =
      ourBolt.length -
      packageThickness -
      ourBoltKit.ourFlatWasher.height * ourBoltKit.ourFlatWasher.count -
      ourBoltKit.ourNut.height * ourBoltKit.ourNut.count;
  } else {
    // выход резьбы с пружинной шайбы
    ourBolt.exitFromNut =
      ourBolt.length -
      packageThickness -
      ourBoltKit.ourSpringWasher.height * ourBoltKit.ourSpringWasher.count -
      ourBoltKit.ourFlatWasher.height * ourBoltKit.ourFlatWasher.count -
      ourBoltKit.ourNut.height * ourBoltKit.ourNut.count;
  }
  ourBoltKit = Object.assign(ourBoltKit, { ourBolt });
  ourBoltKit.packageThickness = +packageThickness;
  ourBoltKit.ourBolt.threadOutput =
    Math.round(
      (+ourBolt.notSlicedPart -
        +packageThickness -
        +ourBoltKit.ourFlatWasher.height) *
        10
    ) / 10; // если минус то резьба входит в пакет
  if (ourBoltKit.ourBolt.threadOutput > ourBoltKit.ourFlatWasher.height) {
    // проверяем что пакет не стучит
    return {};
  }
  if (ourBolt.exitFromNut >= ourBolt.threadPitch * 2) {
    return ourBoltKit;
  }
  return {};
}

export function boltSelectionToText(boltSelection) {
  //пишем подобраный болт текстом
  if (Object.keys(boltSelection).length === 0) {
    return "Не смог подобрать болт, попробуйте что то поменять.";
  }
  let text = `Для пакета ${boltSelection.packageThickness}`;
  if (boltSelection.ourNut.count == 1) {
    text = `${text} мм c одной гайкой, мы подобрали болт М`;
  }
  if (boltSelection.ourNut.count == 2) {
    text = `${text} мм c двумя гайками, мы подобрали болт М`;
  }
  text = `${text}${boltSelection.ourBolt.diameter}x${boltSelection.ourBolt.length}`;
  if (!boltSelection.ourBolt.recommended) {
    text = `${text} - не рекомендованый`;
  }
  if (boltSelection.ourBolt.threadOutput <= 0) {
    text = `${text}, резьба входит в пакет на ${-boltSelection.ourBolt
      .threadOutput}мм.`;
  }
  if (boltSelection.ourBolt.threadOutput > 0) {
    if (boltSelection.ourSpringWasher === undefined) {
      text = `${text}, резьба выходит из пакета в шайбу на ${boltSelection.ourBolt.threadOutput}мм, но не страшно, толщина шайбы ${boltSelection.ourFlatWasher.height}мм, всё закрутится.`;
    } else {
      text = `${text}, резьба выходит из пакета в шайбу на ${boltSelection.ourBolt.threadOutput}мм, но не страшно, толщина шайбы ${boltSelection.ourSpringWasher.height}мм, всё закрутится.`;
    }
  }
  text = `${text} Резьба выходит из гайки на ${
    Math.round(
      (boltSelection.ourBolt.exitFromNut / boltSelection.ourBolt.threadPitch) *
        10
    ) / 10
  } витк(а\\ов).`;
  return text;
}
