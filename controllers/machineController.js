const Machine = require("../models/Machine");

exports.createMachine = async (req, res) => {
  const { name, description, production_line_id } = req.body;
  try {
    const machine = await Machine.create({
      name,
      description,
      production_line_id,
    });
    res.status(201).json({ message: "Machine created successfully", machine });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllMachines = async (req, res) => {
  try {
    const machines = await Machine.findAll();
    res.status(200).json(machines);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateMachine = async (req, res) => {
  const { id } = req.params;
  const { name, description, production_line_id } = req.body;
  try {
    const machine = await Machine.findByPk(id);
    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }
    await machine.update({ name, description, production_line_id });
    res.status(200).json({ message: "Machine updated successfully", machine });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteMachine = async (req, res) => {
  const { id } = req.params;
  try {
    const machine = await Machine.findByPk(id);
    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }
    await machine.destroy();
    res.status(200).json({ message: "Machine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
