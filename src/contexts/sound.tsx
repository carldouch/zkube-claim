import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";
import React, { createContext, useState, useEffect } from "react";
import { useMusicPlayer } from "./hooks";
import { useAccount } from "@starknet-react/core";

const SoundPlayerContext = createContext({});

export function SoundPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setTheme, playStart, playOver } = useMusicPlayer();
  const [over, setOver] = useState(false);
  const [start, setStart] = useState(false);

  const { account } = useAccount();
  const { player } = usePlayer({ playerId: account?.address });
  const { game } = useGame({ gameId: player?.game_id, shouldLog: false });

  useEffect(() => {
    setTheme(!game || game.isOver());
  }, [game, over, setTheme]);

  // [Check] This is a useEffect hook that runs when the game is over
  useEffect(() => {
    if (!game && !start && !over) {
      setStart(false);
      setOver(true);
    } else if (game && !start && !over) {
      setStart(true);
      setOver(false);
    } else if (game && !start && over && !game.isOver()) {
      setStart(true);
      setOver(false);
      playStart();
    } else if (start && !over && (!game || game.isOver())) {
      setOver(true);
      setStart(false);
      playOver();
    }
  }, [game, start, over, playStart, playOver]);

  return (
    <SoundPlayerContext.Provider value={{}}>
      {children}
    </SoundPlayerContext.Provider>
  );
}