import { CardEnum } from "../lib/cardMap";

export function parseCoordinates(coord: string) {
  const coordArray = coord
    .split("-")
    .slice(0, 2)
    .map((c) => {
      const parsed = parseInt(c);
      if (!Number.isInteger(parsed))
        throw new Error("wrong coordinates string given");
      return parsed;
    });

  if (!(coordArray.length === 2))
    throw new Error("wrong coordinates string given");
  return coordArray as [number, number];
}

export function getCardSet(hard: boolean) {
  if (hard)
    return Object.values(CardEnum).filter(
      (c) => ![CardEnum.rB, CardEnum.bB].includes(c)
    );
  const filterSet = new Set(["7", "8", "9", "10", "j", "q", "k", "a"]);
  return Object.values(CardEnum).filter((c) => filterSet.has(c.substring(1)));
}

export function isCardHigherThan(card: CardEnum, than: CardEnum) {
  const order = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "j",
    "q",
    "k",
    "a",
  ];
  return (
    card.at(0) === than.at(0) &&
    order.indexOf(card.substring(1)) > order.indexOf(than.substring(1))
  );
}
