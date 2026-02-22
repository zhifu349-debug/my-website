#!/usr/bin/env node

/**
 * 定时发布任务调度器
 * 定期检查并执行定时发布任务
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  // API端点URL
  API_URL: 'http://localhost:3000/api/scheduled-publish',
  // 检查间隔（分钟）
  CHECK_INTERVAL: 1,
  // 日志文件路径
  LOG_FILE: path.join(__dirname, '../logs/scheduled-publish.log')
};

// 确保日志目录存在
const ensureLogDirectory = () => {
  const logDir = path.dirname(CONFIG.LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

// 记录日志
const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage);
  
  try {
    ensureLogDirectory();
    fs.appendFileSync(CONFIG.LOG_FILE, logMessage);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
};

// 执行定时发布检查
const checkScheduledPublish = async () => {
  try {
    log('Checking for scheduled publish tasks...');
    
    const response = await axios.get(CONFIG.API_URL);
    const data = response.data;
    
    if (data.success) {
      log(`Successfully processed scheduled publish tasks. Published ${data.publishedCount} items.`);
      if (data.publishedIds.length > 0) {
        log(`Published content IDs: ${data.publishedIds.join(', ')}`);
      }
    } else {
      log(`Error processing scheduled publish tasks: ${data.error}`);
    }
  } catch (error) {
    log(`Failed to check scheduled publish tasks: ${error.message}`);
  }
};

// 启动调度器
const startScheduler = () => {
  log('Starting scheduled publish scheduler...');
  log(`Check interval: ${CONFIG.CHECK_INTERVAL} minute(s)`);
  
  // 立即执行一次检查
  checkScheduledPublish();
  
  // 设置定时检查
  setInterval(checkScheduledPublish, CONFIG.CHECK_INTERVAL * 60 * 1000);
};

// 启动应用
if (require.main === module) {
  startScheduler();
}

module.exports = { startScheduler, checkScheduledPublish };
