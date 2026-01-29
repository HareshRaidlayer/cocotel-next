# Meilisearch Setup Guide for Ubuntu Server

## 1. Install Meilisearch on Ubuntu Server

### Method 1: Using APT (Recommended)

```bash
# Add Meilisearch GPG key
curl -L https://install.meilisearch.com | sh

# Move binary to system path
sudo mv ./meilisearch /usr/local/bin/

# Verify installation
meilisearch --version
```

### Method 2: Using Docker

```bash
# Install Docker if not already installed
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker

# Run Meilisearch with Docker
docker run -it --rm \
  -p 7700:7700 \
  -e MEILI_MASTER_KEY=your-secure-master-key \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v1.5
```

## 2. Configure Meilisearch as System Service

### Create systemd service file:

```bash
sudo nano /etc/systemd/system/meilisearch.service
```

Add the following content:

```ini
[Unit]
Description=Meilisearch
After=network.target

[Service]
Type=simple
User=meilisearch
Group=meilisearch
ExecStart=/usr/local/bin/meilisearch --http-addr 0.0.0.0:7700 --db-path /var/lib/meilisearch/data --master-key your-secure-master-key
Restart=on-failure
RestartSec=1
StandardOutput=journal
StandardError=journal
SyslogIdentifier=meilisearch
KillMode=mixed
KillSignal=SIGINT
TimeoutStopSec=5

[Install]
WantedBy=multi-user.target
```

### Create meilisearch user and directories:

```bash
# Create user
sudo useradd --system --shell /bin/false --home /var/lib/meilisearch meilisearch

# Create directories
sudo mkdir -p /var/lib/meilisearch/data
sudo chown -R meilisearch:meilisearch /var/lib/meilisearch

# Set permissions
sudo chmod 755 /var/lib/meilisearch
sudo chmod 755 /var/lib/meilisearch/data
```

### Start and enable service:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Start Meilisearch
sudo systemctl start meilisearch

# Enable auto-start on boot
sudo systemctl enable meilisearch

# Check status
sudo systemctl status meilisearch
```

## 3. Configure Firewall

```bash
# Allow Meilisearch port
sudo ufw allow 7700

# Or for specific IP ranges (recommended for production)
sudo ufw allow from YOUR_APP_SERVER_IP to any port 7700
```

## 4. Nginx Reverse Proxy (Optional but Recommended)

### Install Nginx:

```bash
sudo apt update
sudo apt install nginx -y
```

### Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/meilisearch
```

Add the following content:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://127.0.0.1:7700;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers for web applications
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Authorization, Content-Type";
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

### Enable the site:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/meilisearch /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 5. SSL Certificate with Let's Encrypt (Production)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal (already set up by certbot)
sudo systemctl status certbot.timer
```

## 6. Environment Configuration

### Update your Next.js `.env` file:

```env
# For local development
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_MASTER_KEY=your-secure-master-key

# For production
MEILISEARCH_HOST=https://your-domain.com
MEILISEARCH_MASTER_KEY=your-secure-master-key
```

## 7. Security Best Practices

### Generate a secure master key:

```bash
# Generate a random 32-character key
openssl rand -base64 32
```

### Restrict access:

```bash
# Only allow specific IPs
sudo ufw delete allow 7700
sudo ufw allow from YOUR_APP_SERVER_IP to any port 7700
sudo ufw allow from YOUR_ADMIN_IP to any port 7700
```

### Monitor logs:

```bash
# View Meilisearch logs
sudo journalctl -u meilisearch -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 8. Performance Optimization

### Increase system limits:

```bash
sudo nano /etc/security/limits.conf
```

Add:

```
meilisearch soft nofile 65536
meilisearch hard nofile 65536
```

### Optimize Meilisearch settings:

```bash
sudo nano /etc/systemd/system/meilisearch.service
```

Update ExecStart line:

```ini
ExecStart=/usr/local/bin/meilisearch \
  --http-addr 0.0.0.0:7700 \
  --db-path /var/lib/meilisearch/data \
  --master-key your-secure-master-key \
  --max-indexing-memory 2GB \
  --max-indexing-threads 4
```

## 9. Backup Strategy

### Create backup script:

```bash
sudo nano /usr/local/bin/backup-meilisearch.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backup/meilisearch"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Stop Meilisearch
sudo systemctl stop meilisearch

# Create backup
tar -czf $BACKUP_DIR/meilisearch_$DATE.tar.gz -C /var/lib/meilisearch data

# Start Meilisearch
sudo systemctl start meilisearch

# Keep only last 7 backups
find $BACKUP_DIR -name "meilisearch_*.tar.gz" -mtime +7 -delete

echo "Backup completed: meilisearch_$DATE.tar.gz"
```

### Make executable and schedule:

```bash
sudo chmod +x /usr/local/bin/backup-meilisearch.sh

# Add to crontab (daily backup at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-meilisearch.sh
```

## 10. Monitoring and Health Checks

### Create health check script:

```bash
sudo nano /usr/local/bin/meilisearch-health.sh
```

```bash
#!/bin/bash
MEILI_URL="http://localhost:7700"
MASTER_KEY="your-secure-master-key"

# Check if Meilisearch is responding
response=$(curl -s -o /dev/null -w "%{http_code}" "$MEILI_URL/health")

if [ $response -eq 200 ]; then
    echo "✅ Meilisearch is healthy"
    exit 0
else
    echo "❌ Meilisearch is not responding (HTTP $response)"
    # Restart service
    sudo systemctl restart meilisearch
    exit 1
fi
```

### Make executable:

```bash
sudo chmod +x /usr/local/bin/meilisearch-health.sh
```

## 11. Deployment Checklist

- [ ] Meilisearch installed and running
- [ ] Systemd service configured
- [ ] Firewall rules set
- [ ] SSL certificate installed (production)
- [ ] Environment variables updated
- [ ] Data synced from MongoDB
- [ ] Search functionality tested
- [ ] Backup strategy implemented
- [ ] Monitoring set up

## 12. Troubleshooting

### Common issues:

1. **Permission denied**: Check file permissions and user ownership
2. **Port already in use**: Check if another service is using port 7700
3. **Memory issues**: Increase system memory or adjust Meilisearch memory limits
4. **Network issues**: Check firewall rules and network connectivity

### Useful commands:

```bash
# Check service status
sudo systemctl status meilisearch

# View logs
sudo journalctl -u meilisearch -f

# Test connection
curl http://localhost:7700/health

# Check disk usage
du -sh /var/lib/meilisearch/data

# Monitor resource usage
htop
```

## 13. Next.js Application Setup

### Install dependencies:

```bash
npm install meilisearch
```

### Sync data:

1. Visit `http://your-domain.com/admin` in your browser
2. Click "Sync Data" to initialize the search index
3. Wait for completion
4. Test search functionality

### Production deployment:

1. Update environment variables with production URLs
2. Deploy your Next.js application
3. Run data sync
4. Test all search features

Your Meilisearch setup is now complete and ready for production use!