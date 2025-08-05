# Deployment Guide - Rajesh Sangwan Export Company Website

This guide covers multiple deployment methods for your export company website, from basic shared hosting to advanced cloud deployments.

## 🚀 Quick Deployment Checklist

Before deploying, ensure you have:
- [ ] All website files ready
- [ ] Server access credentials
- [ ] Domain name configured
- [ ] SSL certificate (recommended)
- [ ] Backup of existing site (if any)

## 📁 Files to Deploy

Make sure you have all these files ready:
```
rajeshsangwan-export/
├── index.html
├── styles.css
├── script.js
├── sitemap.xml
├── robots.txt
├── .htaccess
├── README.md
└── images/ (create this folder and add your images)
    ├── logo.png
    ├── hero-export.jpg
    ├── textiles.jpg
    ├── handicrafts.jpg
    ├── spices.jpg
    ├── agriculture.jpg
    ├── about-us.jpg
    ├── world-map.svg
    └── (other images as needed)
```

## 🌐 Method 1: Shared Hosting (cPanel/FTP)

### Using cPanel File Manager:
1. **Log into cPanel**
   - Go to your hosting provider's cPanel
   - Find "File Manager"

2. **Navigate to public_html**
   - Click on `public_html` folder
   - This is your website's root directory

3. **Upload Files**
   - Click "Upload" button
   - Select all your website files
   - Or use "Extract" if you have a ZIP file

4. **Set Permissions**
   - Right-click on `.htaccess` → Permissions → Set to 644
   - Right-click on all folders → Permissions → Set to 755

### Using FTP Client (FileZilla):
1. **Download FileZilla** (free FTP client)

2. **Connect to Server**
   ```
   Host: ftp.yourdomain.com (or your server IP)
   Username: your_ftp_username
   Password: your_ftp_password
   Port: 21 (or 22 for SFTP)
   ```

3. **Upload Files**
   - Navigate to `/public_html/` on remote server
   - Drag and drop all files from local to remote
   - Wait for upload to complete

## ☁️ Method 2: Cloud Hosting (AWS, Google Cloud, DigitalOcean)

### AWS S3 + CloudFront (Static Hosting):
```bash
# Install AWS CLI
pip install awscli

# Configure AWS
aws configure

# Create S3 bucket
aws s3 mb s3://rajeshsangwan-export

# Upload files
aws s3 sync . s3://rajeshsangwan-export --delete

# Enable static website hosting
aws s3 website s3://rajeshsangwan-export --index-document index.html --error-document 404.html
```

### DigitalOcean Droplet:
```bash
# Connect to your droplet
ssh root@your_server_ip

# Install Nginx
apt update
apt install nginx

# Create website directory
mkdir -p /var/www/rajeshsangwan.com

# Upload files (use SCP or SFTP)
# Then move to website directory
```

## 🐧 Method 3: Linux Server (Ubuntu/CentOS)

### Using SCP (Secure Copy):
```bash
# From your local machine, upload files
scp -r /path/to/your/website/* username@server_ip:/var/www/html/

# Or create a zip and upload
zip -r website.zip .
scp website.zip username@server_ip:/var/www/html/
ssh username@server_ip
cd /var/www/html/
unzip website.zip
```

### Using SFTP:
```bash
# Connect via SFTP
sftp username@server_ip

# Navigate to web directory
cd /var/www/html/

# Upload files
put -r /local/path/to/files/* .

# Exit SFTP
quit
```

### Server Configuration:

#### Apache Server:
```bash
# Install Apache (if not installed)
sudo apt update
sudo apt install apache2

# Enable modules
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod expires
sudo a2enmod deflate

# Restart Apache
sudo systemctl restart apache2

# Set permissions
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

#### Nginx Server:
```bash
# Install Nginx
sudo apt install nginx

