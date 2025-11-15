import axios from "axios";

export const purchaseSweet = async (sweetId: number, quantity: number) => {
  const token = localStorage.getItem("token");

  return axios.post(
    `http://localhost:3000/api/orders/${sweetId}`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
