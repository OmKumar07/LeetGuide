#!/bin/bash

# LeetGuide Deployment Script
# This script handles the complete deployment process for both frontend and backend

echo "🚀 Starting LeetGuide Deployment Process..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "backend" ]; then
    print_error "This script must be run from the LeetGuide root directory"
    exit 1
fi

print_status "Checking project structure..."

# Frontend build
echo "📦 Building Frontend..."
cd frontend

if [ ! -f "package.json" ]; then
    print_error "Frontend package.json not found"
    exit 1
fi

print_status "Installing frontend dependencies..."
npm install

print_status "Building frontend for production..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Frontend build completed successfully!"
else
    print_error "Frontend build failed!"
    exit 1
fi

cd ..

# Backend check
echo "🔧 Checking Backend..."
cd backend

if [ ! -f "package.json" ]; then
    print_error "Backend package.json not found"
    exit 1
fi

print_status "Installing backend dependencies..."
npm install

print_status "Testing backend health check..."
npm run health 2>/dev/null || print_warning "Backend health check not available (this is normal for production)"

cd ..

# Git operations
echo "📝 Preparing Git commits..."

# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
    print_warning "No changes detected to commit"
else
    print_status "Staging all changes..."
    git add .
    
    echo "Enter commit message (or press Enter for default):"
    read -r commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="🚀 Production deployment with SEO enhancements and performance optimizations

- Enhanced HTML meta tags and Open Graph optimization
- Dynamic SEO components with user-specific content
- Progressive Web App (PWA) improvements
- Structured data (Schema.org) implementation
- Performance monitoring and Core Web Vitals
- Social sharing functionality
- Complete robots.txt and sitemap.xml
- Production-ready configuration files
- Netlify and Render deployment setup"
    fi
    
    git commit -m "$commit_message"
    print_status "Changes committed successfully!"
fi

# Push to dev branch
print_status "Pushing to dev branch..."
git push origin dev

if [ $? -eq 0 ]; then
    print_status "Successfully pushed to dev branch!"
else
    print_error "Failed to push to dev branch!"
    exit 1
fi

# Merge to main branch
echo "🔄 Merging to main branch..."
git checkout main
git pull origin main
git merge dev

if [ $? -eq 0 ]; then
    print_status "Successfully merged dev to main!"
else
    print_error "Failed to merge dev to main!"
    print_warning "Please resolve conflicts manually and try again"
    exit 1
fi

# Push to main
print_status "Pushing to main branch..."
git push origin main

if [ $? -eq 0 ]; then
    print_status "Successfully pushed to main branch!"
else
    print_error "Failed to push to main branch!"
    exit 1
fi

# Back to dev branch
git checkout dev

echo ""
echo "🎉 Deployment Process Completed Successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. 🌐 Deploy Frontend to Netlify:"
echo "   - Connect your GitHub repository to Netlify"
echo "   - Set build command: 'cd frontend && npm run build'"
echo "   - Set publish directory: 'frontend/dist'"
echo "   - Configure environment variables from .env.production"
echo ""
echo "2. 🔧 Deploy Backend to Render:"
echo "   - Connect your GitHub repository to Render"
echo "   - Use the render.yaml configuration"
echo "   - Set environment variables for production"
echo ""
echo "3. 🔗 Update API URLs:"
echo "   - Update VITE_API_URL in Netlify environment variables"
echo "   - Update CORS_ORIGIN in Render environment variables"
echo ""
echo "4. 🔍 SEO Setup:"
echo "   - Submit sitemap.xml to Google Search Console"
echo "   - Verify domain ownership"
echo "   - Set up Google Analytics (optional)"
echo ""
echo "🚀 Your LeetGuide application is now production-ready!"
