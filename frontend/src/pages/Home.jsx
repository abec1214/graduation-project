import "../css/index.css";

export default function Home() {
  const records = [
    {
      name: "山田 太郎",
      type: "スポーツマッサージ・60分",
      pressure: "中",
      therapist: "佐藤 花子",
      date: "2026-07-29",
    },
    {
      name: "佐藤 花子",
      type: "スウェーデンマッサージ・90分",
      pressure: "強",
      therapist: "山田 太郎",
      date: "2026-07-28",
    },
    {
      name: "田中 美咲",
      type: "スポーツマッサージ・60分",
      pressure: "中",
      therapist: "佐藤 花子",
      date: "2026-07-27",
    },
  ];

  return (
    <div className="flex h-screen font-sans bg-[#f9f5ee]">
      {/* 左側：カルテ一覧 */}
      <main className="w-[45%] bg-[#f5f0e7] p-8 overflow-y-auto border-r border-gray-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-sm text-gray-600">カルテ管理</h2>
            <h1 className="text-lg font-bold text-[#1f3b33]">施術記録</h1>
          </div>
          <button className="bg-[#1f3b33] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a40] transition">
            ＋ 新規作成
          </button>
        </div>

        <input
          type="text"
          placeholder="顧客名・施術内容で検索..."
          className="w-full p-2 rounded-lg border border-gray-300 mb-4 bg-white focus:ring-2 focus:ring-[#1f3b33]"
        />

        <p className="text-sm text-gray-500 mb-2">{records.length} 件</p>

        <div className="space-y-4">
          {records.map((c) => (
            <div
              key={c.name + c.date}
              className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-[#1f3b33]">{c.name}</p>
                  <p className="text-sm text-gray-700">{c.type}</p>

                  <div className="flex items-center mt-2 space-x-2">
                    <span className="bg-[#f5e0c3] text-[#1f3b33] text-xs px-2 py-1 rounded-full">
                      圧:{c.pressure}
                    </span>
                    <p className="text-xs text-gray-600">{c.therapist}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-500">{c.date}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 右側：選択案内 */}
      <section className="flex-1 bg-[#f9f5ee] flex flex-col items-center justify-center text-center text-gray-500">
        <div className="text-5xl mb-4">📄</div>
        <p className="text-lg">左のリストから記録を選択</p>
        <p className="text-sm mt-2">または「新規作成」で記録を追加</p>
      </section>
    </div>
  );
}
