// src/pages/Reservations.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);

  // MySQLから予約一覧を取得
  useEffect(() => {
    fetch("http://localhost:3001/api/reservations")
      .then((res) => {
        if (!res.ok) {
          throw new Error("予約一覧の取得に失敗しました");
        }
        return res.json();
      })
      .then((data) => {
        console.log("予約一覧:", data);
        console.log("予約1件目:", data[0]);
        console.log("patientId:", data[0]?.patientId);

        setReservations(data);
      })
      .catch((err) => {
        console.error("予約一覧の取得に失敗:", err);
      });
  }, []);

  // 予約削除
  const handleDelete = async (id) => {
    const confirmed = window.confirm("この予約を削除してもよろしいですか？");

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/reservations/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("予約の削除に失敗しました");
      }

      // 画面からも削除
      setReservations((prev) =>
        prev.filter((reservation) => reservation.id !== id),
      );

      console.log("予約を削除しました:", id);
    } catch (err) {
      console.error("予約削除エラー:", err);
      alert("予約の削除に失敗しました");
    }
  };

  // 日時を見やすく表示
  const formatDateTime = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 bg-[#f9f5ee] p-8 text-black">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">予約管理</h1>

        <Link
          to="/reservations/create"
          className="bg-[#1f3b33] text-white px-4 py-2 rounded hover:bg-[#2a4a40]"
        >
          ＋ 予約追加
        </Link>
      </div>

      <h2 className="text-lg font-semibold mb-4">次回予約一覧</h2>

      <div className="bg-white rounded-lg shadow divide-y">
        {reservations.length === 0 ? (
          <p className="p-6 text-gray-500">予約はありません</p>
        ) : (
          reservations.map((r) => {
            console.log("予約データ:", r);
            console.log("patientId:", r.patientId);

            return (
              <div
                key={r.id}
                className="flex items-center justify-between p-4 hover:bg-[#f9f5ee] transition"
              >
                {/* 左側：顧客情報 */}
                <Link
                  to={`/customers/${r.patientId}`}
                  className="flex items-center space-x-4 flex-1"
                >
                  <div className="bg-[#1f3b33] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {r.name?.[0] || "？"}
                  </div>

                  <div>
                    <p className="font-semibold">{r.name || "顧客名なし"}</p>

                    <p className="text-sm text-gray-600">{r.kana || ""}</p>
                  </div>
                </Link>

                {/* 右側：予約情報＋削除 */}
                <div className="flex items-center gap-6">
                  <Link to={`/customers/${r.patientId}`} className="text-right">
                    <p className="font-mono">
                      {formatDateTime(r.reservation_date || r.date)}
                    </p>

                    <p className="text-sm text-gray-600">{r.type || ""}</p>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
                  >
                    削除
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
