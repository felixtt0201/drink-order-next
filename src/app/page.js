"use client";

import { useState, useEffect } from "react";
// import { createClient } from "../../supabase/server";
export default function MenuPage() {
  const [drinks, setDrinks] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // 初始化獲取飲料和配料數據
  useEffect(() => {
    async function fetchData() {
      const drinksResponse = await fetch("/api/drinks");
      const drinksData = await drinksResponse.json();
      setDrinks(drinksData);

      const toppingsResponse = await fetch("/api/toppings");
      const toppingsData = await toppingsResponse.json();
      setToppings(toppingsData);

      // 初始化每個飲料的選擇
      setSelectedOptions(
        drinksData.map(() => ({ quantity: 1, topping: "無配料" }))
      );
    }
    fetchData();
  }, []);

  // 處理配料變更
  const handleToppingChange = (index, newTopping) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index].topping = newTopping;
    setSelectedOptions(updatedOptions);
  };

  // 處理數量變更
  const handleQuantityChange = (index, newQuantity) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index].quantity = newQuantity;
    setSelectedOptions(updatedOptions);
  };

  // 添加訂單到 API
  const handleAddToOrder = async (item, index) => {
    const { quantity, topping } = selectedOptions[index];
    const toppingDetails = toppings.find((t) => t.name === topping);
    const toppingPrice = toppingDetails ? toppingDetails.price : 0;

    // const orderItem = {
    //   name: item.name,
    //   price: item.price,
    //   quantity,
    //   topping,
    //   toppingPrice,
    //   totalPrice: (item.price + toppingPrice) * quantity,
    //   timestamp: new Date().toISOString(),
    // };

    const orderItem = {
      drink_id: item.id,
      topping_id: toppingDetails.id,
      total_price: (item.price + toppingPrice) * quantity,
      quantity,
      timestamp: new Date().toISOString(),
    };

    console.log("orderItem: ", orderItem);

    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderItem),
    });

    alert(`成功加入訂單：${item.name} x ${quantity}`);
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">飲料菜單</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {drinks.map((item, index) => (
          <div
            key={index}
            className="p-6 border rounded-lg shadow-md flex flex-col justify-between"
          >
            <div className="mb-4">
              <h2 className="text-lg font-medium">{item.name}</h2>
              <p className="text-gray-500">{item.price} 元</p>
            </div>

            {/* 配料選擇 */}
            <div className="mb-4">
              <label className="block text-sm font-medium">配料：</label>
              <select
                className="w-full border rounded p-2"
                value={selectedOptions[index]?.topping || "無配料"}
                onChange={(e) => handleToppingChange(index, e.target.value)}
              >
                {toppings.map((topping, toppingIndex) => (
                  <option key={toppingIndex} value={topping.name}>
                    {topping.name} (+{topping.price} 元)
                  </option>
                ))}
              </select>
            </div>

            {/* 數量選擇 */}
            <div className="mb-4">
              <label className="block text-sm font-medium">數量：</label>
              <input
                type="number"
                min="1"
                className="w-full border rounded p-2"
                value={selectedOptions[index]?.quantity || 1}
                onChange={(e) =>
                  handleQuantityChange(index, parseInt(e.target.value))
                }
              />
            </div>

            {/* 加入訂單按鈕 */}
            <button
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => handleAddToOrder(item, index)}
            >
              加入訂單
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
