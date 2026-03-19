"use client";

import React, { useState, useEffect, useRef } from "react";
import getPlayerMapdata from "@/utils/getPlayerMapdata";

// --- CONFIGURATION ---
const CANVAS_SIZE = 1080;

const MAPS = {
  Erangel: {
    src: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Erangel_Main_Low_Res.png",
    name: "Erangel",
    size: 800000,
  },
  Miramar: {
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

export default function PubgMapSimulator() {
  const [simulatorState, setSimulatorState] = useState(null);
  const gameStateRef = useRef(simulatorState);

  useEffect(() => {
    getPlayerMapdata().then((data) => {
      if (data) {
        setSimulatorState({
          mapType: "Erangel",
          TotalPlayerList: data,
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
        });
        renderStateRef.current.players = {};
      }
    });
  }, []);

  // visual state tracker. Now includes `blueZoneAnim` for time-based tracking.
  const renderStateRef = useRef({
    players: {},
    zones: null,
    blueZoneAnim: null,
  });

  const canvasRef = useRef(null);
  const imagesRef = useRef({});
  const requestRef = useRef();

  useEffect(() => {
    gameStateRef.current = simulatorState;
  }, [simulatorState]);

  useEffect(() => {
    Object.keys(MAPS).forEach((key) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = MAPS[key].src;
      imagesRef.current[key] = img;
    });
  }, []);

  // =========================================================================
  // CANVAS RENDERING ENGINE
  // =========================================================================
  const renderLoop = (timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const state = gameStateRef.current;
    const renderPosMap = renderStateRef.current;

    if (!state) {
      requestRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    const currentMapSize = MAPS[state.mapType]?.size || 800000;
    const scale = CANVAS_SIZE / currentMapSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentMapImg = imagesRef.current[state.mapType];
    if (currentMapImg && currentMapImg.complete) {
      ctx.drawImage(currentMapImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }

    if (!renderPosMap.zones) {
      renderPosMap.zones = {
        SafeZone: { ...state.ZoneState.SafeZone },
        BlueZone: { ...state.ZoneState.BlueZone },
        RedZone: { ...state.ZoneState.RedZone },
      };
    }

    // =====================================================================
    // 1. TIME-BASED CONSTANT SPEED LERPING (FOR BLUE ZONE)
    // =====================================================================
    // If a time-based animation is active (Simulate Shrink clicked):
    if (renderPosMap.blueZoneAnim) {
      const anim = renderPosMap.blueZoneAnim;

      // Calculate how much time has passed (e.g., 5000ms out of 15000ms)
      const elapsed = performance.now() - anim.startTime;

      // Progress is a percentage from 0.0 to 1.0 (e.g., 0.33 means 33% done)
      // Math.min ensures it never goes past 1.0 (100%)
      const progress = Math.min(elapsed / anim.duration, 1.0);

      // Math: Current = Start + (Total Distance * Progress Percentage)
      // This guarantees absolute constant speed exactly like real PUBG.
      renderPosMap.zones.BlueZone.x =
        anim.startX + (anim.targetX - anim.startX) * progress;
      renderPosMap.zones.BlueZone.y =
        anim.startY + (anim.targetY - anim.startY) * progress;
      renderPosMap.zones.BlueZone.radius =
        anim.startRadius + (anim.targetRadius - anim.startRadius) * progress;

      // Clean up animation when it hits 100%
      if (progress >= 1.0) renderPosMap.blueZoneAnim = null;
    } else {
      // Fallback for UI Sliders: Quick smooth snap if user is just dragging the slider manually
      renderPosMap.zones.BlueZone.x +=
        (state.ZoneState.BlueZone.x - renderPosMap.zones.BlueZone.x) * 0.1;
      renderPosMap.zones.BlueZone.y +=
        (state.ZoneState.BlueZone.y - renderPosMap.zones.BlueZone.y) * 0.1;
      renderPosMap.zones.BlueZone.radius +=
        (state.ZoneState.BlueZone.radius - renderPosMap.zones.BlueZone.radius) *
        0.1;
    }

    // Safe and Red zones just quickly snap to their targets
    ["SafeZone", "RedZone"].forEach((zoneName) => {
      renderPosMap.zones[zoneName].x +=
        (state.ZoneState[zoneName].x - renderPosMap.zones[zoneName].x) * 0.1;
      renderPosMap.zones[zoneName].y +=
        (state.ZoneState[zoneName].y - renderPosMap.zones[zoneName].y) * 0.1;
      renderPosMap.zones[zoneName].radius +=
        (state.ZoneState[zoneName].radius -
          renderPosMap.zones[zoneName].radius) *
        0.1;
    });

    const drawZone = (
      visualZone,
      strokeColor,
      fillColor,
      lineWidth,
      isDashed = false,
    ) => {
      ctx.beginPath();
      const pixelX = visualZone.x * scale;
      const pixelY = visualZone.y * scale;
      const pixelRadius = visualZone.radius * scale;

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

    drawZone(
      renderPosMap.zones.RedZone,
      "rgba(255,0,0,0.8)",
      "rgba(255,0,0,0.3)",
      2,
    );
    drawZone(
      renderPosMap.zones.BlueZone,
      "rgba(0,100,255,0.8)",
      "rgba(0,50,255,0.1)",
      3,
    );
    drawZone(renderPosMap.zones.SafeZone, "#ffffff", null, 3);

    if (state.FlightPath.isActive) {
      ctx.beginPath();
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

    // =====================================================================
    // 2. ASYMPTOTIC LERPING (FOR PLAYERS)
    // =====================================================================
    state.TotalPlayerList.forEach((player) => {
      if (player.bHasDied) return;

      if (!renderPosMap.players[player.uId]) {
        renderPosMap.players[player.uId] = {
          x: player.location.x,
          y: player.location.y,
        };
      }

      const visualPos = renderPosMap.players[player.uId];

      // Players use Asymptotic Lerping (always covering 10% of remaining distance).
      // This is perfect for players because PCOB sends live updates every second.
      // This math simply smooths out the 1-second stutters into 60FPS slides.
      visualPos.x += (player.location.x - visualPos.x) * 0.1;
      visualPos.y += (player.location.y - visualPos.y) * 0.1;

      const px = visualPos.x * scale;
      const py = visualPos.y * scale;

      ctx.beginPath();
      ctx.arc(px, py, 6, 0, 2 * Math.PI);
      ctx.fillStyle = player.teamId === 6 ? "#00ffff" : "#ff3366";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000000";
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px Arial";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
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

  const updatePlayerPos = (index, axis, value) => {
    // Clear animation if manual override via slider
    renderStateRef.current.blueZoneAnim = null;
    const newState = { ...simulatorState };
    newState.TotalPlayerList[index].location[axis] = parseInt(value);
    setSimulatorState(newState);
  };

  const updateZone = (zoneName, prop, value) => {
    renderStateRef.current.blueZoneAnim = null;
    const newState = { ...simulatorState };
    newState.ZoneState[zoneName][prop] = parseInt(value);
    setSimulatorState(newState);
  };

  const handleMapChange = (e) => {
    const newMapType = e.target.value;
    const oldMapSize = MAPS[simulatorState.mapType].size;
    const newMapSize = MAPS[newMapType].size;
    const ratio = newMapSize / oldMapSize;

    const newState = { ...simulatorState, mapType: newMapType };

    newState.TotalPlayerList = newState.TotalPlayerList.map((p) => ({
      ...p,
      location: {
        ...p.location,
        x: Math.round(p.location.x * ratio),
        y: Math.round(p.location.y * ratio),
      },
    }));

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

    renderStateRef.current = { players: {}, zones: null, blueZoneAnim: null };
    setSimulatorState(newState);
  };

  const triggerBlueZoneShrink = () => {
    const state = gameStateRef.current;
    const visualState = renderStateRef.current;

    // 1. Log the exact time and parameters to start the constant-speed animation
    visualState.blueZoneAnim = {
      startTime: performance.now(),
      duration: 15000, // Duration in milliseconds (15 seconds)
      startX: visualState.zones.BlueZone.x,
      startY: visualState.zones.BlueZone.y,
      startRadius: visualState.zones.BlueZone.radius,
      targetX: state.ZoneState.SafeZone.x,
      targetY: state.ZoneState.SafeZone.y,
      targetRadius: state.ZoneState.SafeZone.radius,
    };

    // 2. Update React State so the UI sliders immediately snap to the final destination
    setSimulatorState((prev) => ({
      ...prev,
      ZoneState: {
        ...prev.ZoneState,
        BlueZone: {
          x: prev.ZoneState.SafeZone.x,
          y: prev.ZoneState.SafeZone.y,
          radius: prev.ZoneState.SafeZone.radius,
        },
      },
    }));
  };

  const currentMapUnits = MAPS[simulatorState?.mapType]?.size || 800000;

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

        <div className="rounded-lg bg-neutral-900 p-4">
          <label className="mb-2 block text-sm font-semibold text-neutral-300">
            Active Map
          </label>
          <select
            className="w-full rounded border border-neutral-600 bg-neutral-700 p-2 text-sm text-white outline-none"
            value={simulatorState?.mapType ?? "Erangel"}
            onChange={handleMapChange}
          >
            <option value="Erangel">Erangel (8x8km)</option>
            <option value="Miramar">Miramar (8x8km)</option>
            <option value="Vikendi">Vikendi (6x6km)</option>
            <option value="Sanhok">Sanhok (4x4km)</option>
          </select>
        </div>

        <div className="flex flex-col gap-4 rounded-lg bg-neutral-900 p-4">
          <h3 className="border-b border-neutral-700 pb-2 text-sm font-semibold text-neutral-300">
            Zone Controls
          </h3>

          <div className="rounded bg-neutral-800 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400">Blue Zone</span>
              <button
                onClick={triggerBlueZoneShrink}
                className="rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white transition-colors hover:bg-blue-500"
              >
                Simulate 15s Shrink
              </button>
            </div>

            <div className="mt-2">
              <label className="text-[10px] text-neutral-400">Radius</label>
              <input
                type="range"
                min="0"
                max={currentMapUnits}
                step="1000"
                className="w-full accent-blue-500"
                value={simulatorState?.ZoneState?.BlueZone?.radius ?? 0}
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
                  value={simulatorState?.ZoneState?.BlueZone?.x ?? 0}
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
                  value={simulatorState?.ZoneState?.BlueZone?.y ?? 0}
                  onChange={(e) => updateZone("BlueZone", "y", e.target.value)}
                />
              </div>
            </div>
          </div>

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
                value={simulatorState?.ZoneState?.SafeZone?.radius ?? 0}
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
                  value={simulatorState?.ZoneState?.SafeZone?.x ?? 0}
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
                  value={simulatorState?.ZoneState?.SafeZone?.y ?? 0}
                  onChange={(e) => updateZone("SafeZone", "y", e.target.value)}
                />
              </div>
            </div>
          </div>

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
                value={simulatorState?.ZoneState?.RedZone?.radius ?? 0}
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
                  value={simulatorState?.ZoneState?.RedZone?.x ?? 0}
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
                  value={simulatorState?.ZoneState?.RedZone?.y ?? 0}
                  onChange={(e) => updateZone("RedZone", "y", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg bg-neutral-900 p-4">
          <h3 className="border-b border-neutral-700 pb-2 text-sm font-semibold text-neutral-300">
            Player Locations
          </h3>
          {simulatorState?.TotalPlayerList?.map((player, index) => (
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
        <div className="relative overflow-hidden shadow-2xl shadow-black/50">
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
