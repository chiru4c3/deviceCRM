# DeviceCRM

Hey there! 👋 This is my assignment of a device management system built with React. I created this to help businesses keep track of their device installations, maintenance, and service history all in one place.

## What's Cool About It?

I've packed in some features that I think make device management much easier:

- � Keep track of all your devices in one place
- 🔧 Never miss a training session or installation
- 📋 Log and track service visits easily
- 📊 Stay on top of your AMC/CMC contracts
- 📸 Store and organize device photos
- ⚠️ Get alerts when something needs attention
- 🌓 Easy on the eyes with dark mode
- 📱 Works great on phones too!

## Built With

I chose these tools because they're reliable and make development fun:

- React (Hooks make state management a breeze!)
- Material-UI for that clean, modern look
- Vite because it's super fast
- React Router for smooth navigation
- Added Error Boundaries to keep things stable
- Made sure it looks good on all screens

## Want to Try It Out?

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd deviceCRM
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
deviceCRM/
├── src/
│   ├── components/
│   │   └── ErrorBoundary.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
└── README.md
```

## What Can You Do With It?

### Keep Track of Your Devices
I've made it super easy to:
- See all your devices at a glance
- Check if they're online or need maintenance
- Monitor battery levels
- Keep track of contracts

### Handle Installations Like a Pro
- Record new installations
- Track training progress
- Upload important documents
- Use checklists to ensure nothing's missed

### Log Service Visits
- Keep a record of all maintenance work
- Assign engineers to specific tasks
- Note down why the visit was needed
- Add detailed notes for future reference

### Never Miss a Contract Renewal
- Get warnings before contracts expire
- See what's coming up for renewal
- Export reports for your meetings
- Know the status of each contract

### Keep Photos Organized
- Upload photos of installations and issues
- Group them by type (like 'Installation' or 'Maintenance')
- Find photos by facility
- Add notes to remember the context

### Stay Alert
- See issues as they happen
- Know what needs urgent attention
- Spot critical problems quickly
- Track pending training sessions

## Error Handling

The application implements React Error Boundaries to gracefully handle runtime errors:
- Isolates component failures
- Prevents complete app crashes
- Provides user-friendly error messages
- Includes reload functionality

## Check It Out Live!

I've got this up and running on Vercel. Take it for a spin:
[https://vercel.com/chiru-s-projects-ed55d419/device-crm](https://vercel.com/chiru-s-projects-ed55d419/device-crm)

[![Vercel Deployment Status](https://therealsujitk-vercel-badge.vercel.app/?app=device-crm)](https://vercel.com/chiru-s-projects-ed55d419/device-crm)

I chose Vercel for hosting because:
- It's super reliable
- Updates automatically when I push changes
- Handles all the HTTPS stuff
- Makes the app fast everywhere with its CDN
- Lets me roll back changes if something goes wrong

## Best Practices

- Component Memoization for performance
- Context API for state management
- Responsive design principles
- Proper error boundary implementation
- Modal-based forms for better UX
- Consistent styling with Material-UI

## Want to Help?

I'm always open to improvements! If you've got ideas:

1. Fork it
2. Create your feature branch
3. Make your changes
4. Push to the branch
5. Start a pull request

I'd love to see what you come up with!

## Questions?

Found a bug? Have a suggestion? Just open an issue in the repo and I'll take a look!

## License

This project is under the MIT License - use it however you like! 😊
