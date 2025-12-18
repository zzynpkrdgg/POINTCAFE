export const createOrder = (req, res) => {
  const order = req.body;

  if (!order.items || order.items.length === 0) {
    return res.status(400).json({ message: "Sepet boş" });
  }

  res.status(201).json({
    success: true,
    orderId: Date.now(),
    status: "pending"
  });
};
