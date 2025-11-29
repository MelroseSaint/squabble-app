#!/usr/bin/env node

/**
 * Squabble App - Backend Maintenance Script
 * 
 * This script helps monitor and maintain the backend services,
 * database connections, and API endpoints.
 */

import { Surreal } from 'surrealdb';

// Configuration
const CONFIG = {
  DB_ENDPOINT: 'wss://squabble-06dbhqbb4tpar7vu71rsnbjab8.aws-use1.surreal.cloud/rpc',
  DB_NAMESPACE: 'squabble',
  DB_DATABASE: 'squabble_db',
  ADMIN_TOKEN: 'eyJhbGciOiJQUzI1NiIsImtpZCI6IjFkNmViYjAyLWM5ZjEtNDg4Zi1iNjhjLWNlMzMzMzU4YzgyOCIsInR5cCI6IkpXVCJ9.eyJhYyI6ImNsb3VkIiwiYXVkIjoiMDZkYmhxYmI0dHBhcjd2dTcxcnNuYmphYjgiLCJleHAiOjE3NjQwNDU1NTksImlhdCI6MTc2NDA0NDk1OSwicmwiOlsiT3duZXIiXX0.Ogbei1r0tWXsxWw4s9r7lFl71tmAlg3OxYVsrohKgHwTY0D1wkp4N0nFrwzXfkupyOa80rWy56JLTUTypf1jsKCoiZ298aM38kOAoxrLPrEu45A-EXPvQ3f0RciXQX6Xao5zYtXO5w-vOlhzN1uOPbqLO56SG60ntg_VHkTZUGJzL1l3lON7VhaRUUsXfDBdggBD42a2DLL8OX-QPtUvlrU-QxBOrPKvzeFpuDT1Kdm-i3rLyxbfAwVvH4HsBZnJJKtIYv5PSxSSSaoyri8U9KS14HDCbSt-zz8fFE38Aybv7HvQ2hJvqQr_woYdzQUgqPSZf-5AwRBbry5CBe4gqw'
};

class BackendMaintenance {
  constructor() {
    this.db = new Surreal();
    this.isConnected = false;
    this.metrics = {
      connectionTime: 0,
      queryTime: 0,
      errorCount: 0,
      lastCheck: null
    };
  }

  async connect() {
    const startTime = Date.now();
    try {
      console.log('🔌 Connecting to SurrealDB...');
      await this.db.connect(CONFIG.DB_ENDPOINT);
      
      console.log('🔐 Authenticating with admin token...');
      await this.db.authenticate(CONFIG.ADMIN_TOKEN);
      
      console.log('📁 Setting namespace and database...');
      await this.db.use({ ns: CONFIG.DB_NAMESPACE, db: CONFIG.DB_DATABASE });
      
      this.isConnected = true;
      this.metrics.connectionTime = Date.now() - startTime;
      console.log(`✅ Connected successfully in ${this.metrics.connectionTime}ms`);
      
      return true;
    } catch (error) {
      this.isConnected = false;
      this.metrics.errorCount++;
      console.error('❌ Connection failed:', error.message);
      return false;
    }
  }

  async disconnect() {
    try {
      await this.db.close();
      this.isConnected = false;
      console.log('🔌 Disconnected from database');
    } catch (error) {
      console.error('❌ Disconnect failed:', error.message);
    }
  }

