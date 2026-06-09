import React, { createContext, useContext, useReducer, useState } from 'react';

const CartContext = createContext(null);
const AuthContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.item.id);
      if (existing) {
        return state.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...state, { ...action.item, qty: 1 }];
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id);
    case 'UPDATE_QTY':
      return state.map(i => i.id === action.id ? { ...i, qty: action.qty } : i).filter(i => i.qty > 0);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [discount, setDiscount] = useState(null);
  const [tableNumber, setTableNumber] = useState(null);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discountAmount = discount
    ? discount.type === 'percent'
      ? (subtotal * discount.value) / 100
      : Math.min(discount.value, subtotal)
    : 0;
  const total = Math.max(0, subtotal - discountAmount);

  return (
    <CartContext.Provider value={{
      items, dispatch,
      subtotal, discountAmount, total,
      discount, setDiscount,
      tableNumber, setTableNumber,
      itemCount: items.reduce((s, i) => s + i.qty, 0),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);

  const login = (username, password) => {
    // Demo credentials — replace with real API call
    if (username === 'admin' && password === 'shabuyaki2024') {
      setAdmin({ username, role: 'admin' });
      return true;
    }
    return false;
  };
  const logout = () => setAdmin(null);

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAdmin: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
export const useAuth = () => useContext(AuthContext);
