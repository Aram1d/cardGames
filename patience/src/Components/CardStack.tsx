import { Box } from "@mantine/core";
import { Card } from "./Card";
import { CardEnum } from "../lib/cardMap";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useMatrixStore } from "../ErnestGame/matrixStore";

export type UsedCard = {
  card: CardEnum;
  isVisible: boolean;
};

type CardStackProps = {
  cards: UsedCard[];
  coordinates: [number, number];
};

export const CardStack = ({ cards, coordinates }: CardStackProps) => {
  const {
    isDragging,
    setNodeRef: setDraggableNodeRef,
    listeners,
    transform,
  } = useDraggable({
    id: coordinates.join("-"),
    attributes: {},
  });

  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id: coordinates.join("-"),
  });
  const { openCard } = useMatrixStore();
  const lastCard = cards[cards.length - 1];

  return (
    <Box
      ref={setDroppableNodeRef}
      {...(lastCard?.isVisible
        ? listeners
        : {
            onClick: () => openCard(coordinates),
          })}
      sx={{ position: "relative", width: 300, height: 400, cursor: "pointer" }}
    >
      {cards.map((u, index) => {
        const isLast = index + 1 === cards.length;

        return (
          <Card
            key={index}
            cardRef={isLast ? setDraggableNodeRef : undefined}
            card={isLast && u.isVisible ? u.card : CardEnum.rB}
            sx={(t) =>
              isLast
                ? {
                    position: "absolute",
                    left: 5 * (cards.length - 1) + (transform?.x ?? 0),
                    top: transform?.y ?? 0,
                    zIndex: isDragging ? 10000 : "inherit",
                    outline:
                      isOver && !isDragging
                        ? `${t.spacing.xs} solid ${t.colors.green[3]}`
                        : "none",
                  }
                : {
                    position: "absolute",
                    left: 5 * index,
                  }
            }
          />
        );
      })}
    </Box>
  );
};
