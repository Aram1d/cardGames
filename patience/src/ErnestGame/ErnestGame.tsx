import React from "react";
import { Box, Button, Group, Progress, Stack, Text } from "@mantine/core";
import { DndContext } from "@dnd-kit/core";

import { CardStack } from "../Components/CardStack";
import { useMatrixStore } from "./matrixStore";
import { parseCoordinates } from "./helpers";

export const ErnestGame = () => {
  const { matrix, newGame, handleMove, computeStats, stats } = useMatrixStore();
  const { remainingCardsCount, initialCardCount, wonGame, lostGame } =
    computeStats();

  return (
    <Stack>
      <Group>
        <Button onClick={() => newGame(false)}>New Game</Button>
        <Button onClick={() => newGame(true)}>New Game (full set)</Button>
        <Box sx={{ flexGrow: 1 }}>
          <Text>
            Won: {stats.won} Total: {stats.won + stats.lost} actual/longest
            wonChain: {stats.actualWonChain} / {stats.longestWonChain}
          </Text>
        </Box>
        {wonGame || lostGame ? (
          <Text color={wonGame ? "green" : "red"} fz="lg" fw={500}>
            {wonGame ? "You won! :)" : "You loose :("}
          </Text>
        ) : (
          <Box w="300px">
            <Progress
              size="xl"
              label={
                remainingCardsCount / initialCardCount < 0.8
                  ? `${remainingCardsCount} / ${initialCardCount}`
                  : undefined
              }
              value={100 * (1 - remainingCardsCount / initialCardCount)}
            />
          </Box>
        )}
      </Group>
      <DndContext
        onDragEnd={(e) => {
          handleMove(
            parseCoordinates(String(e.active.id)),
            parseCoordinates(String(e.over?.id))
          );
        }}
      >
        <Stack>
          {matrix.map((row, rowIndex) => (
            <Group key={rowIndex}>
              {row.map((cells, cellIndex) => (
                <CardStack
                  cards={cells}
                  key={cellIndex}
                  coordinates={[rowIndex, cellIndex]}
                />
              ))}
            </Group>
          ))}
        </Stack>
      </DndContext>
    </Stack>
  );
};
