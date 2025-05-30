# Database Backup and Disaster Recovery Strategy

## Overview

This document outlines the backup and disaster recovery strategy for the Qimma AI platform's Supabase PostgreSQL database. The strategy ensures data durability, availability, and compliance with educational data protection requirements.

## Backup Types and Schedule

### 1. Automated Supabase Backups

**Point-in-Time Recovery (PITR)**

- **Frequency**: Continuous (every 2 minutes)
- **Retention**: 7 days for Pro plan, 30 days for Team/Enterprise
- **Coverage**: All database changes, including schema and data
- **Location**: Supabase managed infrastructure
- **Recovery**: Can restore to any point within retention period

**Daily Snapshots**

- **Frequency**: Daily at 2:00 AM UTC
- **Retention**: 30 days
- **Coverage**: Full database snapshot
- **Location**: Supabase managed infrastructure
- **Recovery**: Full database restore

### 2. Custom Application-Level Backups

**Weekly Full Exports**

- **Frequency**: Every Sunday at 1:00 AM UTC
- **Format**: SQL dump + JSON data export
- **Storage**: AWS S3 bucket (separate from Supabase)
- **Retention**: 12 weeks (3 months)
- **Encryption**: AES-256 encryption at rest

**Monthly Archive Backups**

- **Frequency**: First Sunday of each month
- **Format**: Compressed SQL dump
- **Storage**: AWS S3 Glacier for long-term storage
- **Retention**: 7 years (compliance requirement)
- **Encryption**: AES-256 encryption at rest

## Backup Components

### Database Tables

- `users` - User accounts and profiles
- `exams` - Exam metadata and configurations
- `student_submissions` - Student submission records
- `credit_transactions` - Credit usage and purchase history
- `migrations` - Migration tracking

### File Storage

- **Exam files** (`exam-files` bucket)
- **Student submissions** (`student-submissions` bucket)
- **Processed results** (`processed-results` bucket)

### Configuration Data

- RLS policies
- Database functions and triggers
- Indexes and constraints
- Storage bucket policies

## Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO)

| Scenario              | RTO        | RPO       | Recovery Method                   |
| --------------------- | ---------- | --------- | --------------------------------- |
| Minor data corruption | 15 minutes | 2 minutes | PITR restore                      |
| Database failure      | 30 minutes | 2 minutes | PITR restore                      |
| Complete data loss    | 2 hours    | 24 hours  | Daily snapshot + file restore     |
| Disaster recovery     | 4 hours    | 24 hours  | Full backup restore to new region |

## Backup Procedures

### 1. Automated Supabase Backups

Supabase automatically handles:

- Continuous WAL (Write-Ahead Log) archiving
- Daily snapshots
- Cross-region replication (for paid plans)

**Monitoring**: Check Supabase dashboard for backup status

### 2. Custom Backup Scripts

#### Weekly SQL Export Script

```bash
#!/bin/bash
# scripts/backup-weekly.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/tmp/qimma-backups"
S3_BUCKET="qimma-database-backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Export database schema and data
pg_dump $DATABASE_URL > $BACKUP_DIR/qimma_backup_$DATE.sql

# Export specific tables as JSON for application-level recovery
psql $DATABASE_URL -c "COPY (SELECT * FROM users) TO STDOUT WITH CSV HEADER" > $BACKUP_DIR/users_$DATE.csv
psql $DATABASE_URL -c "COPY (SELECT * FROM exams) TO STDOUT WITH CSV HEADER" > $BACKUP_DIR/exams_$DATE.csv

# Compress backup
tar -czf $BACKUP_DIR/qimma_backup_$DATE.tar.gz $BACKUP_DIR/*.sql $BACKUP_DIR/*.csv

# Upload to S3
aws s3 cp $BACKUP_DIR/qimma_backup_$DATE.tar.gz s3://$S3_BUCKET/weekly/

# Cleanup local files
rm -rf $BACKUP_DIR
```

#### File Storage Backup

```bash
#!/bin/bash
# scripts/backup-storage.sh

DATE=$(date +%Y%m%d_%H%M%S)
S3_BACKUP_BUCKET="qimma-storage-backups"

# Sync Supabase storage buckets to backup bucket
aws s3 sync s3://supabase-storage/exam-files s3://$S3_BACKUP_BUCKET/exam-files/$DATE/
aws s3 sync s3://supabase-storage/student-submissions s3://$S3_BACKUP_BUCKET/student-submissions/$DATE/
aws s3 sync s3://supabase-storage/processed-results s3://$S3_BACKUP_BUCKET/processed-results/$DATE/
```

## Disaster Recovery Procedures

### 1. Minor Data Corruption Recovery

**Scenario**: Accidental data deletion or corruption affecting specific records

**Steps**:

1. Identify the timestamp before corruption occurred
2. Use Supabase dashboard to initiate PITR restore
3. Select specific tables if partial restore is needed
4. Verify data integrity after restore
5. Update application if needed

**Estimated Time**: 15-30 minutes

### 2. Database Failure Recovery

