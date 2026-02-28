/**
 * 测试报告生成器
 * 分析测试结果并生成详细报告
 */

import fs from 'fs';
import path from 'path';

interface TestResult {
  name: string;
  success: boolean;
  duration?: number;
  tests?: number;
  passed?: number;
  failed?: number;
  errors?: string[];
}

interface TestReport {
  timestamp: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    duration: number;
  };
  categories: {
    name: string;
    tests: number;
    passed: number;
    failed: number;
    duration: number;
  }[];
  details: TestResult[];
}

class TestReportGenerator {
  private reportPath: string;
  private results: TestResult[] = [];

  constructor() {
    this.reportPath = path.join(process.cwd(), 'test-report.json');
  }

  addResult(result: TestResult) {
    this.results.push(result);
  }

  generate(): TestReport {
    const report: TestReport = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.success).length,
        failed: this.results.filter(r => !r.success).length,
        duration: this.results.reduce((sum, r) => sum + (r.duration || 0), 0),
      },
      categories: this.groupByCategory(),
      details: this.results,
    };

    return report;
  }

  private groupByCategory() {
    const categories: Record<string, TestResult[]> = {};
    
    this.results.forEach(result => {
      const category = this.getCategory(result.name);
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(result);
    });

    return Object.entries(categories).map(([name, results]) => ({
      name,
      tests: results.length,
      passed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      duration: results.reduce((sum, r) => sum + (r.duration || 0), 0),
    }));
  }

  private getCategory(name: string): string {
    if (name.includes('functional')) return '功能测试';
    if (name.includes('performance')) return '性能测试';
    if (name.includes('stability')) return '稳定性测试';
    if (name.includes('quality')) return '代码质量测试';
    if (name.includes('data-modules')) return '数据模块测试';
    if (name.includes('api-endpoints')) return 'API测试';
    return '其他测试';
  }

  save() {
    const report = this.generate();
    fs.writeFileSync(this.reportPath, JSON.stringify(report, null, 2));
    return report;
  }

  printSummary() {
    const report = this.generate();
    
    console.log('\n' + '='.repeat(60));
    console.log('测试报告摘要');
    console.log('='.repeat(60));
    console.log(`\n时间: ${new Date(report.timestamp).toLocaleString()}`);
    console.log(`\n总计: ${report.summary.total} 个测试套件`);
    console.log(`通过: ${report.summary.passed}`);
    console.log(`失败: ${report.summary.failed}`);
    console.log(`总耗时: ${(report.summary.duration / 1000).toFixed(2)}s`);

    console.log('\n' + '-'.repeat(60));
    console.log('分类统计');
    console.log('-'.repeat(60));

    report.categories.forEach(cat => {
      const status = cat.failed === 0 ? '✓' : '✗';
      console.log(`\n${status} ${cat.name}`);
      console.log(`  测试数: ${cat.tests}`);
      console.log(`  通过: ${cat.passed}`);
      console.log(`  失败: ${cat.failed}`);
      console.log(`  耗时: ${(cat.duration / 1000).toFixed(2)}s`);
    });

    console.log('\n' + '='.repeat(60));

    return report;
  }
}

// 使用示例
// const generator = new TestReportGenerator();
// generator.addResult({ name: 'functional/components.test', success: true, duration: 1500, tests: 15 });
// generator.addResult({ name: 'performance/page-load.test', success: true, duration: 2000, tests: 10 });
// generator.addResult({ name: 'stability/stress.test', success: false, duration: 5000, errors: ['Timeout'] });
// generator.save();
// generator.printSummary();

export default TestReportGenerator;
export { TestReport, TestResult };
