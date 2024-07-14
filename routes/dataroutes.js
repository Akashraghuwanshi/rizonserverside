import express from "express";
import dashboardData from "../data.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Make a copy of the data to work with
let data = [...dashboardData];

const router = express.Router();
let nextId = data.length > 0 ? Math.max(...data.map(item => item.menuid)) + 1 : 1;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const saveDataToFile = (data) => {
  const filePath = path.join(__dirname, '../data.js');
  const fileContent = `const dashboardData = ${JSON.stringify(data, null, 2)};\n\nexport default dashboardData;`;
  fs.writeFileSync(filePath, fileContent, 'utf8');
};

/* READ:Get all elements */
router.get("/", (req, res) => {
  try {
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching data",
    });
  }
});
/* READ: Get an element by id */
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = data.find((item) => item.menuid === id);

  if (item) {
    res.status(200).json(item);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

/* CREATE:Add a new element */
router.post("/", (req, res) => {
  const newItem = {
    menuid: nextId,
    ...req.body,
  };
  data.push(newItem);
  saveDataToFile(data);
  nextId++;

  res.status(201).json(newItem);
});

/* UPDATE:update an existing element by id */
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = data.findIndex((item) => item.menuid === id);

  if (index !== -1) {
    data[index] = {
      ...data[index],
      ...req.body,
    };
    saveDataToFile(data);
    res.status(200).json(data[index]);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

/* DELETE: Remove an item by ID */
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const itemToDelete = data.find(item => item.menuid === id);

  if (itemToDelete) {
    data = data.filter(item => item.menuid !== id);
    saveDataToFile(data);
    res.status(200).json(itemToDelete);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

export default router;
