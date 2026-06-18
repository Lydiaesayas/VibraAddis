# VibraAddis Deployment Guide

## Prerequisites

Before deploying VibraAddis to production, ensure you have:

- Node.js (v18 or higher)
- MongoDB Atlas account or MongoDB server
- Domain name configured
- SSL certificate (HTTPS required for payment gateways)
- Payment gateway accounts (Telebirr, CBE Birr)
- Email service account (SendGrid, AWS SES, or SMTP server)

## Environment Setup

### 1. Backend Configuration

Create `.env.production` file in the backend directory:

```bash
cd backend
cp .env.example .env.production
```

Edit `.env.production` with your production values:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vibraaddis
JWT_SECRET=your_secure_jwt_secret_min_32_characters
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Payment Gateways
TELEBIRR_API_KEY=your_telebirr_api_key
TELEBIRR_MERCHANT_CODE=your_merchant_code
TELEBIRR_SECRET_KEY=your_secret_key
TELEBIRR_ENVIRONMENT=production

CBE_BIRR_API_KEY=your_cbe_birr_api_key
CBE_BIRR_MERCHANT_ID=your_merchant_id
CBE_BIRR_SECRET_KEY=your_secret_key
CBE_BIRR_ENVIRONMENT=production

# CORS
FRONTEND_URL=https://yourdomain.com
MOBILE_URL=https://yourdomain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Frontend Configuration

Create `.env.production` file in the frontend directory:

```bash
cd frontend
cp .env.example .env.production
```

Edit `.env.production`:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

## Deployment Steps

### Backend Deployment

1. **Install Dependencies**
```bash
cd backend
npm install --production
```

2. **Seed Database**
```bash
node seed.js
```

3. **Start Application**
```bash
# Using PM2 (recommended for production)
npm install -g pm2
pm2 start server.js --name vibraaddis-backend
pm2 save
pm2 startup

# Or using Node directly
NODE_ENV=production node server.js
```

### Frontend Deployment

1. **Build for Production**
```bash
cd frontend
npm install
npm run build
```

2. **Deploy to Hosting Service**
- Upload the `dist` folder to your hosting service
- Recommended: Vercel, Netlify, or AWS S3 + CloudFront

### Cron Job Setup

Set up daily subscription expiration check:

```bash
# Add to crontab
crontab -e

# Add this line to run daily at 2 AM
0 2 * * * cd /path/to/VibraAddis/backend && node scripts/checkSubscriptionExpiration.js
```

## Payment Gateway Integration

### Telebirr Integration

1. Register at [Telebirr Developer Portal](https://developer.telebirr.et)
2. Obtain API credentials
3. Add credentials to `.env.production`
4. Test in sandbox environment first
5. Switch to production when ready

### CBE Birr Integration

1. Register at [CBE Birr Portal](https://cbe.com.et/birr)
2. Obtain merchant credentials
3. Add credentials to `.env.production`
4. Test in sandbox environment first
5. Switch to production when ready

## Monitoring and Logging

### View Logs

```bash
# Application logs
tail -f backend/logs/*.log

# PM2 logs (if using PM2)
pm2 logs vibraaddis-backend
```

### System Metrics

Access monitoring endpoint:
```
GET /api/analytics/dashboard
```

## Security Considerations

1. **HTTPS Required**: Payment gateways require HTTPS
2. **Environment Variables**: Never commit `.env.production` to version control
3. **Database Security**: Use MongoDB Atlas with IP whitelisting
4. **API Rate Limiting**: Already configured in server.js
5. **CORS**: Configure allowed origins in production

## Backup Strategy

### Database Backup

```bash
# MongoDB Atlas backup (automatic)
# Or manual backup using mongodump
mongodump --uri="mongodb://username:password@host:port/database" --out=./backup
```

### File Backup

```bash
# Backup uploads and logs
tar -czf backup-$(date +%Y%m%d).tar.gz backend/logs backend/uploads
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB URI in `.env.production`
   - Verify IP whitelist in MongoDB Atlas
   - Check network connectivity

2. **Payment Gateway Errors**
   - Verify API credentials
   - Check sandbox vs production environment
   - Ensure HTTPS is configured

3. **Email Not Sending**
   - Verify SMTP credentials
   - Check email service provider settings
   - Review logs for error messages

### Health Check

```bash
# Check if backend is running
curl https://api.yourdomain.com/

# Check database connection
curl https://api.yourdomain.com/test
```

## Scaling

### Horizontal Scaling

1. Use load balancer (Nginx, AWS ELB)
2. Deploy multiple backend instances
3. Use PM2 cluster mode:
```bash
pm2 start server.js -i max --name vibraaddis-backend
```

### Database Scaling

- Use MongoDB Atlas with auto-scaling
- Implement database sharding for large datasets
- Use Redis for caching frequently accessed data

## Support

For deployment issues, contact:
- Email: support@vibraaddis.com
- Documentation: https://docs.vibraaddis.com
