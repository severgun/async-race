const carBrands = [
  "CLAAS",
  "Terrion",
  "MTZ",
  "Caterpillar",
  "Steyr",
  "John Deere",
  "Komatsu",
  "Lamborghini",
  "Mahindra",
  "TYM",
];

const carModels = [
  "ARION",
  "ATM 7360",
  "Belarus",
  "420",
  "Terrus CVT",
  "6195M",
  "WB97S-8",
  "Spark R",
  "NOVO 755 DI",
  "T1104",
];

export default function getRandomCarName(): string {
  const brand = carBrands[Math.floor(Math.random() * carBrands.length)];
  const model = carModels[Math.floor(Math.random() * carModels.length)];

  return `${brand} ${model}`;
}
