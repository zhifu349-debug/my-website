/**
 * 测试运行脚本
 * 运行所有测试套件并生成详细报告
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEST_CATEGORIES = [
  { name: '功能测试', pattern: '__tests__/functional/**/*.test.ts', dir: 'functional' },
  { name: '性能测试', pattern: '__tests__/performance/**/*.test.ts', dir: 'performance' },
  { name: '稳定性测试', pattern: '__tests__/stability/**/*.test.ts', dir: 'stability' },
  { name: '代码质量测试', pattern: '__tests__/quality/**/*.test.ts', dir: 'quality' },
  { name: '数据模块测试', pattern: '__tests__/data-modules.test.ts', dir: '' },
  { name: 'API 端点测试', pattern: '__tests__/api-endpoints.test.ts', dir: '' },
  { name: '集成测试', pattern: '__tests__/integration/**/*.test.ts', dir: 'integration' },
];

function runTests(category) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`正在运行: ${category.name}`);
  console.log('='.repeat(60));
  
  try {
    const testFile = category.dir 
      ? `__tests__/${category.dir}/*.test.ts`
      : category.pattern;
    
    execSync(`npx jest --testPathPattern="${category.pattern}" --verbose`, {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    return { name: category.name, success: true };
  } catch (error) {
    return { name: category.name, success: false, error: error.message };
  }
}

function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      passed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
    },
    results: results,
  };

  const reportPath = path.join(__dirname, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('测试报告摘要');
  console.log('='.repeat(60));
  console.log(`总计: ${report.summary.total}`);
  console.log(`通过: ${report.summary.passed}`);
  console.log(`失败: ${report.summary.failed}`);
  console.log(`报告已保存到: ${reportPath}`);
  
  return report;
}

// 运行所有测试
console.log('开始运行所有测试套件...\n');

const results = TEST_CATEGORIES.map(runTests);
const report = generateReport(results);

// 退出码
if (report.summary.failed > 0) {
  process.exit(1);
}
