"use client";

import { createContext, useContext, useState } from "react";

// 建立 Context
const OrderContext = createContext();

// 提供全局狀態
export const OrderProvider = ({ children }) => {
  const [drinks, setDrinks] = useState([
    { name: "紅茶", price: 30 },
    { name: "紅茶牛奶", price: 55 },
    { name: "冬瓜茶", price: 30 },
    { name: "冬瓜牛奶", price: 55 },
  ]);

  const [toppings, setToppings] = useState([
    { name: "無配料", price: 0 },
    { name: "珍珠", price: 5 },
  ]);

  const [orders, setOrders] = useState([]); // 訂單列表

  const addOrderItem = (orderItem) => {
    setOrders([...orders, orderItem]);
  };

  const removeOrderItem = (index) => {
    const updatedOrders = [...orders];
    updatedOrders.splice(index, 1);
    setOrders(updatedOrders);
  };

  const addDrinkItem = (drink) => {
    setDrinks([...drinks, drink]);
  };

  const addToppingItem = (topping) => {
    setToppings([...toppings, topping]);
  };

  const removeDrinkItem = (drinkName) => {
    setDrinks(drinks.filter((drink) => drink.name !== drinkName));
  };

  const removeToppingItem = (toppingName) => {
    if (toppingName === "無配料") return; // 確保 "無配料" 不被刪除
    setToppings(toppings.filter((topping) => topping.name !== toppingName));
  };

  return (
    <OrderContext.Provider
      value={{
        drinks,
        toppings,
        orders,
        setOrders,
        addOrderItem,
        removeOrderItem,
        addDrinkItem,
        addToppingItem,
        removeDrinkItem,
        removeToppingItem,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// 自定義 Hook
export const useOrderContext = () => useContext(OrderContext);
