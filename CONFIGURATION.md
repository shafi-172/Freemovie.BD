# CineMax Configuration Guide

## Overview
This guide explains how to customize and configure the Freemovie.BD movie platform for your specific needs.

## 📋 Table of Contents
1. [Color Customization](#color-customization)
2. [Movie Database Configuration](#movie-database-configuration)
3. [Content Updates](#content-updates)
4. [Deployment](#deployment)
5. [Performance Optimization](#performance-optimization)

---

## 🎨 Color Customization

### Changing Color Scheme
Edit the CSS variables in `styles/main.css` (lines 6-18):

```css
:root {
    /* Color Palette */
    --primary-color: #FF6B35;      /* Orange */
    --secondary-color: #004E89;    /* Navy Blue */
    --accent-color: #F7931E;       /* Gold */
    --dark-bg: #0a0e27;            /* Dark Background */
    --card-bg: #1a1f3a;            /* Card Background */
    --text-light: #e8e8ff;         /* Light Text */
    --text-muted: #a0a0b8;         /* Muted Text */
    --border-color: #2a2f4a;       /* Border Color */
    --success: #1abc9c;            /* Success Color */
}
```

### Example: Blue Theme
```css
--primary-color: #0066FF;
--secondary-color: #001F4D;
--accent-color: #00A3FF;
--dark-bg: #0A0E1A;
--card-bg: #151B2F;
```

### Example: Purple Theme
```css
--primary-color: #9F4CE8;
--secondary-color: #4A1A7F;
--accent-color: #D946EF;
--dark-bg: #0F0A15;
--card-bg: #1A1025;
```

---

## 🎬 Movie Database Configuration

### Adding Movies
Edit `js/data.js` and add entries to the `moviesDatabase` array:

```javascript
{
    id: 17,                              // Unique ID
    title: "Movie Title",                // Movie name
    rating: 8.5,                         // IMDb-style rating (0-10)
    votes: 15000,                        // Number of ratings
    year: 2024,                          // Release year
    genre: ["Action", "Thriller"],       // Genre(s)
    image: "https://image-url.jpg",      // Movie poster URL
    description: "Full description...",  // Long description
    director: "Director Name",           // Director name
    cast: ["Actor 1", "Actor 2"],       // Cast list
    duration: "148 min",                 // Runtime
    budget: "$150M",                     // Production budget
    boxOffice: "$750M",                  // Box office earnings
    language: "English",                 // Primary language
    releaseDate: "March 20, 2024",      // Release date
    category: "recent"                   // Category: recent, trending, top
}
```

### Movie Categories
- `recent`: Recently released movies
- `trending`: Popular/trending movies
- `top`: Top-rated movies
- `all`: Default, all movies

### Image Guidelines
- Use high-quality poster images
- Recommended resolution: 400x600px
- Supported formats: JPG, PNG, WebP
- File size: Under 200KB for optimal loading

---

## 📝 Content Updates

### Homepage Hero Section
Edit `index.html` (lines 38-46):

```html
<div class="hero-text">
    <h1 class="hero-title">Experience Cinema</h1>
    <p class="hero-subtitle">Discover the World's Greatest Films</p>
    <button class="btn btn-primary" onclick="scrollToSection('featured')">
        Explore Now
    </button>
</div>
```

### Contact Information
Edit footer contact section in `index.html` (lines 269-272):

```html
<p><i class="fas fa-envelope"></i> your-email@cinemax.com</p>
<p><i class="fas fa-phone"></i> +1 (XXX) XXX-XXXX</p>
<p><i class="fas fa-map-pin"></i> Your City, State ZIP</p>
```

### Social Media Links
Edit footer social links in `index.html` (lines 260-266):

```html
<div class="social-links">
    <a href="https://facebook.com/yourpage"><i class="fab fa-facebook"></i></a>
    <a href="https://twitter.com/yourhandle"><i class="fab fa-twitter"></i></a>
    <a href="https://instagram.com/yourhandle"><i class="fab fa-instagram"></i></a>
    <a href="https://youtube.com/yourchannel"><i class="fab fa-youtube"></i></a>
</div>
```

---

## 🚀 Deployment

### Option 1: GitHub Pages (Free)

1. Create a GitHub repository named `username.github.io`
2. Push your files to the `main` branch
3. Your site will be live at `https://username.github.io`

### Option 2: Netlify (Easy)

1. Sign up at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Set build command: (leave empty)
4. Set publish directory: `/`
5. Deploy!

### Option 3: Vercel

1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Click Deploy
4. Your site is live!

### Option 4: Traditional Hosting

1. Upload all files to your web hosting via FTP
2. Set `index.html` as your default document
3. Your site is accessible via your domain

### Custom Domain Setup
```
1. Register domain (GoDaddy, Namecheap, etc.)
2. Update DNS settings:
   - A Record: Point to hosting IP
   - CNAME: Point to hosting provider
3. Update in site settings/dashboard
4. Wait for DNS propagation (24-48 hours)
```

---

## ⚡ Performance Optimization

### Image Optimization
```bash
# Using ImageMagick
mogrify -resize 400x600 -quality 85 *.jpg

# Using ImageOptim (Mac)
# Drag and drop images to ImageOptim
```

### Enable GZIP Compression
In `.htaccess` (Apache):
```apache
<IfModule mod_gzip.c>
  mod_gzip_on On
  mod_gzip_types text/html text/plain text/xml
  mod_gzip_types text/css text/javascript application/javascript
</IfModule>
```

### Caching Strategy
Add to `.htaccess`:
```apache
<FilesMatch "\\.(jpg|jpeg|png|gif|ico|css|js)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

<FilesMatch "\\.html$">
  Header set Cache-Control "max-age=3600, public"
</FilesMatch>
```

### Async Font Loading
The site uses Font Awesome from CDN. To load locally:

1. Download Font Awesome from [fontawesome.com](https://fontawesome.com)
2. Extract to `/fonts/` directory
3. Update CSS link in `index.html`:
```html
<link rel="stylesheet" href="/fonts/css/all.min.css">
```

---

## 🔍 SEO Optimization

### Meta Tags
Add to `<head>` in `index.html`:

```html
<meta name="description" content="CineMax - Premium movie streaming platform with thousands of films">
<meta name="keywords" content="movies, streaming, cinema, films, watch movies online">
<meta name="author" content="Your Name">
<meta property="og:title" content="CineMax - Premium Movie Platform">
<meta property="og:description" content="Discover the world's greatest films">
<meta property="og:image" content="https://yoursite.com/og-image.jpg">
<meta property="og:url" content="https://yoursite.com">
<meta name="twitter:card" content="summary_large_image">
```

### Structured Data
Add JSON-LD schema for SEO:

```javascript
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "CineMax",
  "url": "https://yoursite.com",
  "applicationCategory": "MultimediaApplication",
  "offers": {
    "@type": "Offer",
    "price": "0"
  }
}
</script>
```

---

## 📱 Mobile Optimization

### Viewport Configuration
Already set in `index.html`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Touch-Friendly Buttons
All buttons are already sized for touch (minimum 44x44px)

### Mobile Testing
Test on:
- Chrome DevTools mobile emulation
- iPhone/iPad Safari
- Android browsers
- Actual devices if possible

---

## 🔐 Security Best Practices

1. **HTTPS**: Always use HTTPS in production
2. **Content Security Policy**: Add CSP headers
3. **Input Validation**: Email is validated client-side
4. **No Sensitive Data**: Don't store passwords or tokens
5. **Regular Updates**: Keep dependencies updated

---

## 📊 Analytics Integration

### Add Google Analytics
Add to `<head>` before closing tag:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Track Custom Events
```javascript
// Track movie clicks
gtag('event', 'movie_viewed', {
  'movie_id': movie.id,
  'movie_title': movie.title
});
```

---

## 🆘 Troubleshooting

### Movies Not Displaying
- Check `js/data.js` for syntax errors
- Verify image URLs are correct
- Open browser console (F12) for errors

### Styles Not Applied
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS file paths start with `/`
- Verify CSS variables are defined

### Search Not Working
- Check `js/main.js` is loaded
- Verify `moviesDatabase` is defined
- Check browser console for errors

### Modal Not Opening
- Ensure JavaScript is enabled
- Check modal element exists in HTML
- Verify click handlers are attached

---

## 📞 Support

For issues or questions:
- Check this configuration guide
- Review console error messages
- Check browser console (F12)
- Visit the GitHub repository for issues

---

**Last Updated**: March 2024
**Version**: 1.0.0
