
class Farm {
  crops: number;
  cash: number;

  constructor() {
    this.crops = 10;
    this.cash = 100;
  }

  plantCrops() {
    if (this.cash >= 20) {
      this.crops += 10;
      this.cash -= 20;
      console.log("Planted 10 crops");
    } else {
      console.log("Not enough cash to plant crops");
    }
  }

  harvestCrops() {
    this.cash += this.crops * 5;
    this.crops = 0;
    console.log("Harvested crops and earned money");
  }

  printStatus() {
    console.log(`Cash: ${this.cash}, Crops: ${this.crops}`);
  }
}

const farm = new Farm();
farm.printStatus();
farm.plantCrops();
farm.printStatus();
farm.harvestCrops();
farm.printStatus();