**Scenario**: Database becomes unavailable due to infrastructure issues

**Steps**:

1. Check Supabase status page for known issues
2. If infrastructure issue, wait for Supabase resolution
3. If data corruption, initiate PITR restore to last known good state
4. Test database connectivity and functionality
5. Resume application services

**Estimated Time**: 30 minutes - 2 hours

### 3. Complete Data Loss Recovery

**Scenario**: Complete database loss requiring full restore

**Steps**:

1. Create new Supabase project if needed
2. Restore from latest daily snapshot
3. Apply any missing migrations since backup
4. Restore file storage from S3 backups
5. Update application configuration
6. Perform comprehensive testing
7. Update DNS/connection strings if needed

**Estimated Time**: 2-4 hours

### 4. Regional Disaster Recovery

**Scenario**: Complete regional failure requiring restore in different region

**Steps**:

1. Create new Supabase project in different region
2. Restore from monthly archive backup
3. Restore file storage from S3 Glacier
4. Reconfigure application for new region
5. Update DNS and CDN configurations
6. Perform full system testing
7. Communicate with users about service restoration

**Estimated Time**: 4-8 hours

## Backup Monitoring and Alerting

### Automated Monitoring

1. **Supabase Backup Status**

   - Daily check of backup completion
   - Alert if backup fails or is delayed

2. **Custom Backup Monitoring**

   - Weekly backup script success/failure alerts
   - S3 upload verification
   - Backup file integrity checks

3. **Storage Monitoring**
   - Monitor backup storage usage
   - Alert when approaching storage limits
   - Cleanup old backups according to retention policy

### Alert Channels

- **Email**: Critical backup failures
- **Slack**: Daily backup status reports
- **Dashboard**: Real-time backup status monitoring

## Testing and Validation

### Monthly Backup Testing

1. **Restore Test**: Restore latest backup to staging environment
2. **Data Integrity**: Verify all tables and relationships
3. **Application Test**: Run application against restored database
4. **Performance Test**: Ensure restored database performs adequately
5. **Documentation**: Record test results and any issues

### Quarterly Disaster Recovery Drill

1. **Scenario Simulation**: Simulate complete data loss
2. **Full Recovery**: Execute complete disaster recovery procedure
3. **Time Measurement**: Measure actual RTO vs. target
4. **Process Review**: Identify improvements to procedures
5. **Documentation Update**: Update procedures based on learnings

## Compliance and Security

### Data Protection

- **Encryption**: All backups encrypted with AES-256
- **Access Control**: Backup access limited to authorized personnel
- **Audit Trail**: All backup and restore operations logged
- **Geographic Restrictions**: Backups stored in compliant regions

### Retention Policies

- **PITR**: 7-30 days (Supabase managed)
- **Daily Snapshots**: 30 days
- **Weekly Exports**: 12 weeks
- **Monthly Archives**: 7 years
- **File Storage**: Same as database retention

### Compliance Requirements

- **GDPR**: Right to erasure procedures documented
- **FERPA**: Educational data protection measures
- **SOC 2**: Backup and recovery controls documented
- **Data Residency**: Backups stored in appropriate regions

## Cost Optimization

### Storage Costs

- **Supabase Backups**: Included in subscription
- **S3 Standard**: Weekly backups (3 months)
- **S3 Glacier**: Monthly archives (7 years)
- **Cross-region replication**: For disaster recovery

### Estimated Monthly Costs

- **Supabase Pro Plan**: $25/month (includes backups)
- **S3 Storage**: ~$10/month for 100GB
- **S3 Glacier**: ~$2/month for 1TB long-term storage
- **Data Transfer**: ~$5/month for backup uploads

**Total Estimated Cost**: ~$42/month

## Backup Script Implementation

### Environment Variables

```bash
# .env.backup
DATABASE_URL=postgresql://...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BACKUP_BUCKET=qimma-database-backups
S3_STORAGE_BUCKET=qimma-storage-backups
SLACK_WEBHOOK_URL=...
```

### Cron Job Setup

```bash
# Weekly database backup - Sundays at 1:00 AM UTC
0 1 * * 0 /path/to/scripts/backup-weekly.sh

# Monthly storage backup - First Sunday at 2:00 AM UTC
0 2 1-7 * 0 /path/to/scripts/backup-storage.sh

# Daily backup monitoring - Every day at 9:00 AM UTC
0 9 * * * /path/to/scripts/check-backup-status.sh
```

## Emergency Contacts

### Internal Team

- **Database Administrator**: [email]
- **DevOps Engineer**: [email]
- **CTO**: [email]

### External Vendors

- **Supabase Support**: support@supabase.io
- **AWS Support**: [support case system]

## Documentation Maintenance

This document should be reviewed and updated:

- **Quarterly**: Review procedures and test results
- **After incidents**: Update based on lessons learned
- **Technology changes**: Update when infrastructure changes
- **Compliance updates**: Update when regulations change

---

**Last Updated**: 2025-05-30  
**Next Review**: 2025-08-30  
**Document Owner**: DevOps Team
