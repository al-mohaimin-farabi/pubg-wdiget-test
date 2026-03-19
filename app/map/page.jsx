"use client";

import React, { useState, useEffect, useRef } from "react";

// --- CONFIGURATION ---
const CANVAS_SIZE = 1080;

// We attach the max in-game coordinate size to each map for dynamic scaling.
// Erangel/Miramar = 8x8km, Vikendi = 6x6km, Sanhok = 4x4km
const MAPS = {
  Erangel: {
    // FOR PRODUCTION: Change this to src: "/Erangel_Main_High_Res.png" (your public folder)
    src: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Erangel_Main_Low_Res.png",
    name: "Erangel",
    size: 800000,
  },
  Miramar: {
    // FOR PRODUCTION: Change this to src: "/Miramar_Main_High_Res.png"
    src: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Miramar_Main_Low_Res.png",
    name: "Miramar",
    size: 800000,
  },
  Vikendi: {
    src: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Vikendi_Main_Low_Res.png",
    name: "Vikendi",
    size: 600000,
  },
  Sanhok: {
    src: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Sanhok_Main_Low_Res.png",
    name: "Sanhok",
    size: 400000,
  },
};

const INITIAL_STATE = {
  mapType: "Erangel",
  TotalPlayerList: [
    {
      uId: 1,
      playerName: "waveREAPER7",
      teamId: 6,
      location: { x: 400000, y: 400000, z: 0 },
      bHasDied: false,
    },
    {
      uId: 2,
      playerName: "iVoidReign",
      teamId: 6,
      location: { x: 415000, y: 405000, z: 0 },
      bHasDied: false,
    },
    {
      uId: 3,
      playerName: "TLS_Sniper",
      teamId: 8,
      location: { x: 250000, y: 600000, z: 0 },
      bHasDied: false,
    },
  ],
  ZoneState: {
    SafeZone: { x: 350000, y: 420000, radius: 150000 },
    BlueZone: { x: 400000, y: 400000, radius: 280000 },
    RedZone: { x: 550000, y: 200000, radius: 40000 },
  },
  FlightPath: {
    isActive: true,
    startX: 150000,
    startY: 50000,
    endX: 650000,
    endY: 750000,
  },
};

