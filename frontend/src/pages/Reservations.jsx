// src/pages/Reservations.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../api";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [editingReservation, setEditingReservation] = useState(null);

  // MySQLから予約一覧を取得
  useEffect(() => {
    fetch(`${API_URL}/api/reservations`)
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
  // 予約編集
  const handleEdit = (reservation) => {
    const rawDate = reservation.reservation_date || reservation.date || "";

    let reservationDate = "";
    let startTime = "";

    if (rawDate) {
      const date = new Date(rawDate);

      if (!Number.isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        reservationDate = `${year}-${month}-${day}`;
        startTime = `${hours}:${minutes}`;
      }
    }

    setEditingReservation({
      ...reservation,
      reservationDate,
      startTime,
      duration: reservation.duration || "",
      type: reservation.type || "",
      pressure: reservation.pressure || "",
      allergy: reservation.allergy || "",
      memo: reservation.memo || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingReservation) {
      return;
    }

    if (!editingReservation.reservation_date) {
      alert("予約日時を入力してください");
      return;
    }
    if (!editingReservation.type.trim()) {
      alert("施術タイプを入力してください");
      return;
    }

    try {
      console.log("保存する予約データ:", editingReservation);
      const res = await fetch(
        `${API_URL}/api/reservations/${editingReservation.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: editingReservation.patientId,
            reservation_date: editingReservation.reservation_date,
            duration: Number(editingReservation.duration),
            type: editingReservation.type,
            pressure: editingReservation.pressure,
            allergy: editingReservation.allergy || null,
            memo: editingReservation.memo || null,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("予約の更新に失敗しました");
      }

      await res.json();

      const refreshed = await fetch(`${API_URL}/api/reservations`);

      if (!refreshed.ok) {
        throw new Error("予約一覧の再取得に失敗しました");
      }

      const data = await refreshed.json();

      setReservations(data);

      setEditingReservation(null);
      alert("予約を更新しました");
    } catch (err) {
      console.error("予約更新エラー:", err);
      alert("予約の更新に失敗しました");
    }
  };

  // 予約削除
  const handleDelete = async (id) => {
    const confirmed = window.confirm("この予約を削除してもよろしいですか？");

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/reservations/${id}`, {
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
    <div className="flex-1 min-h-screen bg-[#f9f5ee] p-8 text-black">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {editingReservation && (
            <button
              type="button"
              onClick={() => setEditingReservation(null)}
              className="text-xl font-semibold hover:underline"
            >
              ← 戻る
            </button>
          )}

          <h1 className="text-3xl font-bold">予約管理</h1>
        </div>

        <Link
          to="/reservations/create"
          className="bg-[#1f3b33] text-white px-4 py-2 rounded hover:bg-[#2a4a40]"
        >
          ＋ 予約追加
        </Link>
      </div>

      <h2 className="text-lg font-semibold mb-4">次回予約一覧</h2>
      {editingReservation && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 施術日 */}
            <div>
              <label className="block text-sm font-semibold mb-1">施術日</label>
              <input
                type="date"
                value={editingReservation.reservationDate}
                onChange={(e) =>
                  setEditingReservation((prev) => ({
                    ...prev,
                    reservationDate: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2 text-black
    [&::-webkit-calendar-picker-indicator]:opacity-100
    [&::-webkit-calendar-picker-indicator]:filter
    [&::-webkit-calendar-picker-indicator]:brightness-0
    [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>

            {/* 開始時間 */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                開始時間
              </label>
              <input
                type="time"
                value={editingReservation.startTime}
                onChange={(e) =>
                  setEditingReservation((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2 text-black
    [&::-webkit-calendar-picker-indicator]:opacity-100
    [&::-webkit-calendar-picker-indicator]:filter
    [&::-webkit-calendar-picker-indicator]:brightness-0
    [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>

            {/* 施術時間 */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                施術時間（分）
              </label>
              <input
                type="number"
                min="1"
                value={editingReservation.duration}
                onChange={(e) =>
                  setEditingReservation((prev) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2 text-black [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:invert-[1] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                placeholder="例：60"
              />
            </div>

            {/* 施術タイプ */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                施術タイプ
              </label>
              <select
                value={editingReservation.type}
                onChange={(e) =>
                  setEditingReservation((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2 text-black bg-white"
              >
                <option value="">選択してください</option>
                <option value="スウェーデンマッサージ">
                  スウェーデンマッサージ
                </option>
                <option value="アロマトリートメント">
                  アロマトリートメント
                </option>
                <option value="整体">整体</option>
              </select>
            </div>

            {/* 圧の強度 */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                圧の強度
              </label>
              <select
                value={editingReservation.pressure}
                onChange={(e) =>
                  setEditingReservation((prev) => ({
                    ...prev,
                    pressure: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2 text-black bg-white"
              >
                <option value="">選択してください</option>
                <option value="弱">弱</option>
                <option value="中">中</option>
                <option value="強">強</option>
              </select>
            </div>

            {/* アレルギー */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                アレルギー
              </label>
              <input
                type="text"
                value={editingReservation.allergy}
                onChange={(e) =>
                  setEditingReservation((prev) => ({
                    ...prev,
                    allergy: e.target.value,
                  }))
                }
                placeholder="例：ラベンダーオイル / 特になし"
                className="w-full border rounded px-3 py-2 text-black [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:invert-[1] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>

            {/* メモ */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">メモ</label>
              <textarea
                value={editingReservation.memo}
                onChange={(e) =>
                  setEditingReservation((prev) => ({
                    ...prev,
                    memo: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2 text-black"
                rows="3"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setEditingReservation(null)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              キャンセル
            </button>

            <button
              type="button"
              onClick={handleUpdate}
              className="bg-[#1f3b33] text-white px-4 py-2 rounded hover:bg-[#2a4a40]"
            >
              保存
            </button>
          </div>
        </div>
      )}
      {!editingReservation && (
        <div className="bg-white rounded-lg shadow divide-y">
          {reservations.length === 0 ? (
            <p className="p-6 text-gray-500">予約がありません</p>
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
                    <Link
                      to={`/customers/${r.patientId}`}
                      className="text-right"
                    >
                      <p className="font-mono">
                        {formatDateTime(r.reservation_date || r.date)}
                      </p>

                      <p className="text-sm text-gray-600">{r.type || ""}</p>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleEdit(r)}
                      className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
                    >
                      編集
                    </button>

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
      )}
    </div>
  );
}
