// src/pages/Records.jsx
import { useState } from "react";
import RecordList from "../components/RecordList";
import RecordDetail from "./RecordDetail";

export default function Records() {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // 🟩 一覧データを useState で管理（ここが重要）
  const [records, setRecords] = useState([
    {
      id: 1,
      name: "田中 美咲",
      type: "スウェーデンマッサージ・60分",
      pressure: "中",
      date: "2026-07-05",
      allergy: "ラベンダーオイル",
    },
    {
      id: 2,
      name: "山田 太郎",
      type: "スポーツマッサージ・90分",
      pressure: "強",
      date: "2026-06-21",
      allergy: "特になし",
    },
    {
      id: 3,
      name: "田中 美咲",
      type: "リラクゼーション・60分",
      pressure: "軽",
      date: "2026-06-07",
      allergy: "アロマオイル（柑橘系）",
    },
  ]);

  return (
    <div className="flex h-screen bg-[#fffaf3]">
      {/* 左側：カルテ一覧 */}
      <div className="w-[420px] border-r border-gray-300 bg-[#f9f5ee] overflow-y-auto">
        <div className="p-6">
          {/* タイトル */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm text-gray-700 font-medium">カルテ管理</h2>
              <h1 className="text-2xl font-bold text-gray-900 tracking-wide mt-1">
                施術記録
              </h1>
            </div>

            {/* 新規作成ボタン */}
            <button
              onClick={() => {
                setSelectedRecord(null);
                setIsCreating(true);
              }}
              className="bg-[#1f3b33] text-white px-5 py-2 rounded-lg hover:bg-[#2a4a40] transition"
            >
              + 新規作成
            </button>
          </div>

          {/* 検索バー 
          <div className="flex items-center gap-3 mb-6">
            <input
              type="text"
              placeholder="顧客名・施術内容で検索..."
              className="
                flex-1 p-3 rounded-lg 
                border border-gray-400 
                text-gray-900 placeholder-gray-600
                bg-white shadow-sm
                focus:ring-2 focus:ring-[#1f3b33]
              "
            />
          </div>*/}

          {/* カルテ一覧 */}
          <RecordList
            records={records} // 🟩 親の状態を渡す（超重要）
            onSelect={(r) => {
              setSelectedRecord(r);
              setIsCreating(false);
            }}
          />
        </div>
      </div>

      {/* 右側：カルテ詳細 or 新規作成フォーム */}
      <div className="flex-1 p-8 overflow-y-auto">
        <RecordDetail
          record={selectedRecord}
          isCreating={isCreating}
          onSave={(data) => {
            // 🟩 新規カルテを追加して一覧更新
            const newRecord = { id: Date.now(), ...data };
            setRecords((prev) => [...prev, newRecord]);

            setIsCreating(false);
          }}
        />
      </div>
    </div>
  );
}
