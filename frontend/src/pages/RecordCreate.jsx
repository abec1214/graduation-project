// src/pages/RecordCreate.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import { addReservation } from "../data/reservations";

export default function RecordCreate() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/customers`)
      .then((res) => res.json())
      .then((data) => {
        console.log("新規カルテ用 顧客一覧:", data);
        setCustomers(data);
      })
      .catch((err) => {
        console.error("顧客一覧の取得に失敗:", err);
      });
  }, []);

  const [form, setForm] = useState({
    customerId: "",
    date: "",
    startTime: "",
    duration: "",
    type: "",
    pressure: "中",
    allergy: "",
    memo: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCustomer = customers.find(
      (customer) => customer.id === Number(form.customerId),
    );

    if (!selectedCustomer) {
      alert("顧客を選択してください");
      return;
    }

    const reservationDate = `${form.date} ${form.startTime}`;

    try {
      const res = await fetch(`${API_URL}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: selectedCustomer.id,
          reservation_date: reservationDate,
          duration: Number(form.duration),
          type: form.type,
          pressure: form.pressure,
          allergy: form.allergy,
          memo: form.memo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "予約の保存に失敗しました");
      }

      console.log("予約保存成功:", data);

      addReservation({
        patientId: selectedCustomer.id,
        name: selectedCustomer.name,
        kana: selectedCustomer.kana || "",
        date: reservationDate,
        count: (selectedCustomer.history?.length ?? 0) + 1,
        duration: Number(form.duration),
        type: form.type,
        pressure: form.pressure,
        allergy: form.allergy,
        memo: form.memo,
      });

      alert("予約を追加しました！");
      navigate("/reservations");
    } catch (err) {
      console.error("予約保存エラー:", err);
      alert("予約の保存に失敗しました");
    }
  };

  return (
    <div className="space-y-8 p-6 bg-[#f9f5ee] rounded-lg shadow">
      {/* ========================================
          戻るボタン ＋ ページタイトル
      ======================================== */}
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-[#2a2a2a] hover:text-[#1f3b33] font-medium mr-4"
        >
          ← 戻る
        </button>

        <h1 className="text-2xl font-bold text-[#2a2a2a]">新規カルテ作成</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 顧客名 */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-800">
            顧客名
          </label>

          <select
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white shadow-sm"
            required
          >
            <option value="">顧客を選択してください</option>

            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        {/* 施術日・開始時間・施術時間 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              施術日
            </label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white shadow-sm"
              style={{ colorScheme: "light" }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              開始時間
            </label>

            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white shadow-sm"
              style={{ colorScheme: "light" }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              施術時間（分）
            </label>

            <input
              type="number"
              name="duration"
              placeholder="例：60"
              value={form.duration}
              onChange={handleChange}
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white shadow-sm"
              required
            />
          </div>
        </div>

        {/* 施術タイプ・圧 */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              施術タイプ
            </label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white shadow-sm"
            >
              <option value="">選択してください</option>

              <option value="スウェーデンマッサージ">
                スウェーデンマッサージ
              </option>

              <option value="アロマトリートメント">アロマトリートメント</option>

              <option value="整体">整体</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              圧の強度
            </label>

            <select
              name="pressure"
              value={form.pressure}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white shadow-sm"
            >
              <option value="弱">弱</option>
              <option value="中">中</option>
              <option value="強">強</option>
            </select>
          </div>
        </div>

        {/* アレルギー */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-800">
            アレルギー
          </label>

          <input
            type="text"
            name="allergy"
            placeholder="例：ラベンダーオイル / 特になし"
            value={form.allergy}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white shadow-sm"
          />
        </div>

        {/* メモ */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-800">
            施術メモ・所見
          </label>

          <textarea
            name="memo"
            value={form.memo}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white shadow-sm"
          ></textarea>
        </div>

        {/* 保存 */}
        <button
          type="submit"
          className="bg-[#1f3b33] text-white px-5 py-2 rounded-lg hover:bg-[#2a4a40]"
        >
          保存する
        </button>
      </form>
    </div>
  );
}
