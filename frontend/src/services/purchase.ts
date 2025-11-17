import api from "./api";  // your axios instance with token interceptor

export const purchaseSweet = async (sweetId: string, quantity: number) => {
  return api.post(`/sweets/${sweetId}/purchase`, { quantity });
};
