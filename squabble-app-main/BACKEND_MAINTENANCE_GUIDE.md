# Squabble App - Backend Maintenance Guide

## Overview

This guide provides comprehensive instructions for maintaining the Squabble app's backend infrastructure, including database management, API endpoints, and monitoring procedures.

## Architecture Summary

### Database Layer
- **Primary Database**: SurrealDB (Cloud Instance)
- **Endpoint**: `wss://squabble-06dbhqbb4tpar7vu71rsnbjab8.aws-use1.surreal.cloud/rpc`
- **Namespace**: `squabble`
- **Database**: `squabble_db`
- **Authentication**: JWT-based with 24-hour sessions

### Service Layer
- **Database Service**: `services/db.ts` - Core database operations
- **AI Service**: `services/geminiService.ts` - Google Gemini integration
- **Wager Service**: `services/wagerService.ts` - Betting logic
- **Mock Generator**: `services/mockGenerator.ts` - Fallback data generation

## Quick Start Maintenance

### 1. Health Check
Run the maintenance script to get a complete health report:

```bash
cd squabble-app-main
node scripts/backend_maintenance.js report
```

This will:
- Test database connectivity
- Check table statistics
- Validate schema integrity
- Generate activity metrics
- Save a detailed report to file

### 2. Database Status Check
For a quick health check:

```bash
node scripts/backend_maintenance.js health
```

### 3. Table Statistics
View current data counts:

```bash
node scripts/backend_maintenance.js stats
```

## Regular Maintenance Tasks

### Daily Checks
- [ ] Run health check script
- [ ] Monitor error rates
- [ ] Check user activity levels
- [ ] Verify AI service availability

### Weekly Tasks
- [ ] Review database performance metrics
- [ ] Check storage usage
- [ ] Validate backup integrity
- [ ] Review security logs

### Monthly Tasks
- [ ] Clean up old data (transactions, settled bets)
- [ ] Update authentication tokens if needed
- [ ] Review and rotate API keys
- [ ] Performance optimization review

## Database Management

### Connection Testing
```javascript
// Test basic connectivity
const health = await maintenance.checkDatabaseHealth();
console.log('Database Status:', health.status);
console.log('Response Time:', health.responseTime);
```

### Schema Validation
```javascript
// Validate all tables exist and are properly structured
const schema = await maintenance.validateSchema();
Object.entries(schema).forEach(([table, validation]) => {
  if (!validation.exists) {
    console.error(`Table ${table} is missing or invalid`);
  }
});
```

### Data Cleanup
```bash
# Clean up data older than 30 days
node scripts/backend_maintenance.js cleanup 30

# Clean up data older than 90 days
node scripts/backend_maintenance.js cleanup 90
```

## API Endpoint Monitoring

### Key Endpoints to Monitor

#### Authentication
- `signin()` - User login attempts
- `signup()` - New user registrations
- `isAuthenticated()` - Session validation

#### Core Features
- `getMatches()` - Match retrieval performance
- `createMatch()` - Match creation success rate
- `updateMatchMessages()` - Chat functionality

#### Financial Operations
- `createBet()` - Bet placement
- `processWager()` - Bet settlement
- `updateUserBalance()` - Balance updates

#### AI Services
- `generateFighters()` - Fighter generation
- `generateChatReply()` - AI chat responses

### Performance Metrics to Track
- Response times per endpoint
- Error rates by service
- User activity patterns
- Database query performance

## Security Maintenance

### Authentication
- Monitor token expiration patterns
- Check for unusual login attempts
- Validate password hashing security
- Review session management

### Data Access
- Verify user-specific data isolation
- Check record-level access controls
- Validate API key storage security
- Review permission scopes

### Regular Security Tasks
```bash
# Check for recent authentication issues
node scripts/backend_maintenance.js activity

# Validate database schema integrity
node scripts/backend_maintenance.js schema
```

## Troubleshooting Guide

### Common Issues

#### Database Connection Issues
**Symptoms**: Connection timeouts, authentication failures
**Solutions**:
1. Check network connectivity to SurrealDB endpoint
2. Verify authentication token validity
3. Check namespace and database configuration
4. Review SurrealDB service status

