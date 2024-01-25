import React from "react";
import {
  Card as MantineCard,
  CardProps as MantineCardProps,
} from "@mantine/core";
import { cardMap, CardEnum } from "../lib/cardMap";
import { forwardSx } from "../lib/helpers";

type CardProps = {
  card: CardEnum;
  cardRef?: (
    instance: HTMLDivElement | null
  ) => void | React.RefObject<HTMLDivElement> | null | undefined;
} & Omit<MantineCardProps, "children">;

export const Card = ({ card, sx, cardRef }: CardProps) => {
  return (
    <MantineCard
      ref={cardRef}
      radius="lg"
      withBorder
      sx={[
        (t) => ({
          "&&": { border: `1px solid ${t.colors.gray[6]} ` },
        }),
        ...forwardSx(sx),
      ]}
    >
      {cardMap.get(card)}
    </MantineCard>
  );
};
