import { reduceSweetStock } from "../services/sweetService";

export const purchaseSweetController = async (req: any, res: any) => {
  const sweetId = Number(req.params.id);
  const { quantity } = req.body;

  try {
    const updated = await reduceSweetStock(sweetId, quantity);
    return res.status(200).json({ updated });
  } catch (error: any) {
    if (error.message === "Insufficient stock") {
      return res.status(400).json({ error: error.message });
    }

    return res.status(404).json({ error: error.message });
  }
};
