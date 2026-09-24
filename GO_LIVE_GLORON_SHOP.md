# GLORON.SHOP — GoDaddy Go-Live Checklist

This package is prepared for **https://gloron.shop/**.

## 1. Upload the website
Upload the **contents** of this folder (not the outer folder itself) into the hosting account's web root, commonly `public_html` or the primary domain's document root.

The root should contain:
- `index.html`
- `.htaccess`
- `robots.txt`
- `sitemap.xml`
- `favicon.svg`
- `css/`
- `js/`
- `assets/`

## 2. Connect the domain
If `gloron.shop` is already attached to the GoDaddy hosting account, do not change DNS just for this upload.

If it is not attached, set the domain's DNS/hosting connection according to the GoDaddy hosting account's instructions. Do not delete existing DNS records without checking what they are used for.

## 3. SSL
Make sure an SSL certificate is active for `gloron.shop`. The included `.htaccess` redirects visitors to HTTPS.

## 4. Test these URLs
- https://gloron.shop/
- https://gloron.shop/robots.txt
- https://gloron.shop/sitemap.xml

## 5. Review system
The site contains the shared-review code, but you still need to put your **Supabase project URL and public anon key** into `js/main.js` and run the supplied SQL setup. Never put a Supabase service-role/secret key in the website.

## 6. Razorpay
The checkout button is currently a placeholder. Complete Razorpay verification first, then connect the live payment integration.

## 7. Before launch
Confirm:
- final printed MRP vs website selling price
- final INCI/ingredient list
- actual manufacturer/licence details
- privacy policy
- terms & conditions
- shipping policy
- return/replacement policy
- final WhatsApp number
- Instagram/Facebook links
- Razorpay live credentials/configuration

The current package uses the website selling price of **₹1,599**. Your supplied label image shows **MRP ₹1,499**, so resolve that mismatch before publishing.
