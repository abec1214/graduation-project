import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "../api";

export default function CustomerDetail() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const id = Number(customerId);

  // =========================
  // 顧客データ
  // =========================
  const [customerData, setCustomerData] = useState(null);

  const customer = customerData?.customer;
  const history = customerData?.visits || [];

  // =========================
  // タブ
  // =========================
  const [activeTab, setActiveTab] = useState("basic");

  // =========================
  // 施術履歴編集
  // =========================
  const [editingIndex, setEditingIndex] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editMenu, setEditMenu] = useState("");

  // =========================
  // 施術履歴追加
  // =========================
  const [addingHistory, setAddingHistory] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newMenu, setNewMenu] = useState("");

  // =========================
  // メモ編集
  // =========================
  const [memoText, setMemoText] = useState("");
  const [editingMemo, setEditingMemo] = useState(false);

  // =========================
  // 個人情報編集
  // =========================
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [job, setJob] = useState("");

  // =========================
  // 連絡先編集
  // =========================
  const [editingContact, setEditingContact] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // =========================
  // 次回予約編集
  // =========================
  const [isEditingNext, setIsEditingNext] = useState(false);
  const [nextReservationInput, setNextReservationInput] = useState("");

  // =========================
  // 顧客詳細取得
  // =========================
  const fetchCustomerDetail = async () => {
    try {
      const res = await fetch(`${API_URL}/api/customers/${id}`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "顧客情報の取得に失敗しました");
      }

      console.log("顧客詳細取得:", data);

      const customerInfo = {
        customer: data.customer,
        visits: data.visits ?? [],
      };

      setCustomerData(customerInfo);

      // =========================
      // 編集用データをセット
      // =========================
      setMemoText(data.customer?.memo ?? "");

      setBirthday(
        data.customer?.birthday
          ? String(data.customer.birthday).slice(0, 10)
          : "",
      );

      setGender(data.customer?.gender ?? "");
      setJob(data.customer?.job ?? "");

      setPhone(data.customer?.phone ?? "");
      setEmail(data.customer?.email ?? "");
      setAddress(data.customer?.address ?? "");

      setNextReservationInput(data.customer?.nextReservation ?? "");
    } catch (err) {
      console.error("顧客詳細取得エラー:", err);
    }
  };

  // =========================
  // 初回取得
  // =========================
  useEffect(() => {
    if (!Number.isNaN(id)) {
      fetchCustomerDetail();
    }
  }, [id]);

  // =========================
  // 顧客情報更新
  // =========================
  const updateCustomer = async (customerIdValue, data) => {
    try {
      let endpoint = "";

      // =========================
      // 個人情報
      // =========================
      if (
        data.birthday !== undefined ||
        data.gender !== undefined ||
        data.job !== undefined
      ) {
        endpoint = `/api/customers/${customerIdValue}/personal`;
      }

      // =========================
      // 連絡先
      // =========================
      else if (
        data.phone !== undefined ||
        data.email !== undefined ||
        data.address !== undefined
      ) {
        endpoint = `/api/customers/${customerIdValue}/contact`;
      }

      // =========================
      // メモ
      // =========================
      else if (data.memo !== undefined) {
        endpoint = `/api/customers/${customerIdValue}/memo`;
      }

      // =========================
      // 次回予約
      // =========================
      else if (data.nextReservation !== undefined) {
        endpoint = `/api/customers/${customerIdValue}/next`;
      }

      // =========================
      // 最終来院日
      // =========================
      else if (data.lastVisit !== undefined) {
        endpoint = `/api/customers/${customerIdValue}/lastVisit`;
      }

      // =========================
      // 更新対象不明
      // =========================
      else {
        console.error("更新対象が不明:", data);
        return false;
      }

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.error || "顧客情報の更新に失敗しました");
      }

      console.log("顧客情報更新成功:", result);

      // 最新データを再取得
      await fetchCustomerDetail();

      return true;
    } catch (err) {
      console.error("顧客情報更新エラー:", err);
      alert("顧客情報の保存に失敗しました");
      return false;
    }
  };

  // =========================
  // 施術履歴追加
  // =========================
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

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.error || "履歴の追加に失敗しました");
      }

      console.log("履歴追加成功:", result);

      await fetchCustomerDetail();

      setNewDate("");
      setNewMenu("");
      setAddingHistory(false);
    } catch (err) {
      console.error("履歴追加エラー:", err);
      alert("施術履歴の保存に失敗しました");
    }
  };

  // =========================
  // 施術履歴更新
  // =========================
  const updateVisit = async (visitId) => {
    console.log("★★★ updateVisit 呼び出し ★★★", {
      visitId,
      editDate,
      editMenu,
    });
    if (!editDate || !editMenu) {
      alert("日付とメニューを入力してください");
      return;
    }

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

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.error || "施術履歴の更新に失敗しました");
      }

      await fetchCustomerDetail();

      setEditingIndex(null);
      setEditDate("");
      setEditMenu("");
    } catch (err) {
      console.error("施術履歴更新エラー:", err);
      alert("施術履歴の更新に失敗しました");
    }
  };

  // =========================
  // 施術履歴削除
  // =========================
  const deleteVisit = async (visitId) => {
    const confirmed = window.confirm("この施術履歴を削除しますか？");

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/visits/${visitId}`, {
        method: "DELETE",
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.error || "施術履歴の削除に失敗しました");
      }

      await fetchCustomerDetail();
    } catch (err) {
      console.error("施術履歴削除エラー:", err);
      alert("施術履歴の削除に失敗しました");
    }
  };

  // =========================
  // 顧客削除
  // =========================
  const deleteCustomer = async (customerIdValue) => {
    try {
      const res = await fetch(`${API_URL}/api/customers/${customerIdValue}`, {
        method: "DELETE",
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.error || "顧客の削除に失敗しました");
      }

      // 顧客一覧へ移動
      navigate("/customers");
    } catch (err) {
      console.error("顧客削除エラー:", err);
      alert("顧客の削除に失敗しました");
    }
  };

  // =========================
  // 年齢計算
  // =========================
  const calculateAge = (birthdayValue) => {
    if (!birthdayValue) {
      return "";
    }

    const birthDate = new Date(birthdayValue);

    if (Number.isNaN(birthDate.getTime())) {
      return "";
    }

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

  // =========================
  // 顧客データ取得中
  // =========================
  if (!customerData) {
    return (
      <div className="p-8 bg-[#f9f5ee] min-h-screen text-[#1f3b33] font-sans">
        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="text-[#2a2a2a] hover:text-[#1f3b33] font-medium mb-6"
        >
          ← 顧客一覧に戻る
        </button>

        <p>顧客情報を読み込んでいます...</p>
      </div>
    );
  }

  // =========================
  // 顧客が存在しない
  // =========================
  if (!customer) {
    return (
      <div className="p-8 bg-[#f9f5ee] min-h-screen text-[#1f3b33] font-sans">
        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="text-[#2a2a2a] hover:text-[#1f3b33] font-medium mb-6"
        >
          ← 顧客一覧に戻る
        </button>

        <p>顧客が見つかりませんでした</p>
      </div>
    );
  }

  // =========================
  // JSX
  // =========================
  return (
    <div
      className="p-8 bg-[#f9f5ee] min-h-screen text-[#1f3b33] font-sans"
      style={{
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* ==================================================
          顧客名 + 戻るボタン + 次回予約
      ================================================== */}
      <div className="flex items-center justify-between mb-4">
        {/* 左側：戻る + 顧客名 */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="text-[#2a2a2a] hover:text-[#1f3b33] font-medium mr-4"
          >
            ← 戻る
          </button>

          <h2 className="text-3xl font-bold">{customer.name}</h2>
        </div>

        {/* 右側：次回予約 */}
        {isEditingNext ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={nextReservationInput}
              onChange={(e) => setNextReservationInput(e.target.value)}
              placeholder="例：2026-08-10 14:00"
              className="p-2 border border-gray-300 rounded bg-white text-black"
            />

            <button
              type="button"
              onClick={async () => {
                const success = await updateCustomer(customer.id, {
                  nextReservation: nextReservationInput,
                });

                if (success) {
                  setIsEditingNext(false);
                }
              }}
              className="px-3 py-1 bg-[#1f3b33] text-white rounded"
            >
              保存
            </button>

            <button
              type="button"
              onClick={() => {
                setIsEditingNext(false);
                setNextReservationInput(customer.nextReservation ?? "");
              }}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              キャンセル
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-700 bg-white px-3 py-1 rounded-md border border-gray-300">
              次回予約：
              {customer.nextReservation || "未設定"}
            </p>

            <button
              type="button"
              onClick={() => {
                setNextReservationInput(customer.nextReservation ?? "");
                setIsEditingNext(true);
              }}
              className="text-sm text-blue-600 underline"
            >
              編集
            </button>
          </div>
        )}
      </div>

      {/* ==================================================
          年齢
      ================================================== */}
      <p className="text-gray-700 mb-4">
        ・{calculateAge(customer.birthday)}歳
      </p>

      {/* ==================================================
          タブ
      ================================================== */}
      <div className="flex gap-6 border-b border-gray-300 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("basic")}
          className={`pb-2 ${
            activeTab === "basic"
              ? "font-bold border-b-2 border-[#1f3b33]"
              : "text-gray-500 hover:text-[#1f3b33]"
          }`}
        >
          基本情報
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`pb-2 ${
            activeTab === "history"
              ? "font-bold border-b-2 border-[#1f3b33]"
              : "text-gray-500 hover:text-[#1f3b33]"
          }`}
        >
          施術履歴
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("memo")}
          className={`pb-2 ${
            activeTab === "memo"
              ? "font-bold border-b-2 border-[#1f3b33]"
              : "text-gray-500 hover:text-[#1f3b33]"
          }`}
        >
          メモ
        </button>
      </div>

      {/* ==================================================
          基本情報タブ
      ================================================== */}
      {activeTab === "basic" && (
        <>
          {/* =========================
              個人情報
          ========================= */}
          <div className="bg-white shadow p-6 rounded-lg mb-6">
            <h3 className="font-bold mb-3">個人情報</h3>

            {!editingPersonal ? (
              <>
                <p>
                  生年月日：
                  {customer.birthday
                    ? String(customer.birthday).slice(0, 10)
                    : "未設定"}
                </p>

                <p>
                  性別：
                  {customer.gender || "未設定"}
                </p>

                <p>
                  職業：
                  {customer.job || "未設定"}
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
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

                  <button
                    type="button"
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={async () => {
                      if (!window.confirm("この顧客を削除しますか？")) {
                        return;
                      }

                      await deleteCustomer(id);
                    }}
                  >
                    削除
                  </button>
                </div>
              </>
            ) : (
              <>
                <label className="block mb-2">
                  生年月日
                  <input
                    type="text"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    placeholder="例：1995-01-01"
                    className="border p-2 rounded w-full"
                  />
                </label>

                <label className="block mb-2">
                  性別
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">未設定</option>

                    <option value="男性">男性</option>

                    <option value="女性">女性</option>

                    <option value="その他">その他</option>
                  </select>
                </label>

                <label className="block mb-2">
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
                    type="button"
                    className="bg-[#1f3b33] text-white px-3 py-1 rounded"
                    onClick={async () => {
                      const success = await updateCustomer(id, {
                        birthday,
                        gender,
                        job,
                      });

                      if (success) {
                        setEditingPersonal(false);
                      }
                    }}
                  >
                    保存
                  </button>

                  <button
                    type="button"
                    className="bg-gray-300 px-3 py-1 rounded"
                    onClick={() => {
                      setEditingPersonal(false);

                      setBirthday(
                        customer.birthday
                          ? String(customer.birthday).slice(0, 10)
                          : "",
                      );

                      setGender(customer.gender ?? "");

                      setJob(customer.job ?? "");
                    }}
                  >
                    キャンセル
                  </button>
                </div>
              </>
            )}
          </div>

          {/* =========================
              連絡先
          ========================= */}
          <div className="bg-white shadow p-6 rounded-lg mb-6">
            <h3 className="font-bold mb-3">連絡先</h3>

            {!editingContact ? (
              <>
                <p>📞 {customer.phone || "未設定"}</p>

                <p>📧 {customer.email || "未設定"}</p>

                <p>🏠 {customer.address || "未設定"}</p>

                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
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

                  <button
                    type="button"
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={async () => {
                      if (!window.confirm("この顧客を削除しますか？")) {
                        return;
                      }

                      await deleteCustomer(id);
                    }}
                  >
                    削除
                  </button>
                </div>
              </>
            ) : (
              <>
                <label className="block mb-2">
                  電話番号
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </label>

                <label className="block mb-2">
                  メールアドレス
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </label>

                <label className="block mb-2">
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
                    type="button"
                    className="bg-[#1f3b33] text-white px-3 py-1 rounded"
                    onClick={async () => {
                      const success = await updateCustomer(id, {
                        phone,
                        email,
                        address,
                      });

                      if (success) {
                        setEditingContact(false);
                      }
                    }}
                  >
                    保存
                  </button>

                  <button
                    type="button"
                    className="bg-gray-300 px-3 py-1 rounded"
                    onClick={() => {
                      setEditingContact(false);

                      setPhone(customer.phone ?? "");

                      setEmail(customer.email ?? "");

                      setAddress(customer.address ?? "");
                    }}
                  >
                    キャンセル
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* ==================================================
          施術履歴タブ
      ================================================== */}
      {activeTab === "history" && (
        <>
          <div className="bg-white shadow p-6 rounded-lg mb-6">
            <h3 className="font-bold mb-3">施術履歴</h3>

            {/* 履歴追加ボタン */}
            <div className="flex justify-end mb-4">
              <button
                type="button"
                className="bg-[#1f3b33] text-white px-3 py-1 rounded"
                onClick={() => setAddingHistory(true)}
              >
                ＋ 履歴を追加
              </button>
            </div>

            {/* 履歴追加フォーム */}
            {addingHistory && (
              <div className="mb-6 p-4 border rounded bg-gray-50">
                <h4 className="font-bold mb-2">新しい施術履歴を追加</h4>

                <label className="block mb-2">
                  日付
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="例：2026-08-14"
                    className="border p-2 rounded w-full"
                  />
                </label>

                <label className="block mb-2">
                  メニュー
                  <input
                    type="text"
                    value={newMenu}
                    onChange={(e) => setNewMenu(e.target.value)}
                    placeholder="例：カット"
                    className="border p-2 rounded w-full"
                  />
                </label>

                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    className="bg-[#1f3b33] text-white px-3 py-1 rounded"
                    onClick={addVisit}
                  >
                    保存
                  </button>

                  <button
                    type="button"
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
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-gray-500">施術履歴はありません</p>
              ) : (
                history.map((h, index) => (
                  <div key={h.id ?? index} className="border-b pb-3">
                    {editingIndex === index ? (
                      <>
                        <input
                          type="text"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="border p-2 rounded w-full mb-2"
                        />

                        <input
                          type="text"
                          value={editMenu}
                          onChange={(e) => setEditMenu(e.target.value)}
                          className="border p-2 rounded w-full mb-2"
                        />

                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="bg-[#1f3b33] text-white px-3 py-1 rounded"
                            onClick={() => updateVisit(h.id)}
                          >
                            保存
                          </button>

                          <button
                            type="button"
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
                          <p className="font-semibold">{h.date}</p>

                          <p className="text-gray-700">{h.menu}</p>
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            className="text-blue-600 hover:underline text-sm"
                            onClick={() => {
                              setEditingIndex(index);

                              setEditDate(h.date ?? "");

                              setEditMenu(h.menu ?? "");
                            }}
                          >
                            編集
                          </button>

                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 text-sm"
                            onClick={() => deleteVisit(h.id)}
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* ==================================================
          メモタブ
      ================================================== */}
      {activeTab === "memo" && (
        <>
          <div className="bg-white shadow p-6 rounded-lg mb-6">
            <h3 className="font-bold mb-3">メモ</h3>

            {!editingMemo ? (
              <>
                <p className="text-gray-700 whitespace-pre-line">
                  {customer.memo || "メモなし"}
                </p>

                <button
                  type="button"
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
                  rows={5}
                />

                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={async () => {
                      const success = await updateCustomer(id, {
                        memo: memoText,
                      });

                      if (success) {
                        setEditingMemo(false);
                      }
                    }}
                    className="bg-[#1f3b33] text-white px-3 py-1 rounded"
                  >
                    保存
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingMemo(false);
                      setMemoText(customer.memo ?? "");
                    }}
                    className="bg-gray-300 px-3 py-1 rounded"
                  >
                    キャンセル
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
