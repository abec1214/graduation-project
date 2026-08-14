// src/pages/PatientDetail.jsx
import { useParams, Link } from "react-router-dom";
import { patients } from "../data/patientsData";
import { visits } from "../data/visitsData";
import { useState } from "react";

export default function PatientDetail() {
  const { customerId } = useParams();
  const patient = patients.find((p) => p.id === Number(customerId));

  const [tab, setTab] = useState("info");

  if (!patient) {
    return <div className="p-8 text-black">顧客が見つかりませんでした。</div>;
  }

  // ★ 施術履歴を状態として保持（削除が反映される）
  const [visitList, setVisitList] = useState(
    visits.filter((v) => v.patientId === Number(customerId)),
  );

  return (
    <div className="flex-1 bg-[#f9f5ee] p-8 overflow-y-auto text-black">
      {/* タブ */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("info")}
          className={`px-4 py-2 rounded ${
            tab === "info" ? "bg-[#1f3b33] text-white" : "bg-white text-black"
          }`}
        >
          基本情報
        </button>

        <button
          onClick={() => setTab("visits")}
          className={`px-4 py-2 rounded ${
            tab === "visits" ? "bg-[#1f3b33] text-white" : "bg-white text-black"
          }`}
        >
          施術履歴
        </button>
      </div>

      {/* 基本情報 */}
      {tab === "info" && (
        <>
          <h1 className="text-3xl font-bold">{patient.name}</h1>
          <p className="text-black">{patient.kana}</p>
          <p className="mt-2 text-black">
            {patient.gender}・{patient.age}歳
          </p>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow text-black">
              <h2 className="text-lg font-semibold mb-3">個人情報</h2>
              <p>生年月日：{patient.birth}</p>
              <p>職業：{patient.occupation}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow text-black">
              <h2 className="text-lg font-semibold mb-3">連絡先</h2>
              <p>📞 {patient.phone}</p>
              <p>✉️ {patient.email}</p>
              <p>🏠 {patient.address}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow text-black">
              <h2 className="text-lg font-semibold mb-3">既往症</h2>
              <p>{patient.disease}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow text-black">
              <h2 className="text-lg font-semibold mb-3">アレルギー</h2>
              <p className="text-red-600">{patient.allergy}</p>
            </div>
          </div>

          <div className="mt-6 bg-white p-6 rounded-lg shadow text-black">
            <h2 className="text-lg font-semibold mb-3">次回予約</h2>
            <p>{patient.nextVisit}</p>
          </div>
        </>
      )}

      {/* 施術履歴 */}
      {tab === "visits" && (
        <div className="space-y-4">
          {visitList.length === 0 && (
            <p className="text-black">施術履歴はまだありません。</p>
          )}

          {visitList.map((v) => (
            <div
              key={v.id}
              className="bg-white p-6 rounded-lg shadow relative text-black"
            >
              <Link
                to={`/visits/${v.id}/edit`}
                className="absolute top-4 right-20 text-sm underline text-black z-10"
              >
                編集
              </Link>

              <button
                onClick={() => {
                  if (confirm("この施術履歴を削除しますか？")) {
                    setVisitList(visitList.filter((item) => item.id !== v.id));
                  }
                }}
                className="absolute top-4 right-4 text-sm text-red-600 underline z-20"
              >
                削除
              </button>

              <h2 className="text-lg font-semibold mb-2">{v.date}</h2>
              <p>施術タイプ：{v.type}</p>
              <p>施術時間：{v.duration}分</p>
              <p>圧の強度：{v.pressure}</p>
              <p className="mt-2">メモ：{v.memo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
