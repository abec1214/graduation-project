// src/pages/ReservationDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../api";

export default function ReservationDetail() {
  const { customerId } = useParams();
  const id = Number(customerId);

  const [activeTab, setActiveTab] = useState("basic");
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 施術履歴編集用
  const [editingIndex, setEditingIndex] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editMenu, setEditMenu] = useState("");

  // 履歴追加用
  const [addingHistory, setAddingHistory] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newMenu, setNewMenu] = useState("");

  // メモ編集用
  const [editingMemo, setEditingMemo] = useState(false);
  const [memoText, setMemoText] = useState("");

  // 個人情報編集用
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [job, setJob] = useState("");

  // 連絡先編集用
  const [editingContact, setEditingContact] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // 次回予約編集用
  const [isEditingNext, setIsEditingNext] = useState(false);
  const [nextReservationInput, setNextReservationInput] = useState("");

  const customer = customerData?.customer;
  const history = customerData?.visits || [];

  // ============================
  // 顧客詳細取得
  // ============================
  const fetchCustomerDetail = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/customers/${id}`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "顧客情報の取得に失敗しました");
      }

      console.log("顧客詳細取得:", data);

      setCustomerData({
        customer: data.customer,
        visits: data.visits ?? [],
      });

      setMemoText(data.customer.memo ?? "");
      setBirthday(
        data.customer.birthday
          ? String(data.customer.birthday).slice(0, 10)
          : "",
      );
      setGender(data.customer.gender ?? "");
      setJob(data.customer.job ?? "");
      setPhone(data.customer.phone ?? "");
      setEmail(data.customer.email ?? "");
      setAddress(data.customer.address ?? "");
      setNextReservationInput(data.customer.nextReservation ?? "");
    } catch (err) {
      console.error("顧客詳細取得エラー:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerDetail();
  }, [id]);

  // ============================
  // 顧客情報更新
  // ============================
  const updateCustomer = async (data) => {
    try {
      let endpoint = "";

      if (
        data.birthday !== undefined ||
        data.gender !== undefined ||
        data.job !== undefined
      ) {
        endpoint = `/api/customers/${id}/personal`;
      } else if (
        data.phone !== undefined ||
        data.email !== undefined ||
        data.address !== undefined
      ) {
        endpoint = `/api/customers/${id}/contact`;
      } else if (data.memo !== undefined) {
        endpoint = `/api/customers/${id}/memo`;
      } else if (data.nextReservation !== undefined) {
        endpoint = `/api/customers/${id}/next`;
      } else {
        console.error("更新対象が不明:", data);
        return;
      }

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "顧客情報の更新に失敗しました");
      }

      await fetchCustomerDetail();
    } catch (err) {
      console.error("顧客情報更新エラー:", err);
      alert("顧客情報の保存に失敗しました");
    }
  };

  // ============================
  // 施術履歴追加
  // ============================
  const addVisit = async () => {
    if (!newDate || !newMenu) {
      alert("日付とメニューを入力してください");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/customers/${id}/visits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: newDate,
          menu: newMenu,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "履歴の追加に失敗しました");
      }

      await fetchCustomerDetail();

      setNewDate("");
      setNewMenu("");
      setAddingHistory(false);
    } catch (err) {
      console.error("履歴追加エラー:", err);
      alert("施術履歴の保存に失敗しました");
    }
  };

  // ============================
  // 施術履歴編集
  // ============================
  const updateVisit = async (visitId) => {
    try {
      const res = await fetch(`${API_URL}/api/visits/${visitId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: editDate,
          menu: editMenu,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "履歴の更新に失敗しました");
      }

      await fetchCustomerDetail();

      setEditingIndex(null);
      setEditDate("");
      setEditMenu("");
    } catch (err) {
      console.error("履歴更新エラー:", err);
      alert("施術履歴の更新に失敗しました");
    }
  };

  // ============================
  // 施術履歴削除
  // ============================
  const deleteVisit = async (visitId) => {
    if (!window.confirm("この施術履歴を削除しますか？")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/visits/${visitId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "履歴の削除に失敗しました");
      }

      await fetchCustomerDetail();
    } catch (err) {
      console.error("履歴削除エラー:", err);
      alert("施術履歴の削除に失敗しました");
    }
  };

  // ============================
  // 顧客削除
  // ============================
  const deleteCustomer = async () => {
    if (!window.confirm("この顧客を削除しますか？")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/customers/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "顧客の削除に失敗しました");
      }

      alert("顧客を削除しました");
      window.location.href = "/customers";
    } catch (err) {
      console.error("顧客削除エラー:", err);
      alert("顧客の削除に失敗しました");
    }
  };

  // ============================
  // 年齢計算
  // ============================
  const calculateAge = (birthday) => {
    if (!birthday) return null;

    const birthDate = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // ============================
  // 日付表示
  // ============================
  const formatDateTime = (value) => {
    if (!value) return "";

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

  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // ============================
  // 読み込み中
  // ============================
  if (loading) {
    return (
      <div className="p-8 bg-[#f9f5ee] min-h-screen text-[#1f3b33]">
        顧客情報を読み込んでいます...
      </div>
    );
  }

  // ============================
  // 顧客なし
  // ============================
  if (!customer) {
    return (
      <div className="p-8 bg-[#f9f5ee] min-h-screen text-[#1f3b33]">
        顧客が見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#f9f5ee] min-h-screen font-sans text-[#1f3b33]">
      {/* ============================
          ヘッダー
      ============================ */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{customer.name}</h1>

          <p className="text-gray-600 mt-1">
            {calculateAge(customer.birthday) !== null
              ? `・${calculateAge(customer.birthday)}歳`
              : ""}
          </p>
        </div>

        <button
          onClick={deleteCustomer}
          className="border border-red-400 text-red-600 px-3 py-1 rounded hover:bg-red-50"
        >
          顧客を削除
        </button>
      </div>

      {/* ============================
          タブ
      ============================ */}
      <div className="flex border-b mb-6">
        {[
          { key: "basic", label: "基本情報" },
          { key: "history", label: "施術履歴" },
          { key: "memo", label: "メモ" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab.key
                ? "border-b-2 border-[#1f3b33] text-[#1f3b33]"
                : "text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================
          基本情報
      ============================ */}
      {activeTab === "basic" && (
        <div className="space-y-6">
          {/* 個人情報 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-bold mb-4">個人情報</h2>

            {!editingPersonal ? (
              <>
                <p>
                  生年月日：
                  {customer.birthday ? formatDate(customer.birthday) : "未登録"}
                </p>

                <p>
                  性別：
                  {customer.gender || "未登録"}
                </p>

                <p>
                  職業：
                  {customer.job || "未登録"}
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    onClick={() => {
                      setEditingPersonal(true);
                      setBirthday(
                        customer.birthday
                          ? String(customer.birthday).slice(0, 10)
                          : "",
                      );
                      setGender(customer.gender ?? "");
                      setJob(customer.job ?? "");
                    }}
                  >
                    編集
                  </button>
                </div>
              </>
            ) : (
              <>
                <label className="block mb-3">
                  生年月日
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </label>

                <label className="block mb-3">
                  性別
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">未選択</option>
                    <option value="男性">男性</option>
                    <option value="女性">女性</option>
                    <option value="その他">その他</option>
                  </select>
                </label>

                <label className="block mb-3">
                  職業
                  <input
                    type="text"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </label>

                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-[#1f3b33] text-white px-3 py-1 rounded"
                    onClick={async () => {
                      await updateCustomer({
                        birthday,
                        gender,
                        job,
                      });

                      setEditingPersonal(false);
                    }}
                  >
                    保存
                  </button>

                  <button
                    className="bg-gray-300 px-3 py-1 rounded"
                    onClick={() => setEditingPersonal(false)}
                  >
                    キャンセル
                  </button>
                </div>
              </>
            )}
          </div>

          {/* 連絡先 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-bold mb-4">連絡先</h2>

            {!editingContact ? (
              <>
                <p>📞 {customer.phone || "未登録"}</p>

                <p>📧 {customer.email || "未登録"}</p>

                <p>🏠 {customer.address || "未登録"}</p>

                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    onClick={() => {
                      setEditingContact(true);
                      setPhone(customer.phone ?? "");
                      setEmail(customer.email ?? "");
                      setAddress(customer.address ?? "");
                    }}
                  >
                    編集
                  </button>
                </div>
              </>
            ) : (
              <>
                <label className="block mb-3">
                  電話番号
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </label>

                <label className="block mb-3">
                  メールアドレス
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </label>

                <label className="block mb-3">
                  住所
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </label>

                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-[#1f3b33] text-white px-3 py-1 rounded"
                    onClick={async () => {
                      await updateCustomer({
                        phone,
                        email,
                        address,
                      });

                      setEditingContact(false);
                    }}
                  >
                    保存
                  </button>

                  <button
                    className="bg-gray-300 px-3 py-1 rounded"
                    onClick={() => setEditingContact(false)}
                  >
                    キャンセル
                  </button>
                </div>
              </>
            )}
          </div>

          {/* 次回予約 */}
          <div className="bg-[#e8f5e9] p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">次回予約</p>

                <p className="text-[#1f3b33] font-bold mt-1">
                  {customer.nextReservation
                    ? formatDateTime(customer.nextReservation)
                    : "未設定"}
                </p>
              </div>

              <button
                onClick={() => {
                  setNextReservationInput(customer.nextReservation ?? "");
                  setIsEditingNext(true);
                }}
                className="text-sm text-blue-600 underline"
              >
                編集
              </button>
            </div>

            {isEditingNext && (
              <div className="mt-4">
                <input
                  type="text"
                  value={nextReservationInput}
                  onChange={(e) => setNextReservationInput(e.target.value)}
                  placeholder="例：2026-08-15 14:00"
                  className="p-2 border border-gray-300 rounded bg-white text-black w-full"
                />

                <div className="flex gap-2 mt-3">
                  <button
                    className="bg-[#1f3b33] text-white px-3 py-1 rounded"
                    onClick={async () => {
                      await updateCustomer({
                        nextReservation: nextReservationInput,
                      });

                      setIsEditingNext(false);
                    }}
                  >
                    保存
                  </button>

                  <button
                    className="bg-gray-300 px-3 py-1 rounded"
                    onClick={() => setIsEditingNext(false)}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================
          施術履歴
      ============================ */}
      {activeTab === "history" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">施術履歴</h2>

            <button
              className="bg-[#1f3b33] text-white px-3 py-1 rounded"
              onClick={() => setAddingHistory(true)}
            >
              ＋ 履歴を追加
            </button>
          </div>

          {/* 履歴追加 */}
          {addingHistory && (
            <div className="mb-6 p-4 border rounded bg-gray-50">
              <h3 className="font-bold mb-3">新しい施術履歴</h3>

              <label className="block mb-3">
                日付
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </label>

              <label className="block mb-3">
                メニュー
                <input
                  type="text"
                  value={newMenu}
                  onChange={(e) => setNewMenu(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </label>

              <div className="flex gap-2">
                <button
                  className="bg-[#1f3b33] text-white px-3 py-1 rounded"
                  onClick={addVisit}
                >
                  保存
                </button>

                <button
                  className="bg-gray-300 px-3 py-1 rounded"
                  onClick={() => {
                    setAddingHistory(false);
                    setNewDate("");
                    setNewMenu("");
                  }}
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}

          {/* 履歴一覧 */}
          {history.length === 0 ? (
            <p className="text-gray-500">施術履歴はまだありません。</p>
          ) : (
            <div className="space-y-4">
              {history.map((h, index) => (
                <div key={h.id} className="border-b pb-4">
                  {editingIndex === index ? (
                    <>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="border p-2 rounded w-full mb-2"
                      />

                      <input
                        type="text"
                        value={editMenu}
                        onChange={(e) => setEditMenu(e.target.value)}
                        className="border p-2 rounded w-full mb-3"
                      />

                      <div className="flex gap-2">
                        <button
                          className="bg-[#1f3b33] text-white px-3 py-1 rounded"
                          onClick={() => updateVisit(h.id)}
                        >
                          保存
                        </button>

                        <button
                          className="bg-gray-300 px-3 py-1 rounded"
                          onClick={() => {
                            setEditingIndex(null);
                            setEditDate("");
                            setEditMenu("");
                          }}
                        >
                          キャンセル
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{formatDate(h.date)}</p>

                        <p className="text-gray-700">
                          {h.menu || "メニュー未登録"}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          className="text-blue-600 hover:underline text-sm"
                          onClick={() => {
                            setEditingIndex(index);
                            setEditDate(
                              h.date ? String(h.date).slice(0, 10) : "",
                            );
                            setEditMenu(h.menu ?? "");
                          }}
                        >
                          編集
                        </button>

                        <button
                          className="text-red-500 hover:text-red-700 text-sm"
                          onClick={() => deleteVisit(h.id)}
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================
          メモ
      ============================ */}
      {activeTab === "memo" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">メモ</h2>

          {!editingMemo ? (
            <>
              <p className="text-gray-700 whitespace-pre-line">
                {customer.memo || "メモはありません。"}
              </p>

              <button
                onClick={() => {
                  setMemoText(customer.memo ?? "");
                  setEditingMemo(true);
                }}
                className="mt-4 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                編集
              </button>
            </>
          ) : (
            <>
              <textarea
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                className="w-full p-3 border rounded"
                rows={6}
              />

              <div className="flex gap-2 mt-4">
                <button
                  onClick={async () => {
                    await updateCustomer({
                      memo: memoText,
                    });

                    setEditingMemo(false);
                  }}
                  className="bg-[#1f3b33] text-white px-3 py-1 rounded"
                >
                  保存
                </button>

                <button
                  onClick={() => setEditingMemo(false)}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  キャンセル
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