export default function PubgMapSimulator() {
  const [simulatorState, setSimulatorState] = useState(INITIAL_STATE);
  const gameStateRef = useRef(simulatorState);
  const canvasRef = useRef(null);
  const imagesRef = useRef({});
  const requestRef = useRef();

  // Sync React state to our fast-updating Ref
  useEffect(() => {
    gameStateRef.current = simulatorState;
  }, [simulatorState]);

  // Pre-load map images into browser memory
  useEffect(() => {
    Object.keys(MAPS).forEach((key) => {
      const img = new Image();
      // To prevent CORS issues when drawing images from URLs onto a canvas
      img.crossOrigin = "Anonymous";
      img.src = MAPS[key].src;
      imagesRef.current[key] = img;
    });
  }, []);

  // =========================================================================
  // CANVAS RENDERING ENGINE
  // =========================================================================
  const renderLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const state = gameStateRef.current;

    // =======================================================================
    // THE CRITICAL MATH: CALCULATING THE SCALE MAP RATIO
    // =======================================================================
    // 1. We need to know how big the map is in the raw Game Data.
    // Example: Erangel is an 8x8km map. PCOB sends coordinates from 0 to 800,000.
    const currentMapSize = MAPS[state.mapType]?.size || 800000;

    // 2. We need to know how big our HTML Canvas is in pixels.
    // In our app, CANVAS_SIZE is set to 1080 pixels.

    // 3. We calculate the "Scale Factor" (or Ratio).
    // Formula: Canvas Pixels / Game Units
    // Example for Erangel: 1080 / 800000 = 0.00135
    // This means 1 In-Game Unit equals 0.00135 Pixels on our screen.
    const scale = CANVAS_SIZE / currentMapSize;

    // 1. CLEAR PREVIOUS FRAME
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. DRAW MAP IMAGE
    const currentMapImg = imagesRef.current[state.mapType];
    if (currentMapImg && currentMapImg.complete) {
      ctx.drawImage(currentMapImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }

    // 3. HELPER FUNCTION TO DRAW ZONES
    const drawZone = (
      zone,
      strokeColor,
      fillColor,
      lineWidth,
      isDashed = false,
    ) => {
      ctx.beginPath();

      // APPLYING THE MATH TO CIRCLES:
      // We multiply the raw game X, Y, and Radius by our Scale Factor.
      const pixelX = zone.x * scale;
      const pixelY = zone.y * scale;
      const pixelRadius = zone.radius * scale;

      ctx.arc(pixelX, pixelY, pixelRadius, 0, 2 * Math.PI);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeColor;

      if (isDashed) ctx.setLineDash([10, 10]);
      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // Draw Zones
    drawZone(
      state.ZoneState.RedZone,
      "rgba(255,0,0,0.8)",
      "rgba(255,0,0,0.3)",
      2,
    );
    drawZone(
      state.ZoneState.BlueZone,
      "rgba(0,100,255,0.8)",
      "rgba(0,50,255,0.1)",
      3,
    );
    drawZone(state.ZoneState.SafeZone, "#ffffff", null, 3);

    // 4. DRAW FLIGHT PATH
    if (state.FlightPath.isActive) {
      ctx.beginPath();

      // APPLYING THE MATH TO LINES:
      // Multiply start and end Game Coordinates by the Scale Factor
      ctx.moveTo(
        state.FlightPath.startX * scale,
        state.FlightPath.startY * scale,
      );
      ctx.lineTo(state.FlightPath.endX * scale, state.FlightPath.endY * scale);

      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ffff00";
      ctx.setLineDash([15, 10]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 5. DRAW PLAYERS
    state.TotalPlayerList.forEach((player) => {
      if (player.bHasDied) return;

      // =====================================================================
      // PINPOINT PLAYER POSITION MATH
      // =====================================================================
      const px = player.location.x * scale;
      const py = player.location.y * scale;

      // Draw Player Dot exactly at (px, py)
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, 2 * Math.PI);
      ctx.fillStyle = player.teamId === 6 ? "#00ffff" : "#ff3366";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000000";
      ctx.stroke();

      // Draw Player Name Text next to the dot
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px Arial";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // We offset the text by +12 pixels on X, and +4 on Y so it doesn't cover the dot
      ctx.fillText(player.playerName, px + 12, py + 4);

      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    });

    requestRef.current = requestAnimationFrame(renderLoop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // --- UI Update Handlers (For the Simulator only) ---
  const updatePlayerPos = (index, axis, value) => {
    const newState = { ...simulatorState };
    newState.TotalPlayerList[index].location[axis] = parseInt(value);
    setSimulatorState(newState);
  };

  const updateZone = (zoneName, prop, value) => {
    const newState = { ...simulatorState };
    newState.ZoneState[zoneName][prop] = parseInt(value);
    setSimulatorState(newState);
  };

  // Dynamically scale mock data when map changes so things don't go off-screen
  const handleMapChange = (e) => {
    const newMapType = e.target.value;
    const oldMapSize = MAPS[simulatorState.mapType].size;
    const newMapSize = MAPS[newMapType].size;
    const ratio = newMapSize / oldMapSize;

    const newState = { ...simulatorState, mapType: newMapType };

    // Scale players relative to new map size
    newState.TotalPlayerList = newState.TotalPlayerList.map((p) => ({
      ...p,
      location: {
        ...p.location,
        x: Math.round(p.location.x * ratio),
        y: Math.round(p.location.y * ratio),
      },
    }));

    // Scale zones relative to new map size
    const scaleZone = (zone) => ({
      x: Math.round(zone.x * ratio),
      y: Math.round(zone.y * ratio),
      radius: Math.round(zone.radius * ratio),
    });
    newState.ZoneState = {
      SafeZone: scaleZone(newState.ZoneState.SafeZone),
      BlueZone: scaleZone(newState.ZoneState.BlueZone),
      RedZone: scaleZone(newState.ZoneState.RedZone),
    };

    // Scale flight path relative to new map size
    newState.FlightPath = {
      ...newState.FlightPath,
      startX: Math.round(newState.FlightPath.startX * ratio),
      startY: Math.round(newState.FlightPath.startY * ratio),
      endX: Math.round(newState.FlightPath.endX * ratio),
      endY: Math.round(newState.FlightPath.endY * ratio),
    };

    setSimulatorState(newState);
  };

  // Dynamically restrict slider max values based on map size
  const currentMapUnits = MAPS[simulatorState.mapType]?.size || 800000;

  return (
    <div className="flex h-screen overflow-hidden font-sans text-white">
      {/* LEFT SIDE: Control Panel */}
      <div className="flex w-87.5 shrink-0 flex-col gap-6 overflow-y-auto border-r border-neutral-700 bg-neutral-800 p-6">
        <div>
          <h1 className="mb-1 text-xl font-bold text-blue-400">
            PCOB Simulator
          </h1>
          <p className="text-xs text-neutral-400">
            Drag sliders to test Canvas
          </p>
        </div>

        {/* Map Select */}
        <div className="rounded-lg bg-neutral-900 p-4">
          <label className="mb-2 block text-sm font-semibold text-neutral-300">
            Active Map
          </label>
          <select
            className="w-full rounded border border-neutral-600 bg-neutral-700 p-2 text-sm text-white outline-none"
            value={simulatorState.mapType}
            onChange={handleMapChange}
          >
            <option value="Erangel">Erangel (8x8km)</option>
            <option value="Miramar">Miramar (8x8km)</option>
            <option value="Vikendi">Vikendi (6x6km)</option>
            <option value="Sanhok">Sanhok (4x4km)</option>
          </select>
        </div>

        {/* Zone Controls */}
        <div className="flex flex-col gap-4 rounded-lg bg-neutral-900 p-4">
          <h3 className="border-b border-neutral-700 pb-2 text-sm font-semibold text-neutral-300">
            Zone Controls
          </h3>

          {/* Blue Zone */}
          <div className="rounded bg-neutral-800 p-3">
            <span className="text-xs font-bold text-blue-400">Blue Zone</span>
            <div className="mt-2">
              <label className="text-[10px] text-neutral-400">Radius</label>
              <input
                type="range"
                min="0"
                max={currentMapUnits}
                step="1000"
                className="w-full accent-blue-500"
                value={simulatorState.ZoneState.BlueZone.radius}
                onChange={(e) =>
                  updateZone("BlueZone", "radius", e.target.value)
                }
              />
            </div>
            <div className="mt-1 flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] text-neutral-400">X</label>
                <input
                  type="range"
                  min="0"
                  max={currentMapUnits}
                  step="1000"
                  className="w-full accent-blue-500"
                  value={simulatorState.ZoneState.BlueZone.x}
                  onChange={(e) => updateZone("BlueZone", "x", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-neutral-400">Y</label>
                <input
                  type="range"
                  min="0"
                  max={currentMapUnits}
                  step="1000"
                  className="w-full accent-blue-500"
                  value={simulatorState.ZoneState.BlueZone.y}
                  onChange={(e) => updateZone("BlueZone", "y", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Safe Zone */}
          <div className="rounded bg-neutral-800 p-3">
            <span className="text-xs font-bold text-white">Safe Zone</span>
            <div className="mt-2">
              <label className="text-[10px] text-neutral-400">Radius</label>
              <input
                type="range"
                min="0"
                max={currentMapUnits}
                step="1000"
                className="w-full accent-white"
                value={simulatorState.ZoneState.SafeZone.radius}
                onChange={(e) =>
                  updateZone("SafeZone", "radius", e.target.value)
                }
              />
            </div>
            <div className="mt-1 flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] text-neutral-400">X</label>
                <input
                  type="range"
                  min="0"
                  max={currentMapUnits}
                  step="1000"
                  className="w-full accent-white"
                  value={simulatorState.ZoneState.SafeZone.x}
                  onChange={(e) => updateZone("SafeZone", "x", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-neutral-400">Y</label>
                <input
                  type="range"
                  min="0"
                  max={currentMapUnits}
                  step="1000"
                  className="w-full accent-white"
                  value={simulatorState.ZoneState.SafeZone.y}
                  onChange={(e) => updateZone("SafeZone", "y", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Red Zone */}
          <div className="rounded bg-neutral-800 p-3">
            <span className="text-xs font-bold text-red-500">Red Zone</span>
            <div className="mt-2">
              <label className="text-[10px] text-neutral-400">Radius</label>
              <input
                type="range"
                min="0"
                max={currentMapUnits}
                step="1000"
                className="w-full accent-red-500"
                value={simulatorState.ZoneState.RedZone.radius}
                onChange={(e) =>
                  updateZone("RedZone", "radius", e.target.value)
                }
              />
            </div>
            <div className="mt-1 flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] text-neutral-400">X</label>
                <input
                  type="range"
                  min="0"
                  max={currentMapUnits}
                  step="1000"
                  className="w-full accent-red-500"
                  value={simulatorState.ZoneState.RedZone.x}
                  onChange={(e) => updateZone("RedZone", "x", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-neutral-400">Y</label>
                <input
                  type="range"
                  min="0"
                  max={currentMapUnits}
                  step="1000"
                  className="w-full accent-red-500"
                  value={simulatorState.ZoneState.RedZone.y}
                  onChange={(e) => updateZone("RedZone", "y", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col gap-4 rounded-lg bg-neutral-900 p-4">
          <h3 className="border-b border-neutral-700 pb-2 text-sm font-semibold text-neutral-300">
            Player Locations
          </h3>

          {simulatorState.TotalPlayerList.map((player, index) => (
            <div key={player.uId} className="rounded bg-neutral-800 p-3">
              <span
                className="text-xs font-bold"
                style={{ color: player.teamId === 6 ? "#00ffff" : "#ff3366" }}
              >
                {player.playerName}
              </span>
              <div className="mt-2 flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] text-neutral-400">X</label>
                  <input
                    type="range"
                    min="0"
                    max={currentMapUnits}
                    step="1000"
                    className="w-full accent-neutral-500"
                    value={player.location.x}
                    onChange={(e) =>
                      updatePlayerPos(index, "x", e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-neutral-400">Y</label>
                  <input
                    type="range"
                    min="0"
                    max={currentMapUnits}
                    step="1000"
                    className="w-full accent-neutral-500"
                    value={player.location.y}
                    onChange={(e) =>
                      updatePlayerPos(index, "y", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Canvas Rendering */}
      <div className="flex flex-1 items-start justify-end">
        <div className="relative overflow-hidden">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="block h-full w-full bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
