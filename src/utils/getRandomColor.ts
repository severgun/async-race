const COLOR_MAX = 0xffffff;
const MAX_LENGTH = 6;

export default function getRandomColorHex(): string {
  const randomColor = Math.floor(Math.random() * (COLOR_MAX + 1))
    .toString(16)
    .padStart(MAX_LENGTH, "0");
  return `#${randomColor}`;
}
