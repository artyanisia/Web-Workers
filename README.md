Web Workers Project - API Fetching & Expiry Handling
Overview
Welcome to my Web Workers project! 🎉 This mini project demonstrates how you can use two Web Workers to efficiently handle data fetching and manage pagination for an API-based table. It's all about making sure your data stays fresh and responsive!

Features
Worker 1: API Fetcher:
This worker fetches data from an API and dynamically builds a table for you to interact with.
The data is stored in session storage, so you don’t have to worry about reloading it constantly. Super smooth!

Worker 2: Expiry Worker:
Keeps an eye on stale pages.
When the data gets old, this worker will automatically fetch the expired pages again, keeping your table up-to-date without any manual refreshing.
Interactive Pagination:

You can choose how many items you want to see per page, giving you control over your view and experience. The workers handle everything behind the scenes!

Explore the project, interact with the pagination, and see the workers in action! 🚀
