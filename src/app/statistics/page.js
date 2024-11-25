"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";

export default function StatisticsPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [monthFilter, setMonthFilter] = useState(""); // 當月篩選
  const [itemFilter, setItemFilter] = useState("全部品項"); // 品項篩選
  const [uniqueItems, setUniqueItems] = useState([]); // 唯一品項列表

  async function fetchOrders() {
    const response = await fetch("/api/orders");
    const data = await response.json();
    setOrders(data);
    setFilteredOrders(data);

    // 初始化品項篩選列表
    const items = [...new Set(data.map((order) => order.drink.name))];
    setUniqueItems(["全部品項", ...items]);
  }
  // 初始化從 API 獲取訂單數據
  useEffect(() => {
    fetchOrders();
  }, []);

  // 篩選訂單數據
  useEffect(() => {
    const today = dayjs();
    const filtered = orders.filter((order) => {
      const matchesMonth =
        !monthFilter || dayjs(order.created_at).isSame(today, "month");
      const matchesItem =
        itemFilter === "全部品項" || order.drink.name === itemFilter;

      return matchesMonth && matchesItem;
    });
    setFilteredOrders(filtered);
  }, [monthFilter, itemFilter, orders]);

  // 統計總金額與總數量
  const totalAmount = filteredOrders.reduce(
    (sum, order) => sum + order.total_price,
    0
  );
  const totalQuantity = filteredOrders.reduce(
    (sum, order) => sum + order.quantity,
    0
  );
  const [isLoading, seIsLoading] = useState(false);
  const deleteOrder = async (id) => {
    console.log("deleteOrder id: ", id);
    try {
      if (confirm(`你確定要刪除 ${name} ? `)) {
        const response = await fetch("/api/orders", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (response.ok) {
          fetchOrders();
        } else {
          alert("刪除失敗");
        }
      }
    } catch (e) {
      console.log("deleteOrder error: ", e);
    }
  };

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">訂單統計</h1>

      {/* 篩選選項 */}
      <div className="mb-6 flex justify-between flex-wrap">
        <div>
          <label className="font-medium mr-2">篩選時間：</label>
          <select
            className="border p-2 rounded"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="">全部</option>
            <option value="當月">當月</option>
          </select>
        </div>

        <div>
          <label className="font-medium mr-2">篩選品項：</label>
          <select
            className="border p-2 rounded"
            value={itemFilter}
            onChange={(e) => setItemFilter(e.target.value)}
          >
            {uniqueItems.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 訂單表格 */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">品項</th>
            <th className="border border-gray-300 px-4 py-2">配料</th>
            <th className="border border-gray-300 px-4 py-2">數量</th>
            <th className="border border-gray-300 px-4 py-2">金額</th>
            <th className="border border-gray-300 px-4 py-2">時間</th>
            <th className="border border-gray-300 px-4 py-2">功能</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {order.drink.name} ({order.drink.price} 元)
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.topping !== "無配料"
                    ? `${order.topping.name} (+${order.topping.price}元)`
                    : "無配料"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.quantity}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.total_price} 元
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {dayjs(order.created_at).format("YYYY-MM-DD HH:mm:ss")}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => {
                      deleteOrder(order.id);
                    }}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="text-center border border-gray-300 px-4 py-2"
              >
                沒有符合條件的訂單
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 統計結果 */}
      <div className="mt-6 text-lg font-bold">
        <p>總金額：{totalAmount} 元</p>
        <p>總數量：{totalQuantity} 杯</p>
      </div>
    </div>
  );
}
