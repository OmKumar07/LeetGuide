# LeetGuide Deployment Script for Windows PowerShell
# This script handles the complete deployment process for both frontend and backend

Write-Host "🚀 Starting LeetGuide Deployment Process..." -ForegroundColor Green

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Check if we're in the right directory
if (-not (Test-Path "package.json") -and -not (Test-Path "frontend") -and -not (Test-Path "backend")) {
    Write-Error "This script must be run from the LeetGuide root directory"
    exit 1
}

Write-Success "Checking project structure..."

# Frontend build
Write-Host "📦 Building Frontend..." -ForegroundColor Cyan
Set-Location frontend

if (-not (Test-Path "package.json")) {
    Write-Error "Frontend package.json not found"
    exit 1
}

Write-Success "Installing frontend dependencies..."
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install frontend dependencies"
    exit 1
}

Write-Success "Building frontend for production..."
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Success "Frontend build completed successfully!"
} else {
    Write-Error "Frontend build failed!"
    exit 1
}

Set-Location ..

# Backend check
Write-Host "🔧 Checking Backend..." -ForegroundColor Cyan
Set-Location backend

if (-not (Test-Path "package.json")) {
    Write-Error "Backend package.json not found"
    exit 1
}

Write-Success "Installing backend dependencies..."
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install backend dependencies"
    exit 1
}

Write-Success "Backend dependencies installed successfully!"

Set-Location ..

# Git operations
Write-Host "📝 Preparing Git commits..." -ForegroundColor Cyan

# Check if there are changes to commit
$gitStatus = git status --porcelain
if (-not $gitStatus) {
    Write-Warning "No changes detected to commit"
} else {
    Write-Success "Staging all changes..."
    git add .
    
    $commitMessage = Read-Host "Enter commit message (or press Enter for default)"
    
    if ([string]::IsNullOrEmpty($commitMessage)) {
        $commitMessage = @"
🚀 Production deployment with SEO enhancements and performance optimizations

- Enhanced HTML meta tags and Open Graph optimization
- Dynamic SEO components with user-specific content
- Progressive Web App (PWA) improvements
- Structured data (Schema.org) implementation
- Performance monitoring and Core Web Vitals
- Social sharing functionality
- Complete robots.txt and sitemap.xml
- Production-ready configuration files
- Netlify and Render deployment setup
"@
    }
    
    git commit -m $commitMessage
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Changes committed successfully!"
    } else {
        Write-Error "Failed to commit changes!"
        exit 1
    }
}

# Push to dev branch
Write-Success "Pushing to dev branch..."
git push origin dev

if ($LASTEXITCODE -eq 0) {
    Write-Success "Successfully pushed to dev branch!"
} else {
    Write-Error "Failed to push to dev branch!"
    exit 1
}

# Merge to main branch
Write-Host "🔄 Merging to main branch..." -ForegroundColor Cyan
git checkout main
git pull origin main
git merge dev

if ($LASTEXITCODE -eq 0) {
    Write-Success "Successfully merged dev to main!"
} else {
    Write-Error "Failed to merge dev to main!"
    Write-Warning "Please resolve conflicts manually and try again"
    exit 1
}

# Push to main
Write-Success "Pushing to main branch..."
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Success "Successfully pushed to main branch!"
} else {
    Write-Error "Failed to push to main branch!"
    exit 1
}

# Back to dev branch
git checkout dev

Write-Host ""
Write-Host "🎉 Deployment Process Completed Successfully!" -ForegroundColor Green -BackgroundColor DarkGreen
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. 🌐 Deploy Frontend to Netlify:" -ForegroundColor Cyan
Write-Host "   - Connect your GitHub repository to Netlify"
Write-Host "   - Set build command: 'cd frontend && npm run build'"
Write-Host "   - Set publish directory: 'frontend/dist'"
Write-Host "   - Configure environment variables from .env.production"
Write-Host ""
Write-Host "2. 🔧 Deploy Backend to Render:" -ForegroundColor Cyan
Write-Host "   - Connect your GitHub repository to Render"
Write-Host "   - Use the render.yaml configuration"
Write-Host "   - Set environment variables for production"
Write-Host ""
Write-Host "3. 🔗 Update API URLs:" -ForegroundColor Cyan
Write-Host "   - Update VITE_API_URL in Netlify environment variables"
Write-Host "   - Update CORS_ORIGIN in Render environment variables"
Write-Host ""
Write-Host "4. 🔍 SEO Setup:" -ForegroundColor Cyan
Write-Host "   - Submit sitemap.xml to Google Search Console"
Write-Host "   - Verify domain ownership"
Write-Host "   - Set up Google Analytics (optional)"
Write-Host ""
Write-Host "🚀 Your LeetGuide application is now production-ready!" -ForegroundColor Green