# Create server block
sudo nano /etc/nginx/sites-available/rajeshsangwan.com
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name rajeshsangwan.com www.rajeshsangwan.com;
    root /var/www/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/javascript text/xml application/xml;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1M;
        add_header Cache-Control "public, immutable";
    }

    # Handle .htaccess rules (convert to nginx format)
    location / {
        try_files $uri $uri/ =404;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/rajeshsangwan.com /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

## 🔐 Method 4: Using Git Deployment

### Set up Git on Server:
```bash
# On your server
cd /var/www/html/
git init
git remote add origin https://github.com/your-username/rajeshsangwan-export.git

# Create deployment script
nano deploy.sh
```

Deployment script:
```bash
#!/bin/bash
cd /var/www/html/
git pull origin main
sudo chown -R www-data:www-data .
sudo chmod -R 755 .
sudo systemctl reload apache2  # or nginx
echo "Deployment completed!"
```

```bash
# Make executable
chmod +x deploy.sh

# Deploy
./deploy.sh
```

### GitHub Actions Auto-Deployment:
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Server
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          cd /var/www/html/
          git pull origin main
          sudo systemctl reload apache2
```

## 🌍 Method 5: CDN Deployment (Recommended for International)

### Cloudflare Setup:
1. **Sign up for Cloudflare**
2. **Add your domain**
3. **Change nameservers** at your domain registrar
4. **Enable these features:**
   - Auto Minify (CSS, JS, HTML)
   - Brotli compression
   - Always Use HTTPS
   - HTTP/2

### AWS CloudFront:
```bash
# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://distribution-config.json
```

## 📱 Method 6: One-Click Deployment Scripts

### Automated Deployment Script:
```bash
#!/bin/bash
# automated-deploy.sh

echo "🚀 Starting deployment..."

# Variables
DOMAIN="rajeshsangwan.com"
WEB_DIR="/var/www/html"
BACKUP_DIR="/var/backups/website"

# Create backup
echo "📦 Creating backup..."
mkdir -p $BACKUP_DIR
cp -r $WEB_DIR/* $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)/

# Upload new files
echo "📤 Uploading files..."
cp -r ./* $WEB_DIR/

# Set permissions
echo "🔐 Setting permissions..."
chown -R www-data:www-data $WEB_DIR
chmod -R 755 $WEB_DIR
chmod 644 $WEB_DIR/.htaccess

# Test configuration
echo "🧪 Testing server configuration..."
if command -v apache2 &> /dev/null; then
    apache2ctl configtest && systemctl reload apache2
elif command -v nginx &> /dev/null; then
    nginx -t && systemctl reload nginx
fi

echo "✅ Deployment completed successfully!"
echo "🌐 Your website is now live at https://$DOMAIN"
```

## 🛡️ SSL Certificate Setup

### Using Let's Encrypt (Free):
```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache

# Get certificate
sudo certbot --apache -d rajeshsangwan.com -d www.rajeshsangwan.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Post-Deployment Configuration

### 1. Update Domain References:
```bash
# Find and replace domain references
find /var/www/html -type f -name "*.html" -exec sed -i 's/rajeshsangwan\.com/yourdomain.com/g' {} +
find /var/www/html -type f -name "*.xml" -exec sed -i 's/rajeshsangwan\.com/yourdomain.com/g' {} +
```

### 2. Test Website:
- [ ] Check homepage loads correctly
- [ ] Test all navigation links
- [ ] Verify contact form works
- [ ] Test mobile responsiveness
- [ ] Check SSL certificate
- [ ] Validate HTML/CSS
- [ ] Test page speed

### 3. SEO Setup:
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics
- [ ] Verify structured data
- [ ] Test international targeting

## 📊 Monitoring & Maintenance

### Server Monitoring:
```bash
# Check server status
systemctl status apache2  # or nginx
systemctl status mysql    # if using database

# Monitor logs
tail -f /var/log/apache2/access.log
tail -f /var/log/apache2/error.log
```

### Performance Monitoring:
- Use Google PageSpeed Insights
- Monitor Core Web Vitals
- Check international loading speeds
- Monitor uptime with services like UptimeRobot

## 🆘 Troubleshooting

### Common Issues:

**Permission Errors:**
```bash
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
sudo chmod 644 /var/www/html/.htaccess
```

**Apache/Nginx Not Starting:**
```bash
# Check configuration
apache2ctl configtest
nginx -t

# Check error logs
tail -f /var/log/apache2/error.log
tail -f /var/log/nginx/error.log
```

**SSL Issues:**
```bash
# Renew certificate
sudo certbot renew

# Check certificate
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/cert.pem -text -noout
```

## 📞 Need Help?

If you encounter issues:
1. Check server error logs
2. Verify file permissions
3. Test with a simple HTML file first
4. Contact your hosting provider
5. Use online tools to test your website

---

**🎉 Congratulations!** Your export company website is now deployed and ready to attract international customers!

Remember to:
- Keep your website updated
- Monitor performance regularly
- Backup your site regularly
- Update security patches
- Monitor international SEO performance