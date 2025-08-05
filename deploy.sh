#!/bin/bash

# Rajesh Sangwan Export Company - Deployment Script
# This script helps deploy your website to your server

echo "🚀 Rajesh Sangwan Export Company - Website Deployment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_warning "This script is running as root. This is generally not recommended."
   read -p "Do you want to continue? (y/n): " -n 1 -r
   echo
   if [[ ! $REPLY =~ ^[Yy]$ ]]; then
       exit 1
   fi
fi

# Get deployment method
echo
print_info "Choose your deployment method:"
echo "1) Local server (copy files to /var/www/html/)"
echo "2) Remote server via SCP"
echo "3) FTP deployment"
echo "4) Create deployment package (ZIP)"
echo "5) Git deployment"

read -p "Enter your choice (1-5): " DEPLOY_METHOD

case $DEPLOY_METHOD in
    1)
        # Local deployment
        print_info "Deploying to local server..."
        
        WEB_DIR="/var/www/html"
        BACKUP_DIR="/var/backups/website"
        
        # Create backup
        if [ -d "$WEB_DIR" ] && [ "$(ls -A $WEB_DIR)" ]; then
            print_info "Creating backup..."
            sudo mkdir -p "$BACKUP_DIR"
            sudo cp -r "$WEB_DIR" "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)"
            print_status "Backup created"
        fi
        
        # Copy files
        print_info "Copying website files..."
        sudo cp -r ./* "$WEB_DIR/"
        
        # Set permissions
        print_info "Setting permissions..."
        sudo chown -R www-data:www-data "$WEB_DIR"
        sudo chmod -R 755 "$WEB_DIR"
        sudo chmod 644 "$WEB_DIR/.htaccess" 2>/dev/null || true
        
        # Test web server
        if command -v apache2 &> /dev/null; then
            print_info "Testing Apache configuration..."
            if sudo apache2ctl configtest; then
                sudo systemctl reload apache2
                print_status "Apache reloaded successfully"
            else
                print_error "Apache configuration test failed"
            fi
        elif command -v nginx &> /dev/null; then
            print_info "Testing Nginx configuration..."
            if sudo nginx -t; then
                sudo systemctl reload nginx
                print_status "Nginx reloaded successfully"
            else
                print_error "Nginx configuration test failed"
            fi
        fi
        
        print_status "Local deployment completed!"
        ;;
        
    2)
        # Remote SCP deployment
        print_info "Remote server deployment via SCP"
        
        read -p "Enter server IP or hostname: " SERVER_HOST
        read -p "Enter username: " SERVER_USER
        read -p "Enter remote path (e.g., /var/www/html/): " REMOTE_PATH
        
        print_info "Uploading files to $SERVER_USER@$SERVER_HOST:$REMOTE_PATH"
        
        # Create a temporary zip to upload
        print_info "Creating deployment package..."
        zip -r "website-deploy-$(date +%Y%m%d-%H%M%S).zip" . -x "*.git*" "*.DS_Store" "deploy.sh"
        
        # Upload zip file
        scp "website-deploy-"*.zip "$SERVER_USER@$SERVER_HOST:/tmp/"
        
        # Extract on remote server
        ssh "$SERVER_USER@$SERVER_HOST" << EOF
            cd /tmp
            unzip -o website-deploy-*.zip -d website-temp/
            sudo cp -r website-temp/* $REMOTE_PATH/
            sudo chown -R www-data:www-data $REMOTE_PATH/
            sudo chmod -R 755 $REMOTE_PATH/
            sudo chmod 644 $REMOTE_PATH/.htaccess 2>/dev/null || true
            rm -rf website-temp/ website-deploy-*.zip
            
            # Restart web server
            if command -v apache2 &> /dev/null; then
                sudo systemctl reload apache2
            elif command -v nginx &> /dev/null; then
                sudo systemctl reload nginx
            fi
EOF
        
        # Clean up local zip
        rm website-deploy-*.zip
        
        print_status "Remote deployment completed!"
        ;;
        
    3)
        # FTP deployment
        print_info "FTP deployment selected"
        print_warning "For FTP deployment, please use an FTP client like FileZilla"
        print_info "FTP Connection Details needed:"
        echo "- Host: ftp.yourdomain.com"
        echo "- Username: your_ftp_username"
        echo "- Password: your_ftp_password"
        echo "- Port: 21 (or 22 for SFTP)"
        echo "- Upload all files to: /public_html/ or /www/"
        ;;
        
    4)
        # Create deployment package
        print_info "Creating deployment package..."
        
        PACKAGE_NAME="rajeshsangwan-export-$(date +%Y%m%d-%H%M%S).zip"
        
        # Create zip excluding unnecessary files
        zip -r "$PACKAGE_NAME" . \
            -x "*.git*" \
            -x "*.DS_Store" \
            -x "node_modules/*" \
            -x "*.log" \
            -x "deploy.sh" \
            -x "deployment-guide.md"
        
        print_status "Deployment package created: $PACKAGE_NAME"
        print_info "Upload this file to your server and extract it in your web directory"
        ;;
        
    5)
        # Git deployment
        print_info "Git deployment setup"
        
        if [ ! -d ".git" ]; then
            print_info "Initializing Git repository..."
            git init
            git add .
            git commit -m "Initial commit - Export company website"
        fi
        
        read -p "Enter your Git repository URL: " GIT_REPO
        
        if [ ! -z "$GIT_REPO" ]; then
            git remote add origin "$GIT_REPO" 2>/dev/null || git remote set-url origin "$GIT_REPO"
            git push -u origin main
            print_status "Code pushed to repository"
            
            print_info "To deploy on your server, run:"
            echo "git clone $GIT_REPO /var/www/html/"
            echo "cd /var/www/html/"
            echo "./deploy.sh"
        fi
        ;;
        
    *)
        print_error "Invalid option selected"
        exit 1
        ;;
esac

# Post-deployment instructions
echo
print_info "Post-deployment checklist:"
echo "□ Update domain name in HTML, XML, and .htaccess files"
echo "□ Add your actual images to the images/ folder"
echo "□ Update contact information with your real details"
echo "□ Set up SSL certificate (Let's Encrypt recommended)"
echo "□ Submit sitemap.xml to Google Search Console"
echo "□ Test website functionality"
echo "□ Set up Google Analytics"
echo "□ Configure CDN for international users (Cloudflare recommended)"

echo
print_status "Deployment process completed!"
print_info "Your export company website should now be live!"

# Display helpful commands
echo
print_info "Useful commands for server management:"
echo "• Check Apache status: sudo systemctl status apache2"
echo "• Check Nginx status: sudo systemctl status nginx"
echo "• View error logs: sudo tail -f /var/log/apache2/error.log"
echo "• Test website: curl -I http://yourdomain.com"
echo "• Check SSL: openssl s_client -connect yourdomain.com:443"

echo
print_warning "Remember to:"
echo "• Keep your website updated"
echo "• Monitor performance regularly"
echo "• Backup your site regularly"
echo "• Update security patches"
echo "• Monitor international SEO performance"

echo
echo "🌍 Your export company is now ready to attract international customers!"
echo "=================================================="