  async checkDatabaseHealth() {
    if (!this.isConnected) {
      return { status: 'disconnected', details: 'Not connected to database' };
    }

    const startTime = Date.now();
    try {
      // Test basic query
      const result = await this.db.query('SELECT * FROM $auth LIMIT 1');
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        responseTime,
        details: 'Database responding normally'
      };
    } catch (error) {
      this.metrics.errorCount++;
      return {
        status: 'unhealthy',
        error: error.message,
        details: 'Database query failed'
      };
    }
  }

  async getTableStats() {
    if (!this.isConnected) {
      return { error: 'Not connected to database' };
    }

    const tables = ['user', 'matches', 'bet', 'transaction'];
    const stats = {};

    for (const table of tables) {
      try {
        const result = await this.db.query(`SELECT count() FROM ${table}`);
        stats[table] = result[0].result?.[0]?.count || 0;
      } catch (error) {
        stats[table] = { error: error.message };
      }
    }

    return stats;
  }

  async checkUserActivity() {
    if (!this.isConnected) {
      return { error: 'Not connected to database' };
    }

    try {
      const queries = [
        'SELECT count() FROM user WHERE created_at > time::now() - 24h',
        'SELECT count() FROM matches WHERE timestamp > (time::now() - 24h).timestamp',
        'SELECT count() FROM bet WHERE created_at > time::now() - 24h',
        'SELECT count() FROM transaction WHERE created_at > time::now() - 24h'
      ];

      const results = {};
      for (let i = 0; i < queries.length; i++) {
        const result = await this.db.query(queries[i]);
        const count = result[0].result?.[0]?.count || 0;
        
        switch (i) {
          case 0: results.newUsers = count; break;
          case 1: results.newMatches = count; break;
          case 2: results.newBets = count; break;
          case 3: results.newTransactions = count; break;
        }
      }

      return results;
    } catch (error) {
      return { error: error.message };
    }
  }

  async validateSchema() {
    if (!this.isConnected) {
      return { error: 'Not connected to database' };
    }

    const expectedTables = ['user', 'matches', 'bet', 'transaction'];
    const validation = {};

    for (const table of expectedTables) {
      try {
        const result = await this.db.query(`INFO FOR TABLE ${table}`);
        validation[table] = {
          exists: true,
          details: result[0].result || 'Schema info available'
        };
      } catch (error) {
        validation[table] = {
          exists: false,
          error: error.message
        };
      }
    }

    return validation;
  }

  async cleanupOldData(daysToKeep = 30) {
    if (!this.isConnected) {
      return { error: 'Not connected to database' };
    }

    const cutoffDate = `time::now() - ${daysToKeep}d`;
    const cleanup = {};

    try {
      // Clean up old transactions (keep only completed ones)
      const transactionResult = await this.db.query(`
        DELETE FROM transaction 
        WHERE created_at < ${cutoffDate} 
        AND type IN ('BET_WIN', 'BET_LOSS')
      `);
      cleanup.oldTransactions = transactionResult[0].result?.length || 0;

      // Clean up old settled bets
      const betResult = await this.db.query(`
        DELETE FROM bet 
        WHERE created_at < ${cutoffDate} 
        AND status IN ('WON', 'LOST')
      `);
      cleanup.oldBets = betResult[0].result?.length || 0;

      console.log(`🧹 Cleaned up ${cleanup.oldTransactions} old transactions and ${cleanup.oldBets} old bets`);
      return cleanup;
    } catch (error) {
      return { error: error.message };
    }
  }

  async generateHealthReport() {
    const report = {
      timestamp: new Date().toISOString(),
      database: await this.checkDatabaseHealth(),
      tables: await this.getTableStats(),
      activity: await this.checkUserActivity(),
      schema: await this.validateSchema(),
      metrics: this.metrics
    };

    return report;
  }

  printHealthReport(report) {
    console.log('\n📊 === SQUABBLE BACKEND HEALTH REPORT ===');
    console.log(`🕐 Generated: ${report.timestamp}`);
    
    console.log('\n🗄️  DATABASE STATUS:');
    console.log(`   Status: ${report.database.status}`);
    if (report.database.responseTime) {
      console.log(`   Response Time: ${report.database.responseTime}ms`);
    }
    if (report.database.error) {
      console.log(`   Error: ${report.database.error}`);
    }

    console.log('\n📊 TABLE STATISTICS:');
    Object.entries(report.tables).forEach(([table, count]) => {
      if (typeof count === 'object' && count.error) {
        console.log(`   ${table}: ❌ ${count.error}`);
      } else {
        console.log(`   ${table}: ${count} records`);
      }
    });

    console.log('\n📈 24H ACTIVITY:');
    Object.entries(report.activity).forEach(([metric, count]) => {
      console.log(`   ${metric}: ${count}`);
    });

    console.log('\n🏗️  SCHEMA VALIDATION:');
    Object.entries(report.schema).forEach(([table, validation]) => {
      if (validation.exists) {
        console.log(`   ${table}: ✅ Valid`);
      } else {
        console.log(`   ${table}: ❌ ${validation.error}`);
      }
    });

    console.log('\n📋 METRICS:');
    console.log(`   Connection Time: ${report.metrics.connectionTime}ms`);
    console.log(`   Error Count: ${report.metrics.errorCount}`);
    console.log(`   Last Check: ${report.metrics.lastCheck || 'Never'}`);
    
    console.log('\n=== END REPORT ===\n');
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const maintenance = new BackendMaintenance();

  try {
    await maintenance.connect();

    switch (command) {
      case 'health':
        const health = await maintenance.checkDatabaseHealth();
        console.log('Health Status:', health);
        break;

      case 'stats':
        const stats = await maintenance.getTableStats();
        console.log('Table Statistics:', stats);
        break;

      case 'activity':
        const activity = await maintenance.checkUserActivity();
        console.log('User Activity (24h):', activity);
        break;

      case 'schema':
        const schema = await maintenance.validateSchema();
        console.log('Schema Validation:', schema);
        break;

      case 'cleanup':
        const days = parseInt(args[1]) || 30;
        const cleanup = await maintenance.cleanupOldData(days);
        console.log('Cleanup Results:', cleanup);
        break;

      case 'report':
      default:
        const report = await maintenance.generateHealthReport();
        maintenance.printHealthReport(report);
        
        // Save report to file
        const fs = await import('fs');
        const reportPath = `backend_health_report_${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`📄 Full report saved to: ${reportPath}`);
        break;
    }

  } catch (error) {
    console.error('❌ Maintenance script failed:', error.message);
    process.exit(1);
  } finally {
    await maintenance.disconnect();
  }
}

// Export for use as module
export { BackendMaintenance };

// Run as CLI if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
