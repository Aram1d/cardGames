import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { shuffle, chunk, flatMapDeep, flatMap, compact } from "lodash-es";

import { getCardSet, isCardHigherThan } from "./helpers";
import { UsedCard } from "../Components/CardStack";

const mkEmptyMatrix = () => [
  [[], [], [], []],
  [[], [], [], []],
  [[], [], [], []],
];

type Coordinates = [number, number];

type GameStats = {
  won: number;
  lost: number;
  actualWonChain: number;
  longestWonChain: number;
};

type MatrixStore = {
  matrix: UsedCard[][][];
  newGame: (hard: boolean) => void;
  initialCardCount: number;
  computeStats: () => {
    remainingCardsCount: number;
    initialCardCount: number;
    wonGame: boolean;
    lostGame: boolean;
  };
  handleMove: (movedCardCoord: Coordinates, movedToCoord: Coordinates) => void;
  openCard: (coordinates: Coordinates) => void;
  stats: GameStats;
};

export const useMatrixStore = create<MatrixStore>()(
  persist(
    immer<MatrixStore>((set, get) => {
      const computeStats = (state?: MatrixStore) => {
        const { matrix, initialCardCount } = state || get();
        const remainingCards = flatMapDeep(matrix);
        const remainingCardsCount = remainingCards.length - 4;

        console.log(flatMap(matrix).length);

        return {
          remainingCardsCount,
          initialCardCount: initialCardCount - 4,
          wonGame: !remainingCardsCount,
          lostGame:
            flatMap(matrix).filter((c) => Boolean(c.length)).length === 4 &&
            remainingCards.length > 4,
        };
      };

      const updateStats = (state: MatrixStore) => {
        const { wonGame, lostGame } = computeStats(state);
        if (wonGame) {
          state.stats.won++;
          state.stats.actualWonChain++;
          if (state.stats.actualWonChain > state.stats.longestWonChain)
            state.stats.longestWonChain = state.stats.actualWonChain;
        }
        if (lostGame) {
          state.stats.lost++;
          state.stats.actualWonChain = 0;
        }
      };

      return {
        matrix: mkEmptyMatrix(),
        initialCardCount: 0,

        stats: {
          won: 0,
          lost: 0,
          actualWonChain: 0,
          longestWonChain: 0,
        },

        computeStats,

        getCell: (line: number, col: number) => get().matrix[line][col],

        openCard: (coordinates) => {
          set((state) => {
            const slot = state.matrix[coordinates[0]][coordinates[1]];
            slot[slot.length - 1].isVisible = true;
          });
        },

        handleMove: (movedCardCoord, movedToCoord) => {
          set((state) => {
            const { matrix } = state;
            const movedFromSlot = matrix[movedCardCoord[0]][movedCardCoord[1]];
            const movedToSlot = matrix[movedToCoord[0]][movedToCoord[1]];

            const movedCard = movedFromSlot[movedFromSlot.length - 1].card;
            const movedToCard = movedToSlot[movedToSlot.length - 1].card;

            if (isCardHigherThan(movedCard, movedToCard)) {
              movedFromSlot.pop();
              movedToSlot[movedToSlot.length - 1].card = movedCard;
            }
            updateStats(state);
          });
        },

        newGame: (hard: boolean) => {
          set((draft) => {
            draft.matrix = mkEmptyMatrix();

            const newGameSet = shuffle(getCardSet(hard));
            draft.initialCardCount = newGameSet.length;

            const chunkedGameSet = chunk(
              newGameSet.map((card, index) => ({
                card,
                isVisible:
                  newGameSet.length - index <=
                  draft.matrix.length * draft.matrix[0].length,
              })),
              4
            );

            chunkedGameSet.forEach((chunk, index) => {
              draft.matrix[index % 3] = draft.matrix[index % 3].map(
                (prev, i) => [...prev, chunk[i]]
              );
            });
          });
        },
      };
    }),
    {
      name: "patience",
      partialize: (s) => {
        const { initialCardCount, matrix, stats } = s;
        return { initialCardCount, matrix, stats };
      },
    }
  )
);
