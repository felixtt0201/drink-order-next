"use client";

import { useState, useEffect } from "react";

export default function ManagePage() {
  const [drinks, setDrinks] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [newDrink, setNewDrink] = useState({ name: "", price: "" });
  const [newTopping, setNewTopping] = useState({ name: "", price: "" });
  const [isLoading, setIsLoading] = useState(false);

  // 初始化獲取飲料和配料數據
  useEffect(() => {
    async function fetchData() {
      const drinksResponse = await fetch("/api/drinks");
      const drinksData = await drinksResponse.json();
      setDrinks(drinksData);

      const toppingsResponse = await fetch("/api/toppings");
      const toppingsData = await toppingsResponse.json();
      setToppings(toppingsData);
    }
    fetchData();
  }, []);

  // 新增飲料
  const addDrink = async (e) => {
    e.preventDefault();
    if (!newDrink.name || !newDrink.price) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/drinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDrink),
      });
      if (response.ok) {
        const drinksResponse = await fetch("/api/drinks");
        const drinksData = await drinksResponse.json();
        setDrinks(drinksData);
        setNewDrink({ name: "", price: "" });
      } else {
        alert("新增失敗");
      }
    } catch (error) {
      alert("新增失敗");
    }
    setIsLoading(false);
  };

  // 刪除飲料
  const deleteDrink = async (id, name) => {
    if (confirm(`你確定要刪除 ${name} ? `)) {
      const response = await fetch("/api/drinks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      console.log("response: ", response);
      if (response.ok) {
        const drinksResponse = await fetch("/api/drinks");
        const drinksData = await drinksResponse.json();
        setDrinks(drinksData);
      } else {
        alert("刪除失敗");
      }
    }
  };

  const isNumber = (value) => {
    return !isNaN(value);
  };
  // 編輯飲料價格
  const editDrinkPrice = async (id, name, price) => {
    const newPrice = prompt("請輸入新價格", price);
    if (newPrice !== null) {
      console.log("isNumber");
      if (!isNumber(newPrice)) {
        alert("價格需為數字");
        return;
      }
      const updatedDrink = { id, name, price: newPrice };
      await fetch("/api/drinks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDrink),
      });
      setDrinks(
        drinks.map((drink) =>
          drink.name === name ? { ...drink, price: newPrice } : drink
        )
      );
    }
  };

  // 新增配料
  const addTopping = async (e) => {
    e.preventDefault();
    if (!newTopping.name) {
      alert("請輸入配料名稱");
      return;
    }
    const response = await fetch("/api/toppings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTopping),
    });
    if (response.ok) {
      const toppingsResponse = await fetch("/api/toppings");
      const toppingsData = await toppingsResponse.json();
      setToppings(toppingsData);
      setNewTopping({ name: "", price: "" });
    } else {
      alert("新增失敗");
    }
  };

  // 刪除配料
  const deleteTopping = async (name, id) => {
    if (name === "無配料") return; // 無配料不可刪除
    if (confirm(`你確定要刪除 ${name} ? `)) {
      const response = await fetch("/api/toppings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        const toppingsResponse = await fetch("/api/toppings");
        const toppingsData = await toppingsResponse.json();
        setToppings(toppingsData);
      } else {
        alert("刪除失敗");
      }
    }
  };

  // 編輯配料價格
  const editToppingPrice = async (id, name, price) => {
    const newPrice = prompt("請輸入新價格", price);
    if (newPrice !== null) {
      if (newPrice !== parseFloat(newPrice)) {
        alert("價格需為數字");
        return;
      }
      const updatedTopping = { id, name, price: newPrice };
      await fetch("/api/toppings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTopping),
      });
      setToppings(
        toppings.map((topping) =>
          topping.name === name ? { ...topping, price: newPrice } : topping
        )
      );
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">管理</h1>

      {/* 飲料管理 */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">飲料品項</h2>
        <form onSubmit={addDrink} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="飲料名稱"
            value={newDrink.name}
            onChange={(e) => setNewDrink({ ...newDrink, name: e.target.value })}
            className="w-1/2 p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="價格"
            value={newDrink.price}
            onChange={(e) =>
              setNewDrink({ ...newDrink, price: parseFloat(e.target.value) })
            }
            className="w-1/2 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={isLoading}
          >
            {isLoading ? "新增中" : "新增"}
          </button>
        </form>
        <ul>
          {drinks.map((drink, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                {drink.name} - {drink.price} 元
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    editDrinkPrice(drink.id, drink.name, drink.price)
                  }
                  className="text-blue-500"
                >
                  編輯
                </button>
                <button
                  onClick={() => deleteDrink(drink.id, drink.name)}
                  className="text-red-500"
                >
                  刪除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 配料管理 */}
      <div>
        <h2 className="text-lg font-bold mb-2">配料品項</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="配料名稱"
            value={newTopping.name}
            onChange={(e) =>
              setNewTopping({ ...newTopping, name: e.target.value })
            }
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="價格"
            value={newTopping.price}
            onChange={(e) =>
              setNewTopping({
                ...newTopping,
                price: parseFloat(e.target.value),
              })
            }
            className="w-1/2 p-2 border rounded"
          />
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={addTopping}
          >
            新增
          </button>
        </div>
        <ul>
          {toppings.map((topping, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                {topping.name} - {topping.price} 元
              </span>
              <div className="flex gap-2">
                {topping.name !== "無配料" && (
                  <>
                    <button
                      onClick={() =>
                        editToppingPrice(
                          topping.id,
                          topping.name,
                          // parseFloat(prompt("請輸入新價格", drink.price))
                          topping.price
                        )
                      }
                      className="text-blue-500"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => deleteTopping(topping.name, topping.id)}
                      className="text-red-500"
                    >
                      刪除
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
