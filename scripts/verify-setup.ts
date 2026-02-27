#!/usr/bin/env node
/**
 * 网站配置验证脚本
 * 运行: npx ts-node scripts/verify-setup.ts
 * 
 * 检查项目:
 * 1. 环境变量配置
 * 2. 必要的文件存在性
 * 3. 联盟链接配置
 * 4. 分析工具配置
 * 5. SEO 配置
 */

import * as fs from 'fs';
import * as path from 'path';

interface CheckResult {
  name: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
  details?: string[];
}

class SetupVerifier {
  private results: CheckResult[] = [];
  private envVars: Record<string, string | undefined> = {};

  constructor() {
    // Load environment variables from .env.local if exists
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      envContent.split('\n').forEach(line => {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) {
          this.envVars[match[1].trim()] = match[2].trim();
        }
      });
    }
  }

  private addResult(result: CheckResult) {
    this.results.push(result);
  }

  checkEnvironmentVariables() {
    console.log('🔍 Checking environment variables...\n');

    // Critical variables
    const criticalVars = [
      { key: 'NEXT_PUBLIC_SITE_URL', name: 'Site URL' },
      { key: 'NEXT_PUBLIC_GA_ID', name: 'Google Analytics ID' },
    ];

    criticalVars.forEach(({ key, name }) => {
      const value = this.envVars[key] || process.env[key];
      if (!value || value.includes('YOUR_') || value.includes('XXXX')) {
        this.addResult({
          name: `${name} (${key})`,
          status: 'error',
          message: 'Not configured or using placeholder value',
          details: [`Set ${key} in .env.local`]
        });
      } else {
        this.addResult({
          name: `${name} (${key})`,
          status: 'ok',
          message: 'Configured',
          details: [`Value: ${value.substring(0, 20)}...`]
        });
      }
    });

    // Comment system
    const giscusRepo = this.envVars['NEXT_PUBLIC_GISCUS_REPO'];
    const walineUrl = this.envVars['NEXT_PUBLIC_WALINE_SERVER_URL'];
    
    if (!giscusRepo && !walineUrl) {
      this.addResult({
        name: 'Comment System',
        status: 'warning',
        message: 'No comment system configured',
        details: [
          'Set NEXT_PUBLIC_GISCUS_REPO for Giscus (recommended)',
          'OR set NEXT_PUBLIC_WALINE_SERVER_URL for Waline'
        ]
      });
    } else if (giscusRepo) {
      this.addResult({
        name: 'Comment System (Giscus)',
        status: 'ok',
        message: 'Configured',
        details: [`Repo: ${giscusRepo}`]
      });
    } else {
      this.addResult({
        name: 'Comment System (Waline)',
        status: 'ok',
        message: 'Configured',
        details: [`URL: ${walineUrl}`]
      });
    }

    // Affiliate links
    const affiliateVars = [
      'AFFILIATE_VULTR',
      'AFFILIATE_DIGITALOCEAN',
      'AFFILIATE_LINODE',
    ];
    
    const configuredAffiliates = affiliateVars.filter(
      key => this.envVars[key] && !this.envVars[key]?.includes('YOUR_')
    );

    if (configuredAffiliates.length === 0) {
      this.addResult({
        name: 'Affiliate Links',
        status: 'warning',
        message: 'No affiliate links configured',
        details: ['Set at least one affiliate link in .env.local']
      });
    } else {
      this.addResult({
        name: 'Affiliate Links',
        status: 'ok',
        message: `${configuredAffiliates.length} configured`,
        details: configuredAffiliates
      });
    }
  }

  checkRequiredFiles() {
    console.log('📁 Checking required files...\n');

    const requiredFiles = [
      { path: 'src/app/layout.tsx', name: 'Root Layout' },
      { path: 'src/app/not-found.tsx', name: '404 Page' },
      { path: 'src/app/[locale]/not-found.tsx', name: 'Localized 404' },
      { path: 'src/app/icon.tsx', name: 'Favicon' },
      { path: 'src/app/apple-icon.tsx', name: 'Apple Icon' },
      { path: 'src/app/manifest.ts', name: 'PWA Manifest' },
      { path: 'src/app/robots.ts', name: 'Robots.txt' },
      { path: 'src/app/sitemap.ts', name: 'Sitemap' },
    ];

    requiredFiles.forEach(({ path: filePath, name }) => {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        this.addResult({
          name,
          status: 'ok',
          message: 'File exists'
        });
      } else {
        this.addResult({
          name,
          status: 'error',
          message: 'File missing',
          details: [`Expected: ${filePath}`]
        });
      }
    });
  }

  checkSEOConfiguration() {
    console.log('🔎 Checking SEO configuration...\n');

    const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
    if (fs.existsSync(layoutPath)) {
      const content = fs.readFileSync(layoutPath, 'utf-8');
      
      const checks = [
        { pattern: /metadataBase/, name: 'Metadata Base URL' },
        { pattern: /openGraph/, name: 'Open Graph Tags' },
        { pattern: /twitter/, name: 'Twitter Cards' },
        { pattern: /robots/, name: 'Robots Meta' },
        { pattern: /alternates/, name: 'Hreflang Alternates' },
      ];

      checks.forEach(({ pattern, name }) => {
        if (pattern.test(content)) {
          this.addResult({
            name: `SEO: ${name}`,
            status: 'ok',
            message: 'Configured in layout.tsx'
          });
        } else {
          this.addResult({
            name: `SEO: ${name}`,
            status: 'warning',
            message: 'Not found in layout.tsx'
          });
        }
      });
    }
  }

  checkAnalytics() {
    console.log('📊 Checking analytics configuration...\n');

    const gaId = this.envVars['NEXT_PUBLIC_GA_ID'];
    
    if (!gaId || gaId === 'G-XXXXXXXXXX') {
      this.addResult({
        name: 'Google Analytics 4',
        status: 'error',
        message: 'GA4 ID not configured',
        details: [
          '1. Go to https://analytics.google.com/',
          '2. Create a property for your website',
          '3. Get the Measurement ID (G-XXXXXXXXXX)',
          '4. Set NEXT_PUBLIC_GA_ID in .env.local'
        ]
      });
    } else {
      const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
      const content = fs.readFileSync(layoutPath, 'utf-8');
      
      if (content.includes('GoogleAnalytics') || content.includes('gtag')) {
        this.addResult({
          name: 'Google Analytics 4',
          status: 'ok',
          message: 'Configured and integrated',
          details: [`Tracking ID: ${gaId}`]
        });
      } else {
        this.addResult({
          name: 'Google Analytics 4',
          status: 'warning',
          message: 'ID configured but not integrated in layout',
          details: ['Add GoogleAnalytics component to layout.tsx']
        });
      }
    }
  }

  printReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 SETUP VERIFICATION REPORT');
    console.log('='.repeat(60) + '\n');

    const ok = this.results.filter(r => r.status === 'ok');
    const warnings = this.results.filter(r => r.status === 'warning');
    const errors = this.results.filter(r => r.status === 'error');

    // Print errors first
    if (errors.length > 0) {
      console.log('❌ ERRORS (Must Fix):\n');
      errors.forEach(result => {
        console.log(`  🔴 ${result.name}`);
        console.log(`     ${result.message}`);
        if (result.details) {
          result.details.forEach(detail => console.log(`     → ${detail}`));
        }
        console.log('');
      });
    }

    // Print warnings
    if (warnings.length > 0) {
      console.log('⚠️  WARNINGS (Recommended):\n');
      warnings.forEach(result => {
        console.log(`  🟡 ${result.name}`);
        console.log(`     ${result.message}`);
        if (result.details) {
          result.details.forEach(detail => console.log(`     → ${detail}`));
        }
        console.log('');
      });
    }

    // Print OK
    if (ok.length > 0) {
      console.log('✅ OK:\n');
      ok.forEach(result => {
        console.log(`  🟢 ${result.name}: ${result.message}`);
      });
      console.log('');
    }

    // Summary
    console.log('='.repeat(60));
    console.log(`SUMMARY: ${ok.length} OK, ${warnings.length} Warnings, ${errors.length} Errors`);
    console.log('='.repeat(60));

    if (errors.length > 0) {
      console.log('\n⚠️  Please fix the errors before deploying.');
      process.exit(1);
    } else if (warnings.length > 0) {
      console.log('\n✅ Ready to deploy, but consider addressing the warnings.');
      process.exit(0);
    } else {
      console.log('\n🎉 All checks passed! Ready to deploy.');
      process.exit(0);
    }
  }

  run() {
    console.log('\n🚀 Starting setup verification...\n');
    
    this.checkEnvironmentVariables();
    this.checkRequiredFiles();
    this.checkSEOConfiguration();
    this.checkAnalytics();
    
    this.printReport();
  }
}

// Run verification
const verifier = new SetupVerifier();
verifier.run();
