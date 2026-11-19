# Driving License Sample Card Maker

A static HTML, CSS and JavaScript demo-card designer. It is intentionally branded as a non-government sample and does not create official seals, scannable QR codes, or valid barcodes.

## Files
- `index.html` — form and front/back preview
- `style.css` — layout and card styles
- `script.js` — live preview, image upload, PNG export and print

## Run locally
Open `index.html` in a browser. PNG export uses html2canvas from jsDelivr, so an internet connection is needed for that feature. Print / Save PDF uses the browser's print dialog.

## Deploy to Vercel
1. Create a GitHub repository.
2. Upload all three files (`index.html`, `style.css`, `script.js`) to the repository root.
3. In Vercel, choose **Add New → Project** and import that GitHub repository.
4. Framework Preset: **Other**. Build Command: leave blank. Output Directory: `.`.
5. Click **Deploy**. No environment variables or backend are required.

Every new GitHub commit will trigger a new Vercel deployment.