#### AI Service Unavailability
**Symptoms**: Failed fighter generation, chat errors
**Solutions**:
1. Verify Google Gemini API key validity
2. Check API quota limits
3. Enable fallback to mock data
4. Monitor AI service response times

#### Performance Degradation
**Symptoms**: Slow response times, timeouts
**Solutions**:
1. Check database query performance
2. Review indexing strategy
3. Monitor resource utilization
4. Optimize complex queries

### Error Codes Reference

| Error Code | Description | Solution |
|------------|-------------|----------|
| `AUTH_REQUIRED` | User not authenticated | Check login flow |
| `AUTH_FAILED` | Invalid credentials | Verify user input |
| `DATABASE_ERROR` | Database operation failed | Check connection |
| `AI_SERVICE_ERROR` | AI service unavailable | Check API key/quota |
| `INSUFFICIENT_BALANCE` | Not enough funds for bet | Update user balance |

## Backup and Recovery

### Data Backup Strategy
1. **Regular Snapshots**: Weekly database exports
2. **Transaction Logs**: Continuous logging of changes
3. **Configuration Backups**: Store all config files
4. **Service Recovery**: Document restoration procedures

### Recovery Procedures
1. Restore from latest snapshot
2. Apply transaction logs
3. Validate data integrity
4. Test all endpoints
5. Monitor system performance

## Monitoring Setup

### Health Check Endpoints
The maintenance script provides built-in health checks:

```bash
# Full system health
node scripts/backend_maintenance.js report

# Specific checks
node scripts/backend_maintenance.js health    # Database health
node scripts/backend_maintenance.js stats     # Table statistics
node scripts/backend_maintenance.js activity  # User activity
```

### Alerting Thresholds
- Database response time > 1000ms
- Error rate > 5%
- Authentication failures > 10/hour
- AI service failures > 20/hour

## Performance Optimization

### Database Optimization
1. **Indexing**: Ensure proper indexes on frequently queried fields
2. **Query Optimization**: Review and optimize slow queries
3. **Connection Pooling**: Manage database connections efficiently
4. **Caching**: Implement appropriate caching strategies

### Application Optimization
1. **API Response Times**: Monitor and optimize endpoint performance
2. **Memory Usage**: Track application memory consumption
3. **Error Handling**: Implement robust error handling
4. **Rate Limiting**: Prevent abuse and ensure fair usage

## Documentation Updates

### Keep Documentation Current
- Update API documentation when endpoints change
- Maintain current database schema documentation
- Record configuration changes
- Update troubleshooting procedures

### Version Control
- Tag releases with corresponding documentation
- Maintain change logs
- Document migration procedures
- Store configuration versions

## Emergency Procedures

### Service Outage Response
1. **Assessment**: Determine scope and impact
2. **Communication**: Notify stakeholders
3. **Resolution**: Implement fix based on troubleshooting guide
4. **Verification**: Confirm service restoration
5. **Post-mortem**: Document root cause and prevention

### Data Recovery
1. **Stop Services**: Prevent further data corruption
2. **Assess Damage**: Determine data loss extent
3. **Restore from Backup**: Use most recent clean backup
4. **Validate Recovery**: Ensure data integrity
5. **Resume Services**: Gradually restore functionality

## Contact Information

### Service Providers
- **SurrealDB**: Cloud hosting support
- **Google Gemini**: AI service support
- **Infrastructure**: Hosting provider support

### Internal Contacts
- **Development Team**: Code and endpoint issues
- **DevOps Team**: Infrastructure and deployment
- **Security Team**: Security concerns and incidents

## Maintenance Calendar

### Monthly Schedule
| Week | Task | Responsible |
|------|------|-------------|
| Week 1 | Health checks, performance review | DevOps |
| Week 2 | Security audit, backup verification | Security |
| Week 3 | Data cleanup, optimization | Development |
| Week 4 | Documentation updates, planning | All teams |

### Quarterly Reviews
- Architecture assessment
- Security audit
- Performance benchmarking
- Capacity planning
- Disaster recovery testing

This guide provides a comprehensive framework for maintaining the Squabble app's backend infrastructure. Regular maintenance and monitoring will ensure reliable operation and optimal performance.
