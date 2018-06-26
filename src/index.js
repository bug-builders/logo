import Two from 'two.js/build/two';
import Chance from 'chance';

const chance = new Chance();

const size = 100;
const offsetSize = size * 2;
const polygonSides = 5;
const pathCount = 10;
const pathStrokeWidth = 20;
const textValue = 'Bug Builders.';

// utils
Math.lerp = (value1, value2, amount) => value1 + (value2 - value1) * amount;

window.onload = () => {
  const two = new Two({
    fullscreen: true,
    autostart: true,
  }).appendTo(document.body);
  const bg = two.makePolygon(0, 0, size, polygonSides);
  bg.fill = '#324D5C';
  const fg = two.makePolygon(0, 0, size, polygonSides);
  const paths = [];
  for (let i = 0; i < pathCount; i += 1) {
    const angle = (i / pathCount) * (2 * Math.PI);
    const pointsStart = [
      Math.cos(angle) * offsetSize,
      Math.sin(angle) * offsetSize,
    ];
    const pointsEnd = [
      Math.cos(angle + Math.PI) * offsetSize,
      Math.sin(angle + Math.PI) * offsetSize,
    ];
    const pointsMiddle = [];
    const amountOfTurns = chance.integer({ min: 3, max: 10 });
    for (let t = 0; t < amountOfTurns; t += 1) {
      const turnOffsetRadius = chance.floating({
        min: size / 10.0,
        max: size / 5.0,
      });
      const turnAngle = chance.floating({ min: 0, max: 2 * Math.PI });

      pointsMiddle.push(
        Math.lerp(pointsStart[0], pointsEnd[0], t / amountOfTurns) +
          Math.cos(turnAngle) * turnOffsetRadius,
      );
      pointsMiddle.push(
        Math.lerp(pointsStart[1], pointsEnd[1], t / amountOfTurns) +
          Math.sin(turnAngle) * turnOffsetRadius,
      );
    }
    const line = two.makeCurve(
      ...pointsStart,
      ...pointsMiddle,
      ...pointsEnd,
      true,
    );
    line.noFill();
    line.stroke = '#F0CA4D';
    line.linewidth = chance.floating({
      min: pathStrokeWidth / 2.0,
      max: pathStrokeWidth * 2.0,
    });
    paths.push(line);
  }
  const group = two.makeGroup(...paths);
  group.mask = fg;
  const fgStroke = two.makePolygon(0, 0, size, polygonSides);
  fgStroke.noFill();
  fgStroke.linewidth = 20;
  fgStroke.stroke = '#46B29D';

  const styles = {
    family: 'Anton, sans-serif',
    size: 150,
  };
  const text = two.makeText(textValue, offsetSize * 1.25, 0, styles);
  text.alignment = 'left';
  text.fill = '#333';

  const visual = two.makeGroup(bg, group, fgStroke, text);
  visual.scale = 0.5;
  visual.translation.x = two.width / 2;
  visual.translation.y = two.height / 2;

  let fuzz = false;

  two.bind('update', frameCount => {
    fg.rotation = bg.rotation = fgStroke.rotation =
      (frameCount / 500) * Math.PI;
    if (fuzz) {
      const title = text.value;
      const titleSplit = [...title];
      const letterIndex = chance.integer({
        min: 0,
        max: title.length,
      });
      const replacedLetterIndex = chance.integer({
        min: 0,
        max: title.length,
      });
      const letter = title[letterIndex];
      const tmpLetter = title[replacedLetterIndex];
      titleSplit[letterIndex] = tmpLetter;
      titleSplit[replacedLetterIndex] = letter;
      text.value = titleSplit.join('');
    } else {
      text.value = textValue;
    }
    fuzz = frameCount % 60 === 0 ? !fuzz : fuzz;
  });
};
