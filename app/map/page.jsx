"use client";

import React, { useState, useEffect, useRef } from "react";
import getPlayerMapdata from "@/utils/getPlayerMapdata";

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

const defaultGameInfo = (mapSize) => ({
  CircleArray: [],
  PlaneStartLocX: String(Math.round(mapSize * 0.2)),
  PlaneStartLocY: String(Math.round(mapSize * 0.1)),
  PlaneStopLocX: String(Math.round(mapSize * 0.8)),
  PlaneStopLocY: String(Math.round(mapSize * 0.9)),
});

export default function PubgMapSimulator() {
  const [simulatorState, setSimulatorState] = useState(null);
  const gameStateRef = useRef(null);
  const renderStateRef = useRef({ players: {}, circles: [], blueZoneAnim: null, viewport: null });
  const canvasRef = useRef(null);
  const imagesRef = useRef({});
  const requestRef = useRef();

  useEffect(() => {
    getPlayerMapdata().then((data) => {
      if (data) {
        setSimulatorState({
          mapType: "Erangel",
          TotalPlayerList: data,
          gameGlobalInfo: defaultGameInfo(800000),
        });
        renderStateRef.current.players = {};
      }
    });
  }, []);

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
    const rp = renderStateRef.current;

    if (!state) {
      requestRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    const currentMapSize = MAPS[state.mapType]?.size || 800000;
    const scale = CANVAS_SIZE / currentMapSize;
    const gi = state.gameGlobalInfo;
    const targetCircles = gi?.CircleArray ?? [];

    // =====================================================================
    // CIRCLE LERPING
    // Matches websocket: CircleArray[0] = blue zone, CircleArray[1] = safe zone
    // Size = diameter, so radius = Size / 2
    // =====================================================================
    while (rp.circles.length < targetCircles.length) {
      const tc = targetCircles[rp.circles.length];
      rp.circles.push({
        x: parseFloat(tc.X),
        y: parseFloat(tc.Y),
        radius: parseFloat(tc.Size) / 2,
      });
    }
    rp.circles.length = targetCircles.length;

    rp.circles.forEach((vc, i) => {
      if (i === 0 && rp.blueZoneAnim) {
        const anim = rp.blueZoneAnim;
        const progress = Math.min((performance.now() - anim.startTime) / anim.duration, 1.0);
        vc.x = anim.startX + (anim.targetX - anim.startX) * progress;
        vc.y = anim.startY + (anim.targetY - anim.startY) * progress;
        vc.radius = anim.startRadius + (anim.targetRadius - anim.startRadius) * progress;
        if (progress >= 1.0) rp.blueZoneAnim = null;
      } else {
        const tc = targetCircles[i];
        const tx = parseFloat(tc.X), ty = parseFloat(tc.Y), tr = parseFloat(tc.Size) / 2;
        vc.x += (tx - vc.x) * 0.1;
        vc.y += (ty - vc.y) * 0.1;
        vc.radius += (tr - vc.radius) * 0.1;
      }
    });

    // =====================================================================
    // VIEWPORT: AUTO-ZOOM TO BLUE ZONE (circle[0])
    // =====================================================================
    if (!rp.viewport) rp.viewport = { zoom: 1, cx: CANVAS_SIZE / 2, cy: CANVAS_SIZE / 2 };
    const vp = rp.viewport;

    if (rp.circles.length >= 2) {
      // Only zoom in when the blue zone is active (2+ circles)
      const bz = rp.circles[0];
      const bzPr = bz.radius * scale;
      const targetZoom = Math.max(1, (CANVAS_SIZE * 0.85) / (bzPr * 2));
      vp.zoom += (targetZoom - vp.zoom) * 0.02;
      vp.cx  += (bz.x * scale - vp.cx) * 0.02;
      vp.cy  += (bz.y * scale - vp.cy) * 0.02;
    } else {
      // No circles or white-circle-only phase: full map view, no zoom
      vp.zoom += (1 - vp.zoom) * 0.02;
      vp.cx += (CANVAS_SIZE / 2 - vp.cx) * 0.02;
      vp.cy += (CANVAS_SIZE / 2 - vp.cy) * 0.02;
    }

    // Clamp viewport center so the map image always fills the canvas — no empty space.
    const halfVis = CANVAS_SIZE / (2 * vp.zoom);
    vp.cx = Math.max(halfVis, Math.min(CANVAS_SIZE - halfVis, vp.cx));
    vp.cy = Math.max(halfVis, Math.min(CANVAS_SIZE - halfVis, vp.cy));

    const vpTx = CANVAS_SIZE / 2 - vp.zoom * vp.cx;
    const vpTy = CANVAS_SIZE / 2 - vp.zoom * vp.cy;

    // =====================================================================
    // DRAW
    // =====================================================================
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(vp.zoom, 0, 0, vp.zoom, vpTx, vpTy);

    // Map image
    const currentMapImg = imagesRef.current[state.mapType];
    if (currentMapImg && currentMapImg.complete) {
      ctx.drawImage(currentMapImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }

    // -----------------------------------------------------------------------
    // ZONE RENDERING — PUBG mobile behaviour:
    //   1 circle  → white announcement circle only (no blue fog, zone not moving yet)
    //   2 circles → circles[0] = blue zone with fog, circles[1] = next white circle
    // -----------------------------------------------------------------------
    if (rp.circles.length === 1) {
      // Announcement phase: just the white safe-zone circle
      const sz = rp.circles[0];
      ctx.beginPath();
      ctx.arc(sz.x * scale, sz.y * scale, sz.radius * scale, 0, 2 * Math.PI);
      ctx.lineWidth = 3 / vp.zoom;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    } else if (rp.circles.length >= 2) {
      const bz = rp.circles[0];
      const bzPx = bz.x * scale, bzPy = bz.y * scale, bzPr = bz.radius * scale;

      // Blue fog outside the blue zone (evenodd punch-out, clamped to map bounds)
      ctx.beginPath();
      ctx.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.arc(bzPx, bzPy, bzPr, 0, 2 * Math.PI, true);
      ctx.fillStyle = "rgba(0, 20, 120, 0.55)";
      ctx.fill("evenodd");

      // Blue zone outline
      ctx.beginPath();
      ctx.arc(bzPx, bzPy, bzPr, 0, 2 * Math.PI);
      ctx.lineWidth = 3 / vp.zoom;
      ctx.strokeStyle = "rgba(0, 150, 255, 1)";
      ctx.stroke();

      // Next safe zone — white circle
      const sz = rp.circles[1];
      ctx.beginPath();
      ctx.arc(sz.x * scale, sz.y * scale, sz.radius * scale, 0, 2 * Math.PI);
      ctx.lineWidth = 3 / vp.zoom;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    }

    // =====================================================================
    // FLIGHT PATH + MOVING PLANE
    // =====================================================================
    const planeStartX = parseFloat(gi?.PlaneStartLocX ?? 0) * scale;
    const planeStartY = parseFloat(gi?.PlaneStartLocY ?? 0) * scale;
    const planeStopX  = parseFloat(gi?.PlaneStopLocX  ?? 0) * scale;
    const planeStopY  = parseFloat(gi?.PlaneStopLocY  ?? 0) * scale;
    const planeAngle  = Math.atan2(planeStopY - planeStartY, planeStopX - planeStartX);

    // Plane flies once from start → end over 60s, then disappears
    const PLANE_DURATION = 60000;
    if (!rp.planeStartTime) rp.planeStartTime = timestamp;
    const planeT = Math.min((timestamp - rp.planeStartTime) / PLANE_DURATION, 1.0);
    const planeActive = planeT < 1.0;

    if (planeActive) {
      const planePx = planeStartX + (planeStopX - planeStartX) * planeT;
      const planePy = planeStartY + (planeStopY - planeStartY) * planeT;

      // Full dashed path line (always start → end)
      ctx.beginPath();
      ctx.moveTo(planeStartX, planeStartY);
      ctx.lineTo(planeStopX, planeStopY);
      ctx.lineWidth = 1.5 / vp.zoom;
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.setLineDash([10 / vp.zoom, 7 / vp.zoom]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Plane shape pointing RIGHT (0°), rotated to planeAngle
      ctx.save();
      ctx.translate(planePx, planePy);
      ctx.rotate(planeAngle);
      ctx.shadowColor = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = 5 / vp.zoom;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.lineWidth = 0.5 / vp.zoom;
      const s = 14 / vp.zoom;

      // Fuselage
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 1.5, s * 0.2, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      // Left wing
      ctx.beginPath();
      ctx.moveTo(s * 0.15, 0);
      ctx.lineTo(-s * 0.4, -s * 1.1);
      ctx.lineTo(-s * 0.85, -s * 0.6);
      ctx.lineTo(-s * 0.25, 0);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Right wing (mirror)
      ctx.beginPath();
      ctx.moveTo(s * 0.15, 0);
      ctx.lineTo(-s * 0.4, s * 1.1);
      ctx.lineTo(-s * 0.85, s * 0.6);
      ctx.lineTo(-s * 0.25, 0);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Tail fin left
      ctx.beginPath();
      ctx.moveTo(-s * 1.1, 0);
      ctx.lineTo(-s * 1.35, -s * 0.45);
      ctx.lineTo(-s * 1.5, -s * 0.15);
      ctx.lineTo(-s * 1.2, 0);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Tail fin right (mirror)
      ctx.beginPath();
      ctx.moveTo(-s * 1.1, 0);
      ctx.lineTo(-s * 1.35, s * 0.45);
      ctx.lineTo(-s * 1.5, s * 0.15);
      ctx.lineTo(-s * 1.2, 0);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // =====================================================================
    // PLAYERS (asymptotic lerp)
    // =====================================================================
    state.TotalPlayerList?.forEach((player) => {
      if (![0, 2, 3, 4, 6].includes(player.liveState)) return;

      if (!rp.players[player.uId]) {
        rp.players[player.uId] = { x: player.location.x, y: player.location.y };
      }

      const vpos = rp.players[player.uId];
      vpos.x += (player.location.x - vpos.x) * 0.1;
      vpos.y += (player.location.y - vpos.y) * 0.1;

      const px = vpos.x * scale, py = vpos.y * scale;
      const dotR = 6 / vp.zoom;

      ctx.beginPath();
      ctx.arc(px, py, dotR, 0, 2 * Math.PI);
      ctx.fillStyle = player.teamId === 6 ? "#00ffff" : "#ff3366";
      ctx.fill();
      ctx.lineWidth = 2 / vp.zoom;
      ctx.strokeStyle = "#000000";
      ctx.stroke();

      const fontSize = 13 / vp.zoom;
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.shadowColor = "black";
      ctx.shadowBlur = 4 / vp.zoom;
      ctx.shadowOffsetX = 1 / vp.zoom;
      ctx.shadowOffsetY = 1 / vp.zoom;
      ctx.fillText(player.playerName, px + 12 / vp.zoom, py + 4 / vp.zoom);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    });

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    requestRef.current = requestAnimationFrame(renderLoop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // =========================================================================
  // SIMULATOR CONTROLS
  // =========================================================================
  const updateCircle = (index, prop, value) => {
    renderStateRef.current.blueZoneAnim = null;
    setSimulatorState((prev) => {
      const newCircles = [...prev.gameGlobalInfo.CircleArray];
      newCircles[index] = { ...newCircles[index], [prop]: String(value) };
      return { ...prev, gameGlobalInfo: { ...prev.gameGlobalInfo, CircleArray: newCircles } };
    });
  };

  const addCircle = () => {
    setSimulatorState((prev) => {
      const mapSize = MAPS[prev.mapType].size;
      const existing = prev.gameGlobalInfo.CircleArray;
      if (existing.length >= 2) return prev;
      const newCircle = {
        X: String(Math.round(mapSize * 0.5)),
        Y: String(Math.round(mapSize * 0.5)),
        Size: String(Math.round(existing.length === 0 ? mapSize * 0.6 : mapSize * 0.35)),
      };
      return { ...prev, gameGlobalInfo: { ...prev.gameGlobalInfo, CircleArray: [...existing, newCircle] } };
    });
  };

  const removeLastCircle = () => {
    renderStateRef.current.blueZoneAnim = null;
    setSimulatorState((prev) => {
      const newCircles = prev.gameGlobalInfo.CircleArray.slice(0, -1);
      return { ...prev, gameGlobalInfo: { ...prev.gameGlobalInfo, CircleArray: newCircles } };
    });
  };

  const triggerBlueZoneShrink = () => {
    const state = gameStateRef.current;
    const rp = renderStateRef.current;
    const circles = state?.gameGlobalInfo?.CircleArray ?? [];
    if (circles.length < 2 || rp.circles.length < 1) return;

    const target = circles[1];
    rp.blueZoneAnim = {
      startTime: performance.now(),
      duration: 15000,
      startX: rp.circles[0].x,
      startY: rp.circles[0].y,
      startRadius: rp.circles[0].radius,
      targetX: parseFloat(target.X),
      targetY: parseFloat(target.Y),
      targetRadius: parseFloat(target.Size) / 2,
    };

    setSimulatorState((prev) => {
      const newCircles = [...prev.gameGlobalInfo.CircleArray];
      newCircles[0] = { ...newCircles[1] };
      return { ...prev, gameGlobalInfo: { ...prev.gameGlobalInfo, CircleArray: newCircles } };
    });
  };

  const updatePlane = (prop, value) => {
    setSimulatorState((prev) => ({
      ...prev,
      gameGlobalInfo: { ...prev.gameGlobalInfo, [prop]: String(value) },
    }));
  };

  const updatePlayerPos = (index, axis, value) => {
    setSimulatorState((prev) => {
      const newPlayers = [...prev.TotalPlayerList];
      newPlayers[index] = {
        ...newPlayers[index],
        location: { ...newPlayers[index].location, [axis]: parseInt(value) },
      };
      return { ...prev, TotalPlayerList: newPlayers };
    });
  };

  const handleMapChange = (e) => {
    if (!simulatorState) return;
    const newMapType = e.target.value;
    const oldMapSize = MAPS[simulatorState.mapType].size;
    const newMapSize = MAPS[newMapType].size;
    const ratio = newMapSize / oldMapSize;

    setSimulatorState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        mapType: newMapType,
        TotalPlayerList: prev.TotalPlayerList.map((p) => ({
          ...p,
          location: {
            ...p.location,
            x: Math.round(p.location.x * ratio),
            y: Math.round(p.location.y * ratio),
          },
        })),
        gameGlobalInfo: {
          ...defaultGameInfo(newMapSize),
          CircleArray: (prev.gameGlobalInfo?.CircleArray ?? []).map((c) => ({
            X: String(Math.round(parseFloat(c.X) * ratio)),
            Y: String(Math.round(parseFloat(c.Y) * ratio)),
            Size: String(Math.round(parseFloat(c.Size) * ratio)),
          })),
        },
      };
    });

    renderStateRef.current = { players: {}, circles: [], blueZoneAnim: null, viewport: null, planeStartTime: null };
  };

  const currentMapUnits = MAPS[simulatorState?.mapType]?.size || 800000;
  const circles = simulatorState?.gameGlobalInfo?.CircleArray ?? [];

  return (
    <div className="flex h-screen overflow-hidden font-sans text-white">
      {/* LEFT SIDE: Control Panel */}
      <div className="flex w-87.5 shrink-0 flex-col gap-6 overflow-y-auto border-r border-neutral-700 bg-neutral-800 p-6">
        <div>
          <h1 className="mb-1 text-xl font-bold text-blue-400">PCOB Simulator</h1>
          <p className="text-xs text-neutral-400">Drag sliders to test Canvas</p>
        </div>

        {/* Map selector */}
        <div className="rounded-lg bg-neutral-900 p-4">
          <label className="mb-2 block text-sm font-semibold text-neutral-300">Active Map</label>
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

        {/* Zone Circles */}
        <div className="flex flex-col gap-4 rounded-lg bg-neutral-900 p-4">
          <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
            <h3 className="text-sm font-semibold text-neutral-300">Zone Circles</h3>
            <div className="flex gap-2">
              {circles.length < 2 && (
                <button
                  onClick={addCircle}
                  className="rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-blue-500"
                >
                  + Circle {circles.length + 1}
                </button>
              )}
              {circles.length > 0 && (
                <button
                  onClick={removeLastCircle}
                  className="rounded bg-neutral-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-neutral-500"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {circles.length === 0 && (
            <p className="text-center text-xs text-neutral-500">No circles yet — click &quot;+ Circle 1&quot;</p>
          )}

          {circles.map((circle, i) => (
            <div key={i} className="rounded bg-neutral-800 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className={`text-xs font-bold ${i === 0 ? "text-blue-400" : "text-white"}`}>
                  {i === 0 ? "Blue Zone (current)" : "Safe Zone (next)"}
                </span>
                {i === 0 && circles.length >= 2 && (
                  <button
                    onClick={triggerBlueZoneShrink}
                    className="rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-blue-500"
                  >
                    Simulate Shrink
                  </button>
                )}
              </div>
              {[["X", "X"], ["Y", "Y"], ["Size", "Diameter"]].map(([prop, label]) => (
                <div key={prop} className="mt-1">
                  <label className="text-[10px] text-neutral-400">{label}</label>
                  <input
                    type="range"
                    min="0"
                    max={prop === "Size" ? currentMapUnits * 1.5 : currentMapUnits}
                    step="1000"
                    className={`w-full ${i === 0 ? "accent-blue-500" : "accent-white"}`}
                    value={parseFloat(circle[prop]) ?? 0}
                    onChange={(e) => updateCircle(i, prop, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Flight Path */}
        <div className="flex flex-col gap-3 rounded-lg bg-neutral-900 p-4">
          <h3 className="border-b border-neutral-700 pb-2 text-sm font-semibold text-neutral-300">
            Flight Path
          </h3>
          {[
            ["PlaneStartLocX", "Start X"],
            ["PlaneStartLocY", "Start Y"],
            ["PlaneStopLocX", "End X"],
            ["PlaneStopLocY", "End Y"],
          ].map(([prop, label]) => (
            <div key={prop}>
              <label className="text-[10px] text-neutral-400">{label}</label>
              <input
                type="range"
                min={Math.round(-currentMapUnits * 0.2)}
                max={Math.round(currentMapUnits * 1.2)}
                step="1000"
                className="w-full accent-yellow-400"
                value={parseFloat(simulatorState?.gameGlobalInfo?.[prop] ?? 0)}
                onChange={(e) => updatePlane(prop, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Player Locations */}
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
                {["x", "y"].map((axis) => (
                  <div key={axis} className="flex-1">
                    <label className="text-[10px] text-neutral-400">{axis.toUpperCase()}</label>
                    <input
                      type="range"
                      min="0"
                      max={currentMapUnits}
                      step="1000"
                      className="w-full accent-neutral-500"
                      value={player.location[axis] ?? 0}
                      onChange={(e) => updatePlayerPos(index, axis, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Canvas */}
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
