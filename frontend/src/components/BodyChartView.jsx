// src/components/BodyChartView.jsx
import React from "react";

export default function BodyChartView({
  selectedParts = [],
  togglePart = null,
  readOnly = false,
}) {
  const [view, setView] = React.useState("front");

  const handleClick = (part) => {
    if (readOnly) return;
    if (!togglePart) return;
    togglePart(part);
  };

  return (
    <div className="flex flex-col items-center gap-3">

      {/* 前面・後面ボタン（閲覧専用なら非表示） */}
      {!readOnly && (
        <div className="flex gap-3 mb-2">
          <button
            type="button"
            onClick={() => setView("front")}
            className={`px-4 py-1 rounded-md border border-gray-400 font-semibold transition ${
              view === "front"
                ? "bg-[#d4a373] text-white"
                : "bg-white text-[#2a2a2a]"
            }`}
          >
            前面
          </button>

          <button
            type="button"
            onClick={() => setView("back")}
            className={`px-4 py-1 rounded-md border border-gray-400 font-semibold transition ${
              view === "back"
                ? "bg-[#d4a373] text-white"
                : "bg-white text-[#2a2a2a]"
            }`}
          >
            後面
          </button>
        </div>
      )}

      {/* SVG（前面） */}
      {view === "front" && (
        <svg viewBox="0 0 200 300" className="w-48 h-72">

          {/* 頭 */}
          <ellipse
            cx="100"
            cy="52"
            rx="12"
            ry="14"
            fill={selectedParts.includes("head") ? "#d4a373" : "#6B665E"}
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("head")}
          />

          {/* 左肩 */}
          <ellipse
            cx="65"
            cy="78"
            rx="16"
            ry="12"
            fill={
              selectedParts.includes("leftShoulder") ? "#d4a373" : "#6B665E"
            }
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("leftShoulder")}
          />

          {/* 右肩 */}
          <ellipse
            cx="135"
            cy="78"
            rx="16"
            ry="12"
            fill={
              selectedParts.includes("rightShoulder") ? "#d4a373" : "#6B665E"
            }
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("rightShoulder")}
          />

          {/* 胸 */}
          <ellipse
            cx="100"
            cy="105"
            rx="26"
            ry="18"
            fill={selectedParts.includes("chest") ? "#d4a373" : "#6B665E"}
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("chest")}
          />

          {/* 腹部 */}
          <ellipse
            cx="100"
            cy="140"
            rx="22"
            ry="18"
            fill={selectedParts.includes("abdomen") ? "#d4a373" : "#6B665E"}
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("abdomen")}
          />

          {/* 左脚 */}
          <ellipse
            cx="82"
            cy="195"
            rx="14"
            ry="22"
            fill={selectedParts.includes("leftLeg") ? "#d4a373" : "#6B665E"}
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("leftLeg")}
          />

          {/* 右脚 */}
          <ellipse
            cx="118"
            cy="195"
            rx="14"
            ry="22"
            fill={selectedParts.includes("rightLeg") ? "#d4a373" : "#6B665E"}
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("rightLeg")}
          />

          {/* 左足先 */}
          <ellipse
            cx="82"
            cy="268"
            rx="10"
            ry="10"
            fill={selectedParts.includes("leftFoot") ? "#d4a373" : "#6B665E"}
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("leftFoot")}
          />

          {/* 右足先 */}
          <ellipse
            cx="118"
            cy="268"
            rx="10"
            ry="10"
            fill={selectedParts.includes("rightFoot") ? "#d4a373" : "#6B665E"}
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("rightFoot")}
          />
        </svg>
      )}

      {/* SVG（後面） */}
      {view === "back" && (
        <svg viewBox="0 0 200 300" className="w-48 h-72">

          {/* 後頭部 */}
          <ellipse
            cx="100"
            cy="52"
            rx="12"
            ry="14"
            fill={selectedParts.includes("backHead") ? "#d4a373" : "#6B665E"}
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("backHead")}
          />

          {/* 左肩（後面） */}
          <ellipse
            cx="65"
            cy="78"
            rx="16"
            ry="12"
            fill={
              selectedParts.includes("backLeftShoulder")
                ? "#d4a373"
                : "#6B665E"
            }
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("backLeftShoulder")}
          />

          {/* 右肩（後面） */}
          <ellipse
            cx="135"
            cy="78"
            rx="16"
            ry="12"
            fill={
              selectedParts.includes("backRightShoulder")
                ? "#d4a373"
                : "#6B665E"
            }
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("backRightShoulder")}
          />

          {/* 背中（上部） */}
          <ellipse
            cx="100"
            cy="105"
            rx="26"
            ry="18"
            fill={selectedParts.includes("upperBack") ? "#d4a373" : "#6B665E"}
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("upperBack")}
          />

          {/* 背中（下部） */}
          <ellipse
            cx="100"
            cy="140"
            rx="22"
            ry="18"
            fill={selectedParts.includes("lowerBack") ? "#d4a373" : "#6B665E"}
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("lowerBack")}
          />

          {/* 左脚（後面） */}
          <ellipse
            cx="82"
            cy="195"
            rx="14"
            ry="22"
            fill={
              selectedParts.includes("backLeftLeg") ? "#d4a373" : "#6B665E"
            }
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("backLeftLeg")}
          />

          {/* 右脚（後面） */}
          <ellipse
            cx="118"
            cy="195"
            rx="14"
            ry="22"
            fill={
              selectedParts.includes("backRightLeg") ? "#d4a373" : "#6B665E"
            }
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("backRightLeg")}
          />

          {/* 左足先（後面） */}
          <ellipse
            cx="82"
            cy="268"
            rx="10"
            ry="10"
            fill={
              selectedParts.includes("backLeftFoot") ? "#d4a373" : "#6B665E"
            }
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("backLeftFoot")}
          />

          {/* 右足先（後面） */}
          <ellipse
            cx="118"
            cy="268"
            rx="10"
            ry="10"
            fill={
              selectedParts.includes("backRightFoot") ? "#d4a373" : "#6B665E"
            }
            fillOpacity="0.45"
            stroke="#4A453F"
            strokeWidth="1.2"
            className={readOnly ? "" : "cursor-pointer transition-all"}
            onClick={() => handleClick("backRightFoot")}
          />
        </svg>
      )}

      {!readOnly && (
        <p className="text-sm text-[#3b3b3b] text-center mt-3">
          部位をクリックして選択
        </p>
      )}
    </div>
  );
}
