# Vercel Speed Insights Setup Guide

This document explains how Vercel Speed Insights has been configured for the MoodTunes project.

## What Was Done

### 1. Package Installation
The `@vercel/speed-insights` package (v2.0.0) has been installed:
```bash
npm install @vercel/speed-insights
```

### 2. HTML Integration
Speed Insights has been added to `public/index.html` using the recommended script tags for vanilla HTML/JavaScript projects:

```html
<!-- Vercel Speed Insights -->
<script>
    window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
</script>
<script defer src="/_vercel/speed-insights/script.js"></script>
```

This integration:
- Creates a global `window.si` function that queues calls before the tracking script loads
- Loads the Speed Insights tracking script from Vercel's CDN
- Automatically tracks Core Web Vitals (LCP, FID, CLS, FCP, TTFB, INP)
- Only collects data in production (not during local development)

## How It Works

### Automatic Tracking
Once deployed to Vercel, Speed Insights automatically captures:
- **LCP (Largest Contentful Paint)**: Loading performance
- **FID (First Input Delay)**: Interactivity
- **CLS (Cumulative Layout Shift)**: Visual stability
- **FCP (First Contentful Paint)**: Initial render time
- **TTFB (Time to First Byte)**: Server response time
- **INP (Interaction to Next Paint)**: Overall responsiveness

### Data Flow
1. User visits your deployed site on Vercel
2. Speed Insights script loads asynchronously
3. Performance metrics are captured automatically
4. Data is sent to Vercel's analytics backend
5. Metrics appear in your Vercel dashboard

## Enabling in Vercel Dashboard

To start collecting data, you must enable Speed Insights in your Vercel project:

1. Go to your project in the [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to the "Speed Insights" tab
3. Click "Enable Speed Insights"
4. Deploy your project (if not already deployed)
5. Wait for user traffic to accumulate data

## Viewing Analytics

After deployment and enabling:
1. Visit your project in the Vercel Dashboard
2. Click on the "Speed Insights" tab
3. View real-time performance metrics
4. Analyze trends over time
5. Identify performance bottlenecks

## Local Development

Speed Insights **does not track data** during local development:
- Running `vercel dev` or `npm run dev` won't send analytics
- Only production deployments on Vercel are tracked
- This prevents development data from skewing production metrics

## Advanced Configuration (Optional)

If you need custom configuration, you can use the programmatic approach with the `injectSpeedInsights()` function:

```javascript
// Create a separate speed-insights.js file
import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights({
    // Sample rate: collect data from 50% of visitors
    sampleRate: 0.5,
    
    // Debug mode (development only)
    debug: true,
    
    // Before send middleware
    beforeSend: (event) => {
        // Modify or filter events before sending
        console.log('Sending event:', event);
        return event;
    },
    
    // Custom route (for dynamic routes)
    route: '/custom-route'
});
```

Then include it in your HTML:
```html
<script type="module" src="speed-insights.js"></script>
```

**Note**: The simple script tag approach (currently used) is recommended for most use cases.

## No Environment Variables Required

Speed Insights works automatically with Vercel deployments and requires no environment variables or additional configuration beyond:
1. Installing the package
2. Adding the script tags
3. Enabling it in the dashboard

## Performance Impact

The Speed Insights script:
- Is loaded asynchronously with `defer`
- Has minimal performance overhead (~3-5KB gzipped)
- Does not block page rendering
- Only loads in production environments

## Troubleshooting

### Data Not Appearing
- Ensure Speed Insights is enabled in the Vercel Dashboard
- Verify your site is deployed to production (not preview)
- Wait 24 hours for initial data accumulation
- Check that script tags are in the `<body>` of your HTML

### Script Not Loading
- Verify the script path is `/_vercel/speed-insights/script.js`
- Check browser console for errors
- Ensure you're testing on a Vercel production deployment

### Development Mode
- Remember: Speed Insights doesn't track in development
- Test on a deployed Vercel URL (production or preview)

## References

- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Speed Insights Quickstart](https://vercel.com/docs/speed-insights/quickstart)
- [Web Vitals Overview](https://web.dev/vitals/)
- [Core Web Vitals](https://web.dev/vitals/#core-web-vitals)

## Package Information

- **Package**: `@vercel/speed-insights`
- **Version**: 2.0.0
- **Installation**: Added to `dependencies` in package.json
- **Type**: Performance monitoring library
- **License**: MIT

---

**Last Updated**: April 22, 2026
**Integration Status**: ✅ Complete
