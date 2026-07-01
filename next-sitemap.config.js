/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://onsitechairmassage.com', // Thay bằng domain thật của bạn
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/booking/success'], // Loại bỏ các trang không cần index (nếu có)
}
