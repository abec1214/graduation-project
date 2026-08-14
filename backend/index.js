const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();

app.use(cors());
app.use(bodyParser.json());

/* ============================
   顧客一覧（GET）
============================ */
app.get("/api/customers", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM customers ORDER BY id DESC");

    res.json(rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "顧客一覧の取得に失敗しました",
    });
  }
});

/* ============================
   顧客追加（POST）
============================ */
app.post("/api/customers", async (req, res) => {
  const { name, kana, phone, email, memo, birthday, gender, job, address } =
    req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO customers
        (name, kana, phone, email, memo, birthday, gender, job, address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        kana,
        phone,
        email,
        memo,
        birthday || null,
        gender || null,
        job || null,
        address || null,
      ],
    );

    res.json({
      id: result.insertId,
      name,
      kana,
      phone,
      email,
      memo,
      birthday,
      gender,
      job,
      address,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "顧客の追加に失敗しました",
    });
  }
});

/* ============================
   予約一覧（GET）
============================ */
app.get("/api/reservations", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        r.id,
        r.customer_id AS patientId,
        r.reservation_date AS date,
        r.type,
        r.duration,
        r.pressure,
        r.allergy,
        r.memo,
        c.name,
        c.kana,
        (
          SELECT COUNT(*)
          FROM reservations r2
          WHERE r2.customer_id = r.customer_id
        ) AS count
      FROM reservations r
      LEFT JOIN customers c
        ON r.customer_id = c.id
      ORDER BY r.reservation_date ASC
    `);

    console.log("★★★ APIから取得した予約一覧 ★★★", rows);

    res.json(rows);
  } catch (err) {
    console.error("予約一覧取得エラー:", err);

    res.status(500).json({
      error: "予約一覧の取得に失敗しました",
    });
  }
});

/* ============================
   予約追加（POST）
============================ */
app.post("/api/reservations", async (req, res) => {
  const {
    customer_id,
    reservation_date,
    duration,
    type,
    pressure,
    allergy,
    memo,
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO reservations
        (customer_id, reservation_date, duration, type, pressure, allergy, memo)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        reservation_date,
        duration || null,
        type || null,
        pressure || null,
        allergy || null,
        memo || null,
      ],
    );

    res.json({
      id: result.insertId,
      customer_id,
      reservation_date,
      duration,
      type,
      pressure,
      allergy,
      memo,
    });
  } catch (err) {
    console.error("予約追加エラー:", err);

    res.status(500).json({
      error: "予約の追加に失敗しました",
    });
  }
});

/* ============================
   予約削除（DELETE）
============================ */
app.delete("/api/reservations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM reservations WHERE id=?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "予約が見つかりません",
      });
    }

    console.log("予約を削除しました:", id);

    res.json({
      success: true,
    });
  } catch (err) {
    console.error("予約削除DBエラー:", err);

    res.status(500).json({
      error: "予約の削除に失敗しました",
      detail: err.message,
    });
  }
});

/* ============================
   ダッシュボード情報（GET）

   ★通常予約
   ＋
   ★顧客詳細で設定した次回予約

   の両方をダッシュボードに反映
============================ */
app.get("/api/dashboard", async (req, res) => {
  try {
    /* ============================
       今月の予約数

       reservations
       ＋
       customers.nextReservation

       同じ顧客・同じ日時は重複カウントしない
    ============================ */
    const [reservationCountRows] = await db.query(`
      SELECT COUNT(*) AS count
      FROM (
        /* 通常の予約 */
        SELECT
          r.customer_id,
          r.reservation_date
        FROM reservations r
        WHERE YEAR(r.reservation_date) = YEAR(CURDATE())
          AND MONTH(r.reservation_date) = MONTH(CURDATE())

        UNION

        /* 顧客詳細で設定した次回予約 */
        SELECT
          c.id AS customer_id,
          c.nextReservation AS reservation_date
        FROM customers c
        WHERE c.nextReservation IS NOT NULL
          AND c.nextReservation != ''
          AND YEAR(c.nextReservation) = YEAR(CURDATE())
          AND MONTH(c.nextReservation) = MONTH(CURDATE())

          /* 通常予約に同じ日時が存在する場合は除外 */
          AND NOT EXISTS (
            SELECT 1
            FROM reservations r2
            WHERE r2.customer_id = c.id
              AND DATE_FORMAT(r2.reservation_date, '%Y-%m-%d %H:%i')
                = DATE_FORMAT(c.nextReservation, '%Y-%m-%d %H:%i')
          )
      ) AS all_reservations
    `);

    /* ============================
       今月の新規顧客
    ============================ */
    const [newCustomerRows] = await db.query(`
      SELECT COUNT(*) AS count
      FROM customers
      WHERE YEAR(created_at) = YEAR(CURDATE())
        AND MONTH(created_at) = MONTH(CURDATE())
    `);

    /* ============================
       最近の予約

       通常予約
       ＋
       次回予約

       今後の予約を近い順に取得
    ============================ */
    const [recentReservationRows] = await db.query(`
      SELECT *
      FROM (
        /* ============================
           通常の予約
        ============================ */
        SELECT
          r.id,
          r.customer_id AS customerId,
          r.reservation_date AS date,
          r.type,
          r.duration,
          c.name,
          c.kana,
          'reservation' AS source
        FROM reservations r
        LEFT JOIN customers c
          ON r.customer_id = c.id
        WHERE r.reservation_date >= NOW()

        UNION ALL

        /* ============================
           顧客詳細で設定した次回予約
        ============================ */
        SELECT
          CONCAT('next-', c.id) AS id,
          c.id AS customerId,
          c.nextReservation AS date,
          NULL AS type,
          NULL AS duration,
          c.name,
          c.kana,
          'nextReservation' AS source
        FROM customers c
        WHERE c.nextReservation IS NOT NULL
          AND c.nextReservation != ''
          AND c.nextReservation >= NOW()

          /* 通常予約と同じ日時なら重複表示しない */
          AND NOT EXISTS (
            SELECT 1
            FROM reservations r2
            WHERE r2.customer_id = c.id
              AND DATE_FORMAT(r2.reservation_date, '%Y-%m-%d %H:%i')
                = DATE_FORMAT(c.nextReservation, '%Y-%m-%d %H:%i')
          )
      ) AS upcoming_reservations

      ORDER BY date ASC
      LIMIT 5
    `);

    console.log("★★★ ダッシュボード情報 ★★★");
    console.log("今月の予約数:", reservationCountRows[0].count);
    console.log("今月の新規顧客:", newCustomerRows[0].count);
    console.log("最近の予約:", recentReservationRows);

    res.json({
      stats: {
        reservations: Number(reservationCountRows[0].count || 0),
        newCustomers: Number(newCustomerRows[0].count || 0),
      },

      recentReservations: recentReservationRows,
    });
  } catch (err) {
    console.error("ダッシュボード取得エラー:", err);

    res.status(500).json({
      error: "ダッシュボード情報の取得に失敗しました",
      detail: err.message,
    });
  }
});

/* ============================
   顧客詳細（GET）
============================ */
app.get("/api/customers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [customerRows] = await db.query(
      `SELECT
        id,
        name,
        kana,
        phone,
        email,
        memo,
        created_at,
        nextReservation,
        lastVisit,
        DATE_FORMAT(birthday, '%Y-%m-%d') AS birthday,
        gender,
        job,
        address
      FROM customers
      WHERE id = ?`,
      [id],
    );

    if (customerRows.length === 0) {
      return res.status(404).json({
        error: "顧客が見つかりません",
      });
    }

    const [visitRows] = await db.query(
      `SELECT *
       FROM visits
       WHERE customer_id = ?
       ORDER BY id DESC`,
      [id],
    );

    res.json({
      customer: customerRows[0],
      visits: visitRows,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "顧客詳細の取得に失敗しました",
    });
  }
});

/* ============================
   顧客更新（連絡先）
============================ */
app.put("/api/customers/:id/contact", async (req, res) => {
  const { id } = req.params;
  const { phone, email, address } = req.body;

  try {
    await db.query(
      `UPDATE customers
       SET phone=?, email=?, address=?
       WHERE id=?`,
      [phone, email, address, id],
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.error("連絡先更新DBエラー:", err);

    res.status(500).json({
      error: "連絡先の更新に失敗しました",
      detail: err.message,
    });
  }
});

/* ============================
   顧客更新（個人情報）
============================ */
app.put("/api/customers/:id/personal", async (req, res) => {
  const { id } = req.params;
  const { birthday, gender, job } = req.body;

  try {
    await db.query(
      `UPDATE customers
       SET birthday=?, gender=?, job=?
       WHERE id=?`,
      [birthday, gender, job, id],
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "個人情報の更新に失敗しました",
    });
  }
});

/* ============================
   顧客更新（メモ）
============================ */
app.put("/api/customers/:id/memo", async (req, res) => {
  const { id } = req.params;
  const { memo } = req.body;

  try {
    await db.query("UPDATE customers SET memo=? WHERE id=?", [memo, id]);

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "メモの更新に失敗しました",
    });
  }
});

/* ============================
   顧客更新（次回予約）
============================ */
app.put("/api/customers/:id/next", async (req, res) => {
  const { id } = req.params;
  const { nextReservation } = req.body;

  try {
    await db.query("UPDATE customers SET nextReservation=? WHERE id=?", [
      nextReservation || null,
      id,
    ]);

    console.log("次回予約を更新しました:", id, nextReservation);

    res.json({
      success: true,
      nextReservation,
    });
  } catch (err) {
    console.error("次回予約更新DBエラー:", err);

    res.status(500).json({
      error: "次回予約の更新に失敗しました",
      detail: err.message,
    });
  }
});

/* ============================
   顧客更新（最終来院日）
============================ */
app.put("/api/customers/:id/lastVisit", async (req, res) => {
  const { id } = req.params;
  const { lastVisit } = req.body;

  try {
    await db.query("UPDATE customers SET lastVisit=? WHERE id=?", [
      lastVisit,
      id,
    ]);

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "最終来院日の更新に失敗しました",
    });
  }
});

/* ============================
   顧客削除（DELETE）
============================ */
app.delete("/api/customers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // ① 予約削除
    await db.query("DELETE FROM reservations WHERE customer_id=?", [id]);

    // ② 来院履歴削除
    await db.query("DELETE FROM visits WHERE customer_id=?", [id]);

    // ③ 顧客削除
    const [result] = await db.query("DELETE FROM customers WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "顧客が見つかりません",
      });
    }

    console.log("顧客を削除しました:", id);

    res.json({
      success: true,
    });
  } catch (err) {
    console.error("顧客削除DBエラー:", err);

    res.status(500).json({
      error: "顧客の削除に失敗しました",
      detail: err.message,
    });
  }
});

/* ============================
   履歴一覧（GET）
============================ */
app.get("/api/customers/:id/visits", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT *
       FROM visits
       WHERE customer_id = ?
       ORDER BY id DESC`,
      [id],
    );

    res.json(rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "履歴一覧の取得に失敗しました",
    });
  }
});

/* ============================
   履歴追加（POST）
============================ */
app.post("/api/customers/:id/visits", async (req, res) => {
  const { id } = req.params;
  const { date, menu } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO visits
       (customer_id, date, menu)
       VALUES (?, ?, ?)`,
      [id, date, menu],
    );

    res.json({
      id: result.insertId,
      date,
      menu,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "履歴の追加に失敗しました",
    });
  }
});

/* ============================
   履歴編集（PUT）
============================ */
app.put("/api/visits/:visitId", async (req, res) => {
  const { visitId } = req.params;
  const { date, menu } = req.body;

  try {
    await db.query(
      `UPDATE visits
       SET date=?, menu=?
       WHERE id=?`,
      [date, menu, visitId],
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "履歴の更新に失敗しました",
    });
  }
});

/* ============================
   履歴削除（DELETE）
============================ */
app.delete("/api/visits/:visitId", async (req, res) => {
  const { visitId } = req.params;

  try {
    await db.query("DELETE FROM visits WHERE id=?", [visitId]);

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "履歴の削除に失敗しました",
    });
  }
});

/* ============================
   アプリをエクスポート
============================ */
const express = require("express");
const app = express();

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

module.exports = app;
