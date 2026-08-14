// src/pages/CustomerEdit.jsx
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import { customers, updateCustomer } from "../data/customers"; // ★ 修正ポイント

export default function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  // id に一致する顧客を取得
  const customer = customers.find((c) => c.id === Number(id));

  // フォームの状態
  const [form, setForm] = useState({
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    memo: customer.memo || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ★ 顧客情報を更新
    updateCustomer(customer.id, form);

    alert("顧客情報を更新しました");
    navigate("/customers"); // 一覧へ戻る
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">顧客情報を編集</h2>

      <p className="mb-4">顧客ID: {id}</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-4 rounded space-y-4"
      >
        <div>
          <label className="block mb-1 font-bold">名前</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-bold">電話番号</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-bold">メール</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-bold">メモ</label>
          <textarea
            name="memo"
            value={form.memo}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            rows="4"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          保存する
        </button>
      </form>
    </Layout>
  );
}
