const ProductionLine = require("../models/ProductionLine");

exports.createProductionLine = async (req, res) => {
  const { name, description } = req.body;
  try {
    const productionLine = await ProductionLine.create({ name, description });
    res
      .status(201)
      .json({
        message: "Production line created successfully",
        productionLine,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllProductionLines = async (req, res) => {
  try {
    const productionLines = await ProductionLine.findAll();
    res.status(200).json(productionLines);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateProductionLine = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const productionLine = await ProductionLine.findByPk(id);
    if (!productionLine) {
      return res.status(404).json({ message: "Production line not found" });
    }
    await productionLine.update({ name, description });
    res
      .status(200)
      .json({
        message: "Production line updated successfully",
        productionLine,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteProductionLine = async (req, res) => {
  const { id } = req.params;
  try {
    const productionLine = await ProductionLine.findByPk(id);
    if (!productionLine) {
      return res.status(404).json({ message: "Production line not found" });
    }
    await productionLine.destroy();
    res.status(200).json({ message: "Production line deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
