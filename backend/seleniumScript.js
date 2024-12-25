require("dotenv").config(); // Load environment variables from .env
const axios = require("axios");
const { Builder, By, Key, until } = require("selenium-webdriver");
const { MongoClient } = require("mongodb");
const uuid = require("uuid");
const datetime = require("node-datetime");
const proxy = require("selenium-webdriver/proxy");

// Load sensitive data from environment variables
const PROXY = process.env.PROXY_URL;
const MONGO_URI = process.env.MONGO_URI;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const client = new MongoClient(MONGO_URI);

// Function to get the public IP address
async function getPublicIP() {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    console.log(response.data.ip);
    return response.data.ip;
  } catch (error) {
    console.error("Error fetching public IP address:", error);
    return "Unknown";
  }
}

async function fetchTrendingTopics() {
  const driver = new Builder()
    .forBrowser("chrome")
    .setProxy(proxy.manual({ http: PROXY }))
    .build();

  try {
    // Fetch public IP address
    const ipAddress = await getPublicIP();

    // Navigate to X's login page
    await driver.get("https://x.com/i/flow/login");

    // Step 1: Enter username
    const usernameField = await driver.wait(
      until.elementLocated(By.name("text")),
      15000
    );
    await usernameField.sendKeys(USERNAME, Key.RETURN);

    // Step 2: Enter password
    const passwordField = await driver.wait(
      until.elementLocated(By.name("password")),
      5000
    );
    await passwordField.sendKeys(PASSWORD, Key.RETURN);

    console.log("Login success");

    // Step 3: Wait for the trending section to load
    const trendingContainer = await driver.wait(
      until.elementLocated(
        By.xpath('//div[@aria-label="Timeline: Trending now"]')
      ),
      15000
    );
    await driver.wait(until.elementIsVisible(trendingContainer), 5000);

    // Step 4: Fetch trending topics (starting from the third child div)
    const trends = await trendingContainer.findElements(
      By.xpath('.//div[@class="css-175oi2r"]/div[position() > 2]')
    );
    const trendingTopics = [];
    for (let trend of trends.slice(0, 5)) {
      const topic = await trend.getText();
      trendingTopics.push(topic);
    }

    // Step 5: Get timestamp
    const timestamp = datetime.create().format("Y-m-d H:M:S");

    // Step 6: Store in MongoDB
    const uniqueID = uuid.v4();
    await client.connect();
    const db = client.db("twitter");
    const collection = db.collection("trends");
    const record = {
      _id: uniqueID,
      trend1: trendingTopics[0] || "N/A",
      trend2: trendingTopics[1] || "N/A",
      trend3: trendingTopics[2] || "N/A",
      trend4: trendingTopics[3] || "N/A",
      trend5: trendingTopics[4] || "N/A",
      timestamp: timestamp,
      ipAddress: ipAddress || "Unknown",
    };
    await collection.insertOne(record);

    console.log("Trending topics stored successfully:", record);
    return record;
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    throw error;
  } finally {
    // Clean up resources
    await driver.quit();
    await client.close();
  }
}

module.exports = { fetchTrendingTopics };